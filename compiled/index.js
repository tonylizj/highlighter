"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const express_1 = __importDefault(require("express"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
const style_1 = __importDefault(require("./style")); // eslint-disable-line
const loadLanguages = require('prismjs/components/');
const baseLanguages = ['markup', 'css', 'clike', 'javascript'];
const additionalSupportedLanguages = ['typescript', 'c', 'cpp', 'csharp', 'python', 'java', 'go', 'julia', 'kotlin', 'haskell', 'lisp', 'lua', 'makefile', 'markdown', 'matlab', 'mongodb', 'objectivec', 'pascal', 'perl', 'php', 'r', 'racket', 'ruby', 'rust', 'scala', 'scheme', 'swift', 'visual-basic', 'json', 'latex', 'graphql', 'docker'];
loadLanguages(additionalSupportedLanguages);
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
const addSurround = (text, fontSize) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${style_1.default(fontSize)}
</style>
</head><body><pre>`}${text}</pre></body></html>`;
const getGrammar = (langName) => prismjs_1.default.languages[langName];
const mediumQualityValue = 20;
const highQualityValue = 40;
const extremeQualityValue = 80;
const getQuality = (quality) => {
    if (quality === 'medium') {
        return mediumQualityValue;
    }
    if (quality === 'high') {
        return highQualityValue;
    }
    if (quality === 'extreme') {
        return extremeQualityValue;
    }
    return 0;
};
const mediumQualityLimit = 4000;
const highQualityLimit = 2000;
const extremeQualityLimit = 1000;
const cutoffIndicator = (quality) => {
    if (quality === 'medium') {
        return `Code length cannot exceed ${mediumQualityLimit} characters for quality: '${quality}'. The input has been truncated.`;
    }
    if (quality === 'high') {
        return `Code length cannot exceed ${highQualityLimit} characters for quality: '${quality}'. The input has been truncated.`;
    }
    return `Code length cannot exceed ${extremeQualityLimit} characters for quality: '${quality}'. The input has been truncated.`;
};
const addCutOffIndicator = (text, quality) => {
    const ind = cutoffIndicator(quality);
    return `${ind}\n${text}${ind}\n`;
};
const processToHTML = (text, lang, quality, cutoff) => {
    if (cutoff) {
        return addSurround(prismjs_1.default.highlight(addCutOffIndicator(text, quality), getGrammar(lang), lang), getQuality(quality));
    }
    return addSurround(prismjs_1.default.highlight(text, getGrammar(lang), lang), getQuality(quality));
};
const generateInputHTML = (text, lang, quality) => {
    if (baseLanguages.includes(lang) || additionalSupportedLanguages.includes(lang)) {
        const qualityNum = getQuality(quality);
        if (qualityNum === mediumQualityValue && text.length > mediumQualityLimit) {
            return processToHTML(text.substring(0, mediumQualityLimit), lang, quality, true);
        }
        if (qualityNum === highQualityValue && text.length > mediumQualityLimit) {
            return processToHTML(text.substring(0, highQualityLimit), lang, quality, true);
        }
        if (qualityNum === extremeQualityValue && text.length > extremeQualityLimit) {
            return processToHTML(text.substring(0, extremeQualityLimit), lang, quality, true);
        }
        return processToHTML(text, lang, quality, false);
    }
    return '';
};
app.get('/', (req, res) => {
    res.sendFile('html/sendPost.html', { root: '.' });
});
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text, lang, quality } = req.body;
    const inputHTML = generateInputHTML(text, lang, quality);
    if (inputHTML !== '') {
        // res.send(inputHtml);
        const image = yield node_html_to_image_1.default({
            html: inputHTML,
            puppeteerArgs: {
                args: ['--no-sandbox'],
            },
        });
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(image, 'binary');
    }
    else {
        res.end(`Invalid language specified: '${lang}' or invalid quality specified: '${quality}'. No result can be generated.`);
    }
}));
const listenport = parseInt(`${process.env.PORT}`, 10) || 5000;
const server = app.listen(listenport, () => {
    const host = server.address().address;
    const { port } = server.address();
    console.log(`Express app listening at http://${host}:${port}`);
});
