const prism = require('prismjs');
const express = require('express');
const bodyParser = require('body-parser');
const nodeHtmlToImage = require('node-html-to-image');

const styles = require('./style');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const addSurround = (text) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${styles.text}
</style>
</head><body><pre>`}${text}</pre></body></html>`;

app.post('/', (req, res) => {
  console.log(req.body);
  const code = req.body.text;
  const inputHtml = addSurround(prism.highlight(code, prism.languages.javascript, 'javascript'));
  nodeHtmlToImage({
    output: './test.png',
    html: inputHtml,
  }).then((() => {
    res.sendFile(`${__dirname}/test.png`);
  }));
});

const server = app.listen(8000, () => {
  // const host = server.address().address;
  const { port } = server.address();

  console.log(`Express app listening at http://localhost:${port}`);
});
