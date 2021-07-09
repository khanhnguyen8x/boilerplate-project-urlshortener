require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

var map = new Map();

app.use(cors());
// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({extended: true}));
//form-urlencoded

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({greeting: 'hello API'});
});

app.post("/api/shorturl", function (req, res) {
  //console.log(req.body);
  var original_url = req.body.url;
  //console.log(original_url);
  if (!is_url(original_url)) {
    return res.status(400).send({error: "invalid url"});
  }

  var short_url = Math.floor(Math.random() * 1000);
  map.set(short_url, original_url);
  console.log(map);

  res.json({"original_url": original_url, "short_url": short_url});
});

app.get("/api/shorturl/:url?", function (req, res) {
  var short_url = req.params.url;
  var key;
  if (!isNaN(short_url)) {
    key = parseInt(short_url);
  } else {
    return res.status(400).send({error: "invalid url"});
  }
  var original_url = map.get(key);
  console.log(map);
  console.log("short_url = " + short_url);
  console.log("original_url = " + original_url);
  if (original_url) {
    return res.redirect(original_url);
  } else {
    return res.status(400).send({error: "invalid url"});
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

function is_url(str) {
  var regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  } else {
    return false;
  }
}