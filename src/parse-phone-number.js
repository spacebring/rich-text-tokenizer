// Reference: https://github.com/gregjacobs/Autolinker.js/blob/master/src/parser/phone-number-utils.ts
const REGEX_DELIMITERS = /[-. ()]/;
const REGEX_PHONE =
  /(?:(?:(?:(\+)?\d{1,3}[-. ]?)?\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4})|(?:(\+)(?:9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)[-. ]?(?:\d[-. ]?){6,12}\d+))([,;]+[0-9]+#?)*/;

function parseValidPhoneNumber(text) {
  const hasDelimiters = text.charAt(0) === "+" || REGEX_DELIMITERS.test(text);
  return hasDelimiters && REGEX_PHONE.exec(text);
}

export default parseValidPhoneNumber;
