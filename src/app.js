const express = require('express');
require('dotenv').config();
require('./schedule')

const app = express()

const PORT = process.env.PORT || 8000;

app.get('/', function (req, res) {
    res.send('Discord Bot Running')
})


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})