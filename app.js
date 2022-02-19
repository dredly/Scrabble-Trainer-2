const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/static'));

app.get('/', (req, res) => {
    res.render('index');
})

app.get('/timed', (req, res) => {
    res.render('timed');
})

app.get('/timed/play', (req, res) => {
    res.render('playtimed');
})

app.listen(3000, () => {
    console.log('Listening on port 3000');
})