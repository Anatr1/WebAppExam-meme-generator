import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import AppTitle from './AppTitle.js';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch, Link } from 'react-router-dom';
import API from './API';
import { LoginForm, LogoutButton } from './LoginComponents';
import { MemeList } from './MemeList'
import { MemePage, MemeCreation } from './MemeComponents'

function App() {
  const [memes, setMemes] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false); // at the beginning, no user is logged in
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState();
  const [message, setMessage] = useState('');
  const [updateList, setUpdateList] = useState(false)
  const emptyMeme = {
    title: "",
    image: "1",
    sentences: "",
    visibility: "protected",
    creator: "",
    font: "sans-serif",
    color: "black"
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await API.getUserInfo();
        setLoggedIn(true);
        setMessage("");
      } catch (err) {
        setMessage(err.error)
        console.error(err);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const getMemes = async () => {
      const memes = await API.getAllMemes();
      setMemes(memes);
      setLoading(false);
    };
    getMemes().catch(err => {
      setMessage({ msg: "Impossible to load the memes! Please, try again later...", type: 'danger' });
      console.error(err);
    });
  }, [loggedIn, updateList]);

  const doLogIn = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setCreator(user);
      setMessage({ msg: `Welcome, ${user}!`, type: 'success' });
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  }

  const doLogOut = async () => {
    await API.logOut();
    if (creator !== undefined)
      setMessage({ msg: `See you next time, ${creator}`, type: 'success' })
    else
      setMessage('');
    setLoggedIn(false);
  }

  const saveMeme = (meme) => {
    API.addMeme(meme)
      .then(() =>
        setUpdateList(!updateList)
      ).catch(err => {
        console.log(err);
        setMessage({ msg: `Unable to save your meme, maybe you used an already used title`, type: 'danger' });
      })
    setUpdateList(!updateList);
  }

  const deleteMeme = (memeId) => {
    const getMeme = async () => {
      const meme = await API.getMeme(memeId);
      return meme;
    }

    getMeme(memeId).then(m => {
      if (m.creator !== creator) {
        // User is trying to delete a meme that they don't own
        setMessage({ msg: `You can't delete this meme`, type: 'danger' });
      } else {
        API.deleteMeme(memeId);
        setUpdateList(!updateList);
      }
    }
    ).catch(err => {
      setMessage({ msg: `You can't delete this meme`, type: 'danger' });
      console.log(err);
    })
  }


  return (<Router>
    <Container className="App">
      <br />
      <Row>
        <AppTitle />
        <Col>
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} >{message.msg}</Alert>
          </Row>}
        </Col>
      </Row>
      <br />

      <Switch>
        <Route path="/login" render={() =>
          <>{loggedIn ? <Redirect to="/" /> : <LoginForm login={doLogIn} />}</>
        } />

        <Route path="/memes/:id" render={() =>
          <Col>
            <MemePage loggedIn={loggedIn} />
            <>{loggedIn ? <LogoutButton logout={doLogOut} /> : <Link to="/login"><Button variant='success'>Login</Button></Link>}</>
          </Col>
        } />

        <Route path="/create" render={() =>
          <Row>
            <>{loggedIn ? <MemeCreation creator={creator} startMeme={emptyMeme} saveNewMeme={saveMeme} /> : <Redirect to="/login" />}</>
          </Row>
        } />

        <Route path="/copy" render={() =>
          <Row>
            <>{loggedIn ? <MemeCreation creator={creator} startMeme={emptyMeme} saveNewMeme={saveMeme} /> : <Redirect to="/login" />}</>
          </Row>
        } />

        <Route path="/" render={() =>
          <Col>
            {loading ? <span>🕗 Please wait, loading the memes... 🕗</span> : <MemeList memes={memes} loggedIn={loggedIn} deleteMeme={deleteMeme} />}
            <>{loggedIn ? <LogoutButton logout={doLogOut} /> : <Link to="/login"><Button variant='success'>Login</Button></Link>}</>
          </Col>
        } />


      </Switch>

    </Container>
  </Router>

  );
}

export default App;
