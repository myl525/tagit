// import
const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

// middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'src/public')));

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'hbs');

// routes
const index = require('./src/routes/index.js');
const videoPlayer = require('./src/routes/video-player.js');

app.use('/', index);
app.use('/', videoPlayer);

app.listen(5000, () => {
    console.log('Listening on port 5000');
});

