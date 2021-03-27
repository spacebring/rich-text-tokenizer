# rich-text-tokenizer

[![npm package](https://badge.fury.io/js/rich-text-tokenizer.svg)](https://www.npmjs.org/package/rich-text-tokenizer)
[![Dependency Status](https://david-dm.org/andcards/rich-text-tokenizer.svg)](https://david-dm.org/andcards/rich-text-tokenizer)
[![devDependency Status](https://david-dm.org/andcards/rich-text-tokenizer/dev-status.svg)](https://david-dm.org/andcards/rich-text-tokenizer#info=devDependencies)

Markdown tokenization made easy.

### Installation

```
yarn add rich-text-tokenizer
```

### The Gist

```javascript
import { parseText, parseMarkdown } from "rich-text-tokenizer";

parseText("Value your time. Provide excellent service to members. andcards.com");

parseMarkdown("Value your time. Provide excellent service to members. [andcards](https://www.andcards.com)");
```

### License

MIT
