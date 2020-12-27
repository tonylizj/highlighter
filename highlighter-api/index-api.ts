import prism from 'prismjs';
import express from 'express';
import nodeHtmlToImage from 'node-html-to-image';
import { AddressInfo } from 'net';

import styles from './style/style'; // eslint-disable-line

const loadLanguages: Function = require('prismjs/components/');

const baseLanguages = ['markup', 'css', 'clike', 'javascript'];
const additionalSupportedLanguages = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker'];

loadLanguages(additionalSupportedLanguages);

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/favicon.ico', express.static('images/favicon.ico'));

const addSurround = (text: string, fontSize: number) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${styles(fontSize)}
</style>
</head><body><pre>`}${text}</pre></body></html>`;

const getGrammar = (langName: string) => prism.languages[langName];

const mediumQualityValue = 20;
const highQualityValue = 40;
const extremeQualityValue = 80;

const getQuality = (quality: string) => {
  if (quality === 'medium') {
    return mediumQualityValue;
  } if (quality === 'high') {
    return highQualityValue;
  } if (quality === 'extreme') {
    return extremeQualityValue;
  }
  return 0;
};

const mediumQualityLimit = 4000;
const highQualityLimit = 2000;
const extremeQualityLimit = 800;

const cutoffIndicator = (quality: string) => {
  if (quality === 'medium') {
    return `Code length cannot exceed ${mediumQualityLimit} characters for quality: '${quality}'. The input has been truncated.`;
  } if (quality === 'high') {
    return `Code length cannot exceed ${highQualityLimit} characters for quality: '${quality}'. The input has been truncated.`;
  }
  return `Code length cannot exceed ${extremeQualityLimit} characters for quality: '${quality}'. The input has been truncated.`;
};

const addCutOffIndicator = (text: string, quality: string) => {
  const ind = cutoffIndicator(quality).toLocaleUpperCase();
  return `<span style="color:white">WARNING: ${ind}</span>\n${text}\n<span style="color:white">WARNING: ${ind}</span>`;
};

const processToHTML = (text: string, lang: string, quality: string, cutoff: boolean) => {
  if (cutoff) {
    return addSurround(addCutOffIndicator(prism.highlight(text, getGrammar(lang), lang), quality),
      getQuality(quality));
  }
  return addSurround(prism.highlight(text, getGrammar(lang), lang), getQuality(quality));
};

const generateInputHTML = (text: string, lang: string, quality: string) => {
  if (baseLanguages.includes(lang) || additionalSupportedLanguages.includes(lang)) {
    const qualityNum = getQuality(quality);
    if (qualityNum === mediumQualityValue && text.length > mediumQualityLimit) {
      return processToHTML(text.substring(0, mediumQualityLimit), lang, quality, true);
    } if (qualityNum === highQualityValue && text.length > mediumQualityLimit) {
      return processToHTML(text.substring(0, highQualityLimit), lang, quality, true);
    } if (qualityNum === extremeQualityValue && text.length > extremeQualityLimit) {
      return processToHTML(text.substring(0, extremeQualityLimit), lang, quality, true);
    }
    return processToHTML(text, lang, quality, false);
  }
  return '';
};

app.get('/', (req, res) => {
  res.sendFile('html/sendPost.html', { root: './highlighter-api' });
});

app.post('/', async (req, res) => {
  const { text, lang, quality }: { text: string, lang: string, quality: string } = req.body;
  const inputHTML = generateInputHTML(text, lang, quality);
  if (inputHTML !== '') {
    // res.send(inputHtml);
    const image = await nodeHtmlToImage({
      html: inputHTML,
      puppeteerArgs: {
        args: ['--no-sandbox'],
      },
    });
    res.writeHead(200, { 'Content-disposition': 'attachment; filename=generatedPicture.png', 'Content-Type': 'image/png' });
    res.end(image, 'binary');
  } else {
    res.end(`Invalid language specified: '${lang}' or invalid quality specified: '${quality}'. No result can be generated.`);
  }
});

app.post('/downloadHTML', async (req, res) => {
  const { text, lang, quality }: { text: string, lang: string, quality: string } = req.body;
  const inputHTML = generateInputHTML(text, lang, quality);
  res.send(inputHTML);
});

const listenport: number = parseInt(`${process.env.PORT}`, 10) || 5000;

const server = app.listen(listenport, () => {
  const host = (server.address() as AddressInfo).address;
  const { port } = server.address() as AddressInfo;
  console.log(`Express app listening at http://${host}:${port}`);
});
