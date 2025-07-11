const { log } = require('console');
const express = require('express');
const fs = require("fs")
const app = express();

const jsonData = JSON.parse(fs.readFileSync('./data/rare_words.json', 'utf-8'));

app.use(express.json)

app.get("/:word", (req,res) => {
    log("non")
    const word =  req.params.word
    let elm = jsonData.findIndex(m => m.mot === word)
    res.json(elm);
})