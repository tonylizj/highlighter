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
<link rel=\"stylesheet\" href=\"style.css\">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet"> 
</head>` + "<body><pre>" + text + "</pre></body>"

// Returns a highlighted HTML string
const html = addSurround(prism.highlight(code, prism.languages.javascript, 'javascript'));
console.log(html);

app.get('/style.css', function(req, res) {
  res.sendFile(__dirname + '/style.css');
});

app.get('/test', function(req, res) {
  //console.log(req);
  res.send(html);
});

app.get('/', function(req, res) {
  //console.log(req);
  res.send(html);
  screenshotter.fromURL(req.protocol+"://"+req.headers.host + "/test", 'test.png');
  //setTimeout(() => {res.download("./test.png", "test.png", (err) => {if (err) console.log(err)})}, 3000);
});

var server = app.listen(8000, function () {

  var host = server.address().address
  var port = server.address().port

  console.log(`Express app listening at http://localhost:${port}`)

})
