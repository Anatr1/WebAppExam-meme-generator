import Meme from './models/Meme'

const BASEURL = '/api';

async function getAllMemes() {
  // call GET /api/memes
  const response = await fetch(BASEURL + '/memes');
  const memesJSON = await response.json();
  if (response.ok) {
    return memesJSON.map((meme) => Meme.from(meme));
  } else {
    throw memesJSON;
  }
}

async function getMeme(memeID) {
  // call GET /api/memes/<id>
  const response = await fetch(BASEURL + '/memes/' + memeID);
  const memesJSON = await response.json();
  if (response.ok) {
    return Meme.from(memesJSON);
  } else {
    throw memesJSON;
  }
}

function addMeme(meme) {
  // call POST /api/memes
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/memes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: meme.id, title: meme.title, image: meme.image, sentences: meme.sentences, visibility: meme.visibility, creator: meme.creator, font: meme.font, color: meme.color }),
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

function deleteMeme(memeID) {
  // call DELETE /api/memes/<id>
  return new Promise((resolve, reject) => {
    fetch(BASEURL + '/memes/' + memeID, {
      method: 'DELETE',
    }).then((response) => {
      if (response.ok) {
        resolve(null);
      } else {
        // analyze the cause of error
        response.json()
          .then((message) => { reject(message); }) // error message in the response body
          .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
      }
    }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
  });
}

async function logIn(credentials) {
  let response = await fetch('/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user.name;
  }
  else {
    try {
      const errDetail = await response.json();
      throw errDetail.message;
    }
    catch (err) {
      throw err;
    }
  }
}

async function logOut() {
  await fetch('/api/sessions/current', { method: 'DELETE' });
}

async function getUserInfo() {
  const response = await fetch(BASEURL + '/sessions/current');
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

const API = { getAllMemes, getMeme, addMeme, deleteMeme, logIn, logOut, getUserInfo };
export default API;