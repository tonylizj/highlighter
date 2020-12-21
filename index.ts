import prism from 'prismjs';
import express from 'express';
import bodyParser from 'body-parser';
import nodeHtmlToImage from 'node-html-to-image';
import { AddressInfo } from 'net';

import styles from './style';

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const addSurround = (text: string) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${styles}
</style>
</head><body><pre>`}${text}</pre></body></html>`;

app.post('/', (req, res) => {
  const code = req.body.text;
  const inputHtml = addSurround(prism.highlight(code, prism.languages.javascript, 'javascript'));
  nodeHtmlToImage({
    output: './imageOutput/output.png',
    html: inputHtml,
    puppeteerArgs: {
      args: ['--no-sandbox'],
    },
  }).then((() => {
    res.sendFile('imageOutput/output.png', { root: '.' });
  }));
});

const listenport: number = parseInt(`${process.env.PORT}`, 10) || 5000;

const server = app.listen(listenport, () => {
  const host = (server.address() as AddressInfo).address;
  const { port } = server.address() as AddressInfo;
  console.log(`Express app listening at http://${host}:${port}`);
});
