const express = require('express');
const app = express();
const mysql = require('mysql2');

app.use(express.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password', // Mets ton vrai mot de passe MySQL ici
  database: 'gestion_tournois'
});

// Connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MySQL:', err);
    return;
  }
  console.log('MySQL Connected...');
});

// Route pour ajouter une équipe
app.post('/api/equipes', async (req, res) => {
  try {
    const { nomCapitaine, prenomCapitaine, nomEquipe, joueurs, tournoiChoisi } = req.body;

    // Vérification des données requises
    if (!nomCapitaine || !prenomCapitaine || !nomEquipe || !tournoiChoisi || !joueurs || joueurs.length === 0) {
      return res.status(400).send('Des informations sont manquantes');
    }

    // Insertion de l'équipe dans la table "Equipe"
    const sqlEquipe = 'INSERT INTO Equipe (nom_equipe, id_tournoi) VALUES (?, ?)';
    const valuesEquipe = [nomEquipe, tournoiChoisi];

    db.query(sqlEquipe, valuesEquipe, (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion de l\'équipe:', err);
        return res.status(500).send('Erreur lors de l\'insertion de l\'équipe');
      }

      const equipeId = result.insertId; // Récupère l'ID de l'équipe nouvellement insérée

      // Insertion du capitaine dans la table "Joueur"
      const sqlCapitaine = 'INSERT INTO Joueur (nom, prenom, pseudo, id_equipe) VALUES (?, ?, ?, ?)';
      const valuesCapitaine = [nomCapitaine, prenomCapitaine, `${nomCapitaine}${prenomCapitaine}`, equipeId];

      db.query(sqlCapitaine, valuesCapitaine, (err, resultCapitaine) => {
        if (err) {
          console.error('Erreur lors de l\'insertion du capitaine:', err);
          return res.status(500).send('Erreur lors de l\'insertion du capitaine');
        }

        const capitaineId = resultCapitaine.insertId; // Récupère l'ID du capitaine
        const sqlCapitaineTable = 'INSERT INTO Capitaine (id_capitaine, id_equipe) VALUES (?, ?)';

        db.query(sqlCapitaineTable, [capitaineId, equipeId], (err) => {
          if (err) {
            console.error('Erreur lors de l\'insertion dans Capitaine:', err);
            return res.status(500).send('Erreur lors de l\'insertion dans la table Capitaine');
          }
        });

        // Insertion des joueurs dans la table "Joueur"
        const joueurInserts = joueurs.map((joueur) => {
          return new Promise((resolve, reject) => {
            const sqlJoueur = 'INSERT INTO Joueur (nom, prenom, pseudo, id_equipe) VALUES (?, ?, ?, ?)';
            const valuesJoueur = [joueur.nom, joueur.prenom, joueur.pseudo, equipeId];

            db.query(sqlJoueur, valuesJoueur, (err, result) => {
              if (err) reject(err);
              resolve(result);
            });
          });
        });

        Promise.all(joueurInserts)
          .then(() => res.status(201).send('Équipe et joueurs ajoutés avec succès'))
          .catch((err) => {
            console.error('Erreur lors de l\'insertion des joueurs:', err);
            res.status(500).send('Erreur lors de l\'ajout des joueurs');
          });
      });
    });
  } catch (error) {
    console.error('Erreur dans la requête:', error);
    res.status(500).send('Erreur lors du traitement de la requête');
  }
});

// Démarrage du serveur sur le port 3000
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
