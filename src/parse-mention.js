// Reference: https://stackoverflow.com/a/15265606/1308757
const REGEX_MENTION = /\B@[a-z0-9_-]+/;

function parseMention(text) {
  return REGEX_MENTION.exec(text);
}

export default parseMention;
