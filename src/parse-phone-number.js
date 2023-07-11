import { findPhoneNumbersInText } from "libphonenumber-js";

function parseValidPhoneNumber(text) {
  if (typeof text !== "string") {
    return null;
  }
  const matches = findPhoneNumbersInText(text);
  if (matches.length > 0) {
    const match = matches[0];
    const token = [text.substring(match.startsAt, match.endsAt)];
    token.index = match.startsAt;
    return token;
  }
  return null;
}

export default parseValidPhoneNumber;
