const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path');
const ejs = require('ejs')

const fs = require("fs");
const { json } = require('stream/consumers');

const jsonData = JSON.parse(fs.readFileSync('./data/rare_words.json', 'utf-8'));

app.use(express.json())
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vues')); // dossier des templates


app.get("/random", (req,res) => {
    const randomIndex = Math.floor(Math.random() * jsonData.length);
    const randomWord = jsonData[randomIndex];
    console.log(randomWord);
    res.status(200).json(randomWord);
})

app.get("/word/:word", (req,res) => {
    const word =  req.params.word
    const elm = jsonData.find(obj => obj.Mot.toLowerCase() === word.toLowerCase());
    res.status(200).json(elm);
})

app.get('/template/:word', (req, res) => {
    const word = req.params.word;
    const mot = jsonData.find(obj => obj.Mot.toLowerCase() === word.toLowerCase());

    if (!mot) return res.status(404).send("Mot introuvable");

    res.render('mot', { mot }); // passe l'objet à la vue
});

module.exports = app;