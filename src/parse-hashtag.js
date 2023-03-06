import hashtagRegex from "hashtag-regex";

const REGEX_HASHTAG = hashtagRegex();

function parseHashtag(text) {
  return REGEX_HASHTAG.exec(text);
}

export default parseHashtag;
