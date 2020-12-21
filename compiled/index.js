"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const express_1 = __importDefault(require("express"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
const style_1 = __importDefault(require("./style"));
const loadLanguages = require('prismjs/components/');
const baseLanguages = ['markup', 'css', 'clike', 'javascript'];
const additionalSupportedLanguages = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker'];
loadLanguages(additionalSupportedLanguages);
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const addSurround = (text) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${style_1.default}
</style>
</head><body><pre>`}${text}</pre></body></html>`;
const getGrammar = (langName) => prismjs_1.default.languages[langName];
app.get('/', (req, res) => {
    console.log('Received GET request.');
    res.sendFile('html/sendPost.html', { root: '.' });
});
app.post('/', (req, res) => {
    console.log('Received POST request.');
    const { text, lang } = req.body;
    let inputHtml = '';
    if (baseLanguages.includes(lang) || additionalSupportedLanguages.includes(lang)) {
        inputHtml = addSurround(prismjs_1.default.highlight(text, getGrammar(lang), lang));
    }
    else {
        console.log(`Invalid language specified: '${lang}'.`);
    }
    if (inputHtml !== '') {
        node_html_to_image_1.default({
            output: './imageOutput/output.png',
            html: inputHtml,
            puppeteerArgs: {
                args: ['--no-sandbox'],
            },
        }).then((() => {
            res.sendFile('imageOutput/output.png', { root: '.' });
        }));
    }
    else {
        res.send(`Invalid language specified: '${lang}'. No result can be generated.`);
    }
});
const listenport = parseInt(`${process.env.PORT}`, 10) || 5000;
const server = app.listen(listenport, () => {
    const host = server.address().address;
    const { port } = server.address();
    console.log(`Express app listening at http://${host}:${port}`);
});
