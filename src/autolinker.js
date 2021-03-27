import emailRegex from "email-regex";
import hashtagRegex from "hashtag-regex";
import urlRegex from "url-regex";

export const REGEX_EMAIL = emailRegex();
export const REGEX_HASHTAG = hashtagRegex();
// Reference: https://stackoverflow.com/a/15265606/1308757
export const REGEX_MENTION = /\B@[a-z0-9_-]+/;
// Reference: https://github.com/gregjacobs/Autolinker.js/blob/ca4b19d76074e5e5e4e8fc11d3d73dbce40f5132/src/matcher/phone-matcher.ts#L14
export const REGEX_PHONE = /(?:(?:(?:(\+)?\d{1,3}[-\040.]?)?\(?\d{3}\)?[-\040.]?\d{3}[-\040.]?\d{4})|(?:(\+)(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)[-\040.]?(?:\d[-\040.]?){6,12}\d+))([,;]+[0-9]+#?)*/;
export const REGEX_URL_NAKED = urlRegex();

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
  const tokenUrlNaked = REGEX_URL_NAKED.exec(text);
  if (tokenUrlNaked) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenUrlNaked(tokenUrlNaked),
      text,
      token: tokenUrlNaked,
    });
  }
  const tokenHashtag = REGEX_HASHTAG.exec(text);
  if (tokenHashtag) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenHashtag(tokenHashtag),
      text,
      token: tokenHashtag,
    });
  }
  const tokenMention = REGEX_MENTION.exec(text);
  if (tokenMention) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenMention(tokenMention),
      text,
      token: tokenMention,
    });
  }
  const tokenEmail = REGEX_EMAIL.exec(text);
  if (tokenEmail) {
    return parseToken({
      parse: parseText,
      result: getResultFromTokenEmail(tokenEmail),
      text,
      token: tokenEmail,
    });
  }
  const tokenPhone = REGEX_PHONE.exec(text);
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
