const text = `
/* PrismJS 1.22.0
/**
 * Styling based on One Dark Pro theme: https://github.com/Binaryify/OneDark-Pro
 */

pre {
  font-family: 'Fira Code', monospace;
  font-size: 20px;
}

body {
  background-color: #1e1e1e;
  color: #e5c07b;

  width: 1200px;
  height: 800px;
}

code[class*="language-"],
pre[class*="language-"] {
  color: #abb2bf;
  background: none;
  font-family: 'Courier New', Courier, monospace;
  font-size: 1em;
  text-align: left;
  white-space: pre;
  word-spacing: normal;
  word-break: normal;
  word-wrap: normal;
  line-height: 1.5;

  -moz-tab-size: 4;
  -o-tab-size: 4;
  tab-size: 4;

  -webkit-hyphens: none;
  -moz-hyphens: none;
  -ms-hyphens: none;
  hyphens: none;
}

/* Code blocks */
pre[class*="language-"] {
  padding: 1em;
  margin: 0.5em 0;
  overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
  background: #2d2d2d;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
  padding: 0.1em;
  border-radius: 0.3em;
  white-space: normal;
}

.token.comment,
.token.block-comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #7f848e;
}

.token.punctuation {
  color: #abb2bf;
}

.token.tag,
.token.attr-name,
.token.namespace,
.token.deleted {
  color: #e06c75;
}

.token.function-name {
  color: #61afef;
}

.token.boolean,
.token.number {
  color: #d19a66;
}
.token.function {
  color: #61afef;
}

.token.property,
.token.class-name,
.token.constant,
.token.symbol {
  color: #e06c75;
}

.token.selector,
.token.important,
.token.atrule,
.token.keyword,
.token.builtin {
  color: #c678dd;
}

.token.string,
.token.char,
.token.attr-value,
.token.regex,
.token.variable {
  color: #98c379;
}

.token.operator {
  color: #56b6c2;
}
.token.entity,
.token.url {
  color: #67cdcc;
}

.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}

.token.entity {
  cursor: help;
}

.token.inserted {
  color: green;
}
`;

export default text;
