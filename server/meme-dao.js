'use strict';
/* Data Access Object (DAO) module for accessing courses and exams */

const db = require('./db');

// get all memes
exports.listMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((m) => ({ id: m.id, title: m.title, image: m.image, sentences: m.sentences, visibility: m.visibility, creator: m.creator, font: m.font, color: m.color }));
      resolve(memes);
    });
  });
};

// get all PUBLIC memes
exports.listPublicMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme WHERE "visibility" LIKE "public"';
    db.all(sql, [], (err, rows) => {
      if (err) {
        reject(err);
        return;
      }
      const memes = rows.map((m) => ({ id: m.id, title: m.title, image: m.image, sentences: m.sentences, visibility: m.visibility, creator: m.creator, font: m.font, color: m.color  }));
      resolve(memes);
    });
  });
};


// get the meme identified by {id}
exports.getMeme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Meme not found.' });
      } else {
        const meme = { title: row.title, image: row.image, sentences: row.sentences, visibility: row.visibility, creator: row.creator, font: row.font, color: row.color  };
        resolve(meme);
      }
    });
  });
};

// get the meme identified by {id} only if it is public
exports.getPublicMeme = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM meme WHERE id = ? AND "visibility" LIKE "public"';
    db.get(sql, [id], (err, row) => {
      if (err) {
        reject(err);
        return;
      }
      if (row == undefined) {
        resolve({ error: 'Meme not found.' });
      } else {
        const meme = { title: row.title, image: row.image, sentences: row.sentences, visibility: row.visibility, creator: row.creator, font: row.font, color: row.color  };
        resolve(meme);
      }
    });
  });
};

// add a new meme
exports.createMeme = (meme) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO meme(title, image, sentences, visibility, creator, font, color) VALUES(?, ?, ?, ?, ?, ?, ?)';
    db.run(sql, [meme.title, meme.image, meme.sentences, meme.visibility, meme.creator, meme.font, meme.color], function (err) {
      if (err) {
        reject(err);
        return;
      }
      resolve(this.lastID);
    });
  });
};

// delete an existing meme
exports.deleteMeme = (memeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM meme WHERE id = ?';
    db.run(sql, [memeId], (err) => {
      if (err) {
        reject(err);
        return;
      } else
        resolve(null);
    });
  });
}