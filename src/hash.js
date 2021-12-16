function replaceHashesWithTokens({ children, hashObject, parse }) {
  const keys = Object.keys(hashObject);
  // Split value with hashes and keep the separator.
  // Reference: https://stackoverflow.com/a/12002085/1308757
  const keysRegex = new RegExp(`(${keys.join("|")})`, "g");
  return children.reduce((tokens, token) => {
    if (["strikethrough", "bold", "italic"].includes(token.type)) {
      return [
        ...tokens,
        {
          type: token.type,
          children: parse({ children: token.children, hashObject, parse }),
        },
      ];
    }
    // Do not parse if no keys. Otherwise `/()/g` regex with mess up emojis.
    if (keys.length === 0) {
      return [...tokens, token];
    }
    return [
      ...tokens,
      ...token.value
        .split(keysRegex)
        .filter((value) => value !== "")
        .map((value) => (hashObject[value] ? hashObject[value] : { type: "text", value })),
    ];
  }, []);
}

export default replaceHashesWithTokens;
