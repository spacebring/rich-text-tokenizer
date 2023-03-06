import parseEmail from "./parse-email.js";
import parseHashtag from "./parse-hashtag.js";
import parseMention from "./parse-mention.js";
import parseValidPhoneNumber from "./parse-phone-number.js";
import parseUrlNaked from "./parse-url.js";

export function getResultFromTokenEmail(token) {
  if (token[0]) {
    return { type: "email", href: token[0], value: token[0] };
  }
  return null;
}

export function getResultFromTokenHashtag(token) {
  if (token[0]) {
    return { type: "hashtag", hashtag: token[0].substring(1), value: token[0] };
  }
  return null;
}

export function getResultFromTokenMention(token) {
  if (token[0]) {
    return { type: "mention", mention: token[0].substring(1), value: token[0] };
  }
  return null;
}

export function getResultFromTokenPhone(token) {
  if (token[0]) {
    return { type: "phone", href: token[0], value: token[0] };
  }
  return null;
}

export function getResultFromTokenUrlNaked(token) {
  if (token[0]) {
    return { type: "link", href: token[0], value: token[0] };
  }
  return null;
}

export function getTypeText(value) {
  if (value === "") {
    return [];
  }
  return [{ type: "text", value }];
}

export function parseToken({ parse, result, text, token }) {
  if (!result) {
    return getTypeText(text);
  }
  return [...parse(text.substring(0, token.index)), result, ...parse(text.substring(token.index + token[0].length))];
}

export function parseText(text) {
  const tokenUrlNaked = parseUrlNaked(text);
  if (tokenUrlNaked) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenUrlNaked(tokenUrlNaked),
      text,
      token: tokenUrlNaked,
    });
  }
  const tokenHashtag = parseHashtag(text);
  if (tokenHashtag) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenHashtag(tokenHashtag),
      text,
      token: tokenHashtag,
    });
  }
  const tokenMention = parseMention(text);
  if (tokenMention) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenMention(tokenMention),
      text,
      token: tokenMention,
    });
  }
  const tokenEmail = parseEmail(text);
  if (tokenEmail) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenEmail(tokenEmail),
      text,
      token: tokenEmail,
    });
  }
  const tokenPhone = parseValidPhoneNumber(text);
  if (tokenPhone) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenPhone(tokenPhone),
      text,
      token: tokenPhone,
    });
  }
  return getTypeText(text);
}
