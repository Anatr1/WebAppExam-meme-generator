import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useState } from 'react';


function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');
    const credentials = { username, password };

    let valid = true;
    if (username === '' || password === '' || password.length < 6)
      valid = false;

    if (valid) {
      props.login(credentials);
    }
    else {
      setErrorMessage('Error(s) in the form, please fix it.')
    }
  };

  return (
    <Form>
      {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
      <Form.Group controlId='username'>
        <Form.Label>Email</Form.Label>
        <Form.Control type='email' value={username} onChange={ev => setUsername(ev.target.value)} />
      </Form.Group>
      <Form.Group controlId='password'>
        <Form.Label>Password</Form.Label>
        <Form.Control type='password' value={password} onChange={ev => setPassword(ev.target.value)} />
      </Form.Group>
      <Button onClick={handleSubmit}>Login</Button>
    </Form>)
}

function LogoutButton(props) {
  return (
    <Container>
      <Button variant="outline-success" onClick={props.logout}>Logout</Button>
    </Container>
  )
}

export { LoginForm, LogoutButton };
