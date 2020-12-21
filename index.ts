import prism from 'prismjs';
import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import { AddressInfo } from 'net';

import styles from './style';

const loadLanguages: Function = require('prismjs/components/');

const baseLanguages = ['markup', 'css', 'clike', 'javascript'];
const additionalSupportedLanguages = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker'];

loadLanguages(additionalSupportedLanguages);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const addSurround = (text: string) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${styles}
</style>
</head><body><pre>`}${text}</pre></body></html>`;

const getGrammar = (langName: string) => prism.languages[langName];

app.get('/', (req, res) => {
  console.log('Received GET request.');
  res.sendFile('html/sendPost.html', { root: '.' });
});

app.post('/', (req, res) => {
  console.log('Received POST request.');
  const { text, lang }: { text: string, lang: string } = req.body;
  let inputHtml = '';
  if (baseLanguages.includes(lang) || additionalSupportedLanguages.includes(lang)) {
    inputHtml = addSurround(prism.highlight(text, getGrammar(lang), lang));
  } else {
    console.log(`Invalid language specified: '${lang}'.`);
  }
  if (inputHtml !== '') {
    nodeHtmlToImage({
      output: './imageOutput/output.png',
      html: inputHtml,
      puppeteerArgs: {
        args: ['--no-sandbox'],
      },
    }).then((() => {
      res.sendFile('imageOutput/output.png', { root: '.' });
    }));
  } else {
    res.send(`Invalid language specified: '${lang}'. No result can be generated.`);
  }
});

const listenport: number = parseInt(`${process.env.PORT}`, 10) || 5000;

const server = app.listen(listenport, () => {
  const host = (server.address() as AddressInfo).address;
  const { port } = server.address() as AddressInfo;
  console.log(`Express app listening at http://${host}:${port}`);
});
