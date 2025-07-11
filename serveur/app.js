const express = require('express');
const cors = require('cors')
const app = express();
const path = require('path');
const ejs = require('ejs')

const fs = require("fs");
const { json } = require('stream/consumers');

const jsonData = JSON.parse(fs.readFileSync('./data/rare_words.json', 'utf-8'));
const jsonFav = JSON.parse(fs.readFileSync('./data/fav.json', 'utf-8'));

app.use(express.json())
app.use(cors())

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vues')); // dossier des templates

const favPath = path.join(__dirname, 'data', 'fav.json');

// Fonction pour charger le JSON de favoris en toute sécurité
function loadFavs() {
  try {
    const content = fs.readFileSync(favPath, 'utf8').trim();
    if (!content) return {};
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// Fonction pour sauvegarder le JSON de favoris
function saveFavs(favs) {
  fs.writeFileSync(favPath, JSON.stringify(favs, null, 2), 'utf8');
}


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

app.get('/mots/:word', (req, res) => {
    const word = req.params.word;
    const mot = jsonData.find(obj => obj.Mot.toLowerCase() === word.toLowerCase());

    if (!mot) return res.status(404).send("Mot introuvable");

    res.render('mots', { mot }); // passe l'objet à la vue
});

app.post('/favoris/mots', (req, res) => {
    const { action, mot } = req.body;
  
    if (action !== 'ajouter' && action !== 'retirer') {
      return res.status(400).json({ error: "Action non reconnue" });
    }
    if (!mot || typeof mot !== 'string') {
      return res.status(400).json({ error: "Le paramètre 'mot' est requis et doit être une chaîne" });
    }
  
    try {
      const favoris = loadFavs();
  
    if(action == 'ajouter'){

        if (favoris[mot]) {
            favoris[mot] += 1;
        } else {
            favoris[mot] = 1;
        }
    } else if(action == 'retirer'){
        if (favoris[mot] && favoris[mot] > 0 ) {
            favoris[mot] -= 1;
        }
    }
  
      saveFavs(favoris);
  
      res.json({
        message: "Mot ajouté avec succès",
        mot: mot,
        count: favoris[mot],
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout du mot:', error);
      res.status(500).json({ error: "Erreur interne du serveur" });
    }
  });
module.exports = app;