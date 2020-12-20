const prism = require('prismjs');
const express = require('express');
const screenshotter = require('node-server-screenshot');

const app = express();

// The code snippet you want to highlight, as a string
const code = `

const getPrediction = async (): Promise<void> => {
  if (!readyForPrediction) return;
  const classes = ["Daisy", "Dandelion", "Rose", "Sunflower", "Tulip"];
  var imageTensor = await imageToTensor(imageBase64);
  if (model !== undefined) {
    const pred = model.predict(imageTensor) as tf.Tensor;
    const results = pred.dataSync();
    let currMaxIndex = 0;
    let currMax = -1;
    for (let i = 0; i < results.length; ++i) {
      if (results[i] >= currMax) {
        currMax = results[i];
        currMaxIndex = i;
      }
    }
    setPrediction(classes[currMaxIndex]);
    setPredicted(true);
  } else {
    throw new Error("model is undefined");
  }
};


`;

const addSurround = (text) => `<head>
<link rel=\"stylesheet\" href=\"prism.css\">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
</head>` + "<body><pre>" + text + "</pre></body>"

// Returns a highlighted HTML string
const html = addSurround(prism.highlight(code, prism.languages.javascript, 'javascript'));
console.log(html);

app.get('/prism.css', function(req, res) {
  res.sendFile(__dirname + '/www/prism.css');
});

app.get('/', function(req, res) {
  res.send(html);
  screenshotter.fromHTML(
    'This has been modified by injecting the HTML',
    "test.png",
    {inject: {
        url: "https://en.wikipedia.org/wiki/Main_Page",
        selector: {className: "mw-wiki-logo"}
    }},
    function(){
        //an image of the HTML has been saved at ./test.png
    }
);
});

var server = app.listen(8000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log(`Express app listening at http://localhost:${port}`)

})
