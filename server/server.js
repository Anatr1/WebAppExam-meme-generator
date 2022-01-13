'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const memeDao = require('./meme-dao'); // module for accessing the memes in the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
  function (email, password, done) {
    userDao.getUser(email, password).then((user) => {
      if (!user)
        return done(null, false, { message: 'Incorrect username and/or password.' });

      return done(null, user);
    })
  }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
  userDao.getUserById(id)
    .then(user => {
      done(null, user); // this will be available in req.user
    }).catch(err => {
      done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();

  return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
  // by default, Passport uses a MemoryStore to keep track of the sessions
  secret: 'Somebody once told me the world is gonna roll me',
  resave: false,
  saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/*** Users APIs ***/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // display wrong login messages
      return res.status(401).json(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user);
    });
  })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
  req.logout();
  res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Unauthenticated user!' });;
});

/*** Memes APIs ***/

// GET /api/memes
app.get('/api/memes', async (req, res) => {
  if (req.isAuthenticated() && isLoggedIn) {
    try {
      const memes = await memeDao.listMemes();
      res.json(memes);
    } catch (err) {
      res.status(500).end();
    }
  } else {
    try {
      const memes = await memeDao.listPublicMemes();
      res.json(memes);
    } catch (err) {
      res.status(500).end();
    }
  }
});

// GET /api/memes/<id>
app.get('/api/memes/:id', async (req, res) => {
  if (req.isAuthenticated()) {
    try {
      const result = await memeDao.getMeme(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  } else {
    try {
      const result = await memeDao.getPublicMeme(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
});

// POST /api/memes
app.post('/api/memes', isLoggedIn, async (req, res) => {
  const meme = {
    id: req.body.id,
    title: req.body.title,
    image: req.body.image,
    sentences: req.body.sentences,
    visibility: req.body.visibility,
    creator: req.body.creator,
    font: req.body.font,
    color: req.body.color
  };

  try {
    await memeDao.createMeme(meme);
    res.status(201).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the creation of meme.` });
  }
});

// DELETE /api/memes/<id>
app.delete('/api/memes/:id', isLoggedIn, async (req, res) => {
  try {
    await memeDao.deleteMeme(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(503).json({ error: `Database error during the deletion of meme ${req.params.id}.` });
  }
});

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});