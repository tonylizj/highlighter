import prism from 'prismjs';
import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import { AddressInfo } from 'net';

import styles from './style'; // eslint-disable-line

const loadLanguages: Function = require('prismjs/components/');

const baseLanguages = ['markup', 'css', 'clike', 'javascript'];
const additionalSupportedLanguages = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker'];

loadLanguages(additionalSupportedLanguages);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const addSurround = (text: string, fontSize: number) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${styles(fontSize)}
</style>
</head><body><pre>`}${text}</pre></body></html>`;

const getGrammar = (langName: string) => prism.languages[langName];

const getQuality = (quality: string) => {
  if (quality === 'medium') {
    return 20;
  } if (quality === 'high') {
    return 40;
  } if (quality === 'extreme') {
    return 80;
  }
  return 0;
};

app.get('/', (req, res) => {
  res.sendFile('html/sendPost.html', { root: '.' });
});

app.post('/', async (req, res) => {
  const { text, lang, quality }: { text: string, lang: string, quality: string } = req.body;
  let inputHtml = '';
  if (baseLanguages.includes(lang) || additionalSupportedLanguages.includes(lang)) {
    if (getQuality(quality) === 0) {
      res.end(`Invalid quality specified: '${quality}'. No result can be generated.`);
    } else {
      inputHtml = addSurround(prism.highlight(text, getGrammar(lang), lang), getQuality(quality));
    }
  }
  if (inputHtml !== '') {
    // res.send(inputHtml);
    const image = await nodeHtmlToImage({
      html: inputHtml,
      puppeteerArgs: {
        args: ['--no-sandbox'],
      },
    });
    res.writeHead(200, { 'Content-Type': 'image/png' });
    res.end(image, 'binary');
  } else {
    res.end(`Invalid language specified: '${lang}'. No result can be generated.`);
  }
});

const listenport: number = parseInt(`${process.env.PORT}`, 10) || 5000;

const server = app.listen(listenport, () => {
  const host = (server.address() as AddressInfo).address;
  const { port } = server.address() as AddressInfo;
  console.log(`Express app listening at http://${host}:${port}`);
});
