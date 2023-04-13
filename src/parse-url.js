import urlRegexSafe from "url-regex-safe";

function parseUrlNaked(text) {
  return urlRegexSafe({ strict: true }).exec(text);
}

export default parseUrlNaked;
