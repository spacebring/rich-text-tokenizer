import { v1 as uuidV1 } from "uuid";
import {
  REGEX_EMAIL,
  REGEX_HASHTAG,
  REGEX_MENTION,
  REGEX_PHONE,
  REGEX_URL_NAKED,
  getResultFromTokenEmail,
  getResultFromTokenHashtag,
  getResultFromTokenMention,
  getResultFromTokenPhone,
  getResultFromTokenUrlNaked,
  getTypeText,
  parseToken,
} from "./autolinker";
import replaceHashesWithTokens from "./hash";

// Reference: https://www.bigomega.dev/markdown-parser
const REGEX_MARKDOWN_BOLD = /(\*\*)(.*?)\1|(__)(.*?)\3/;
const REGEX_MARKDOWN_URL = /\[(.*?)\]\((.*?)\)/;
const REGEX_MARKDOWN_ITALIC = /(\*)(.*?)\1|(_)(.*?)\3/;
const REGEX_MARKDOWN_STRIKOTHROUGH = /(~~)(.*?)\1/;

function getResultFromTokenBold(token) {
  if (token[1]) {
    return { type: "bold", value: token[2] };
  }
  if (token[3]) {
    return { type: "bold", value: token[4] };
  }
  return null;
}

function getResultFromTokenStrikethrough(token) {
  if (token[1]) {
    return { type: "strikethrough", value: token[2] };
  }
  return null;
}

function getResultFromTokenUrl(token) {
  if (token[1] && token[2]) {
    return { type: "link", href: token[2], value: token[1] };
  }
  return null;
}

function getResultFromTokenItalic(token) {
  if (token[1]) {
    return { type: "italic", value: token[2] };
  }
  if (token[3]) {
    return { type: "italic", value: token[4] };
  }
  return null;
}

function parseTokenWithChildren({ markdown, parse, result, token }) {
  if (!result) {
    return getTypeText(markdown);
  }
  return [
    ...parse(markdown.substring(0, token.index)),
    { ...result, children: parse(result.value) },
    ...parse(markdown.substring(token.index + token[0].length)),
  ];
}

function parseMarkdownStrikethroughAndBoldAndItalic(markdown) {
  const tokenStrikethrough = REGEX_MARKDOWN_STRIKOTHROUGH.exec(markdown);
  if (tokenStrikethrough) {
    return parseTokenWithChildren({
      markdown,
      parse: parseMarkdownStrikethroughAndBoldAndItalic,
      result: getResultFromTokenStrikethrough(tokenStrikethrough),
      token: tokenStrikethrough,
    });
  }
  const tokenBold = REGEX_MARKDOWN_BOLD.exec(markdown);
  if (tokenBold) {
    return parseTokenWithChildren({
      markdown,
      parse: parseMarkdownStrikethroughAndBoldAndItalic,
      result: getResultFromTokenBold(tokenBold),
      token: tokenBold,
    });
  }
  const tokenItalic = REGEX_MARKDOWN_ITALIC.exec(markdown);
  if (tokenItalic) {
    return parseTokenWithChildren({
      markdown,
      parse: parseMarkdownStrikethroughAndBoldAndItalic,
      result: getResultFromTokenItalic(tokenItalic),
      token: tokenItalic,
    });
  }
  return getTypeText(markdown);
}

function parseMarkdownPrimitives(text) {
  // Parse markdown links in order to prevent closing ")" to be considered as a part of the link.
  const tokenUrl = REGEX_MARKDOWN_URL.exec(text);
  if (tokenUrl) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenUrl(tokenUrl),
      text,
      token: tokenUrl,
    });
  }
  const tokenUrlNaked = REGEX_URL_NAKED.exec(text);
  if (tokenUrlNaked) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenUrlNaked(tokenUrlNaked),
      text,
      token: tokenUrlNaked,
    });
  }
  const tokenHashtag = REGEX_HASHTAG.exec(text);
  if (tokenHashtag) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenHashtag(tokenHashtag),
      text,
      token: tokenHashtag,
    });
  }
  const tokenMention = REGEX_MENTION.exec(text);
  if (tokenMention) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenMention(tokenMention),
      text,
      token: tokenMention,
    });
  }
  const tokenEmail = REGEX_EMAIL.exec(text);
  if (tokenEmail) {
    return parseToken({
      parse: parseMarkdownPrimitives,
      result: getResultFromTokenEmail(tokenEmail),
      text,
      token: tokenEmail,
    });
  }
  const tokenPhone = REGEX_PHONE.exec(text);
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
      if (["email", "hashtag", "link", "mention", "phone"].includes(token.type)) {
        const tokenKey = uuidV1();
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
