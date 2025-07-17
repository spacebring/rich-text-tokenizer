# rich-text-tokenizer

[![npm package](https://badge.fury.io/js/rich-text-tokenizer.svg)](https://www.npmjs.org/package/rich-text-tokenizer)
[![Dependency Status](https://david-dm.org/spacebring/rich-text-tokenizer.svg)](https://david-dm.org/spacebring/rich-text-tokenizer)
[![devDependency Status](https://david-dm.org/spacebring/rich-text-tokenizer/dev-status.svg)](https://david-dm.org/spacebring/rich-text-tokenizer#info=devDependencies)

Rich text and markdown tokenization made easy.

### Installation

```
yarn add rich-text-tokenizer
```

### The Gist

```javascript
import { parseText, parseMarkdown } from "rich-text-tokenizer";

parseText("Value your time. Provide excellent service to members. spacebring.com");

parseMarkdown("Value your time. Provide excellent service to members. [spacebring](https://www.spacebring.com)");
```

### License

MIT
