// Reference: https://www.regular-expressions.info/email.html
const REGEX_EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

function parseEmail(text) {
  return REGEX_EMAIL.exec(text);
}

export default parseEmail;
