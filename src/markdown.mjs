import {
  getResultFromTokenEmail,
  getResultFromTokenHashtag,
  getResultFromTokenMention,
  getResultFromTokenPhone,
  getResultFromTokenUrlNaked,
  getTypeText,
  parseToken,
} from "./autolinker.mjs";
import parseEmail from "./parse-email.mjs";
import replaceHashesWithTokens from "./hash.mjs";
import parseHashtag from "./parse-hashtag.mjs";
import parseMention from "./parse-mention.mjs";
import parseValidPhoneNumber from "./parse-phone-number.mjs";
import parseUrlNaked from "./parse-url.mjs";

// Reference: https://www.bigomega.dev/markdown-parser
const REGEX_MARKDOWN_TEXT = /(\*\*)(.*?)\1|(__)(.*?)\3|(\*)(.*?)\5|(_)(.*?)\7|(~~)(.*?)\9/;
const REGEX_MARKDOWN_IMAGE = /!\[(.*?)\]\((.*?)\)/;
const REGEX_MARKDOWN_URL = /\[(.*?)\]\((.*?)\)/;

function getResultFromToken(token) {
  if (token[1]) {
    return { type: "bold", value: token[2] };
  }
  if (token[3]) {
    return { type: "bold", value: token[4] };
  }
  if (token[5]) {
    return { type: "italic", value: token[6] };
  }
  if (token[7]) {
    return { type: "italic", value: token[8] };
  }
  if (token[9]) {
    return { type: "strikethrough", value: token[10] };
  }
  return null;
}

function parseMarkdownStrikethroughAndBoldAndItalic(markdown) {
  const tokenUrlNaked = parseUrlNaked(markdown);
  if (tokenUrlNaked) {
    return getTypeText(markdown);
  }
  const token = REGEX_MARKDOWN_TEXT.exec(markdown);
  if (!token) {
    return getTypeText(markdown);
  }
  const result = getResultFromToken(token);
  if (!result) {
    return getTypeText(markdown);
  }
  const { value, ...resultWithNoValue } = result;
  return [
    ...parseMarkdownStrikethroughAndBoldAndItalic(markdown.substring(0, token.index)),
    { ...resultWithNoValue, children: parseMarkdownStrikethroughAndBoldAndItalic(value) },
    ...parseMarkdownStrikethroughAndBoldAndItalic(markdown.substring(token.index + token[0].length)),
  ];
}

function getResultFromTokenUrl(token) {
  const [value, href] = token.slice(1);
  if (href) {
    const children = parseMarkdownStrikethroughAndBoldAndItalic(value);
    if (children.length === 0) {
      return { type: "link", href, value };
    }
    if (children.length === 1 && children[0].type === "text") {
      return { type: "link", href, value };
    }
    return { type: "link", href, children };
  }
  return null;
}

function getResultFromTokenImage(token) {
  const [value, href] = token.slice(1);
  if (href) {
    return { type: "image", href, value };
  }
  return null;
}

function parseMarkdownPrimitives(text) {
  // Parse markdown links in order to prevent closing ")" to be considered as a part of the link.
  const tokenImage = REGEX_MARKDOWN_IMAGE.exec(text);
  if (tokenImage) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenImage(tokenImage),
      text,
      token: tokenImage,
    });
  }
  const tokenUrl = REGEX_MARKDOWN_URL.exec(text);
  if (tokenUrl) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenUrl(tokenUrl),
      text,
      token: tokenUrl,
    });
  }
  const tokenUrlNaked = parseUrlNaked(text);
  if (tokenUrlNaked) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenUrlNaked(tokenUrlNaked),
      text,
      token: tokenUrlNaked,
    });
  }
  const tokenHashtag = parseHashtag(text);
  if (tokenHashtag) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenHashtag(tokenHashtag),
      text,
      token: tokenHashtag,
    });
  }
  const tokenMention = parseMention(text);
  if (tokenMention) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenMention(tokenMention),
      text,
      token: tokenMention,
    });
  }
  const tokenEmail = parseEmail(text);
  if (tokenEmail) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenEmail(tokenEmail),
      text,
      token: tokenEmail,
    });
  }
  const tokenPhone = parseValidPhoneNumber(text);
  if (tokenPhone) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenPhone(tokenPhone),
      text,
      token: tokenPhone,
    });
  }
  return getTypeText(text);
}

function parseMarkdown(markdown) {
  const hashObject = {};
  // Replace primitives and replace with appropriate hashes.
  const markdownWithoutPrimitives = parseMarkdownPrimitives(markdown)
    .map((token) => {
      if (["email", "hashtag", "image", "link", "mention", "phone"].includes(token.type)) {
        const tokenKey = Date.now().toString(36) + Math.random().toString(36).substring(2);
        hashObject[tokenKey] = token;
        return tokenKey;
      }
      return token.value;
    })
    .join("");
  // Parse strikethrough, bold and italic text and replace with tokens.
  const markdownParsed = parseMarkdownStrikethroughAndBoldAndItalic(markdownWithoutPrimitives);
  // Replace hashes back with tokens.
  return replaceHashesWithTokens({
    children: markdownParsed,
    hashObject,
    parse: replaceHashesWithTokens,
  });
}

export default parseMarkdown;
