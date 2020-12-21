"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prismjs_1 = __importDefault(require("prismjs"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const node_html_to_image_1 = __importDefault(require("node-html-to-image"));
const style_1 = __importDefault(require("./style"));
const app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
const addSurround = (text) => `${`<html><head>
<link rel="stylesheet" href="style.css">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
<style>
${style_1.default}
</style>
</head><body><pre>`}${text}</pre></body></html>`;
app.get('/', (req, res) => {
    res.sendFile('html/sendPost.html', { root: '.' });
});
app.post('/', (req, res) => {
    const code = req.body.text;
    const inputHtml = addSurround(prismjs_1.default.highlight(code, prismjs_1.default.languages.javascript, 'javascript'));
    node_html_to_image_1.default({
        output: './imageOutput/output.png',
        html: inputHtml,
        puppeteerArgs: {
            args: ['--no-sandbox'],
        },
    }).then((() => {
        res.sendFile('imageOutput/output.png', { root: '.' });
    }));
});
const listenport = parseInt(`${process.env.PORT}`, 10) || 5000;
const server = app.listen(listenport, () => {
    const host = server.address().address;
    const { port } = server.address();
    console.log(`Express app listening at http://${host}:${port}`);
});
