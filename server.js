const express = require('express');

const app = express();

//const PORT = 3000;
const PORT = process.env.PORT || 3000;

const path = require('path');

app.use(express.static('./dist'));

app.get(/(.*?)/, (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');

});

app.listen(PORT, function () {
    console.log(`Your server available at http://localhost:${PORT}`);
});