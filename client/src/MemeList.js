import { Col, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { iconDelete, iconEdit } from './icons';

function MemeList(props) {
  return <Col>
    <MemeTable memes={props.memes} deleteMeme={props.deleteMeme} loggedIn={props.loggedIn} />
    {props.loggedIn ? <Link to="/create"><Button variant='success'>Create new meme</Button></Link> : <h5>Sign in as a creator to create new memes and see protected ones!</h5>}
  </Col>
}

function MemeTable(props) {
  if (props.loggedIn) {
    return (<>
      <Table striped >
        <thead>
          <tr>
            <th>ID.</th>
            <th>Title</th>
            <th>Creator</th>
            <th>Delete</th>
            <th>Copy</th>
          </tr>
        </thead>
        <tbody>{
          props.memes.map((meme) => <MemeRow key={meme.id} meme={meme} deleteMeme={props.deleteMeme} loggedIn={props.loggedIn} />)
        }
        </tbody>
      </Table>
    </>
    );
  }else{
    return (<>
      <Table striped >
        <thead>
          <tr>
            <th>ID.</th>
            <th>Title</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>{
          props.memes.map((meme) => <MemeRow key={meme.id} meme={meme} deleteMeme={props.deleteMeme} loggedIn={props.loggedIn} />)
        }
        </tbody>
      </Table>
    </>
    );
  }
}

function MemeRow(props) {
  const path = "/memes/" + props.meme.id;
  const newTo = {
    pathname: "/copy",
    state: { meme: props.meme }
  }
  if (props.loggedIn) {
    return <tr>
      <td>{props.meme.id}</td>
      <td><Link to={path}>{props.meme.title}</Link></td>
      <td>{props.meme.creator}</td>
      <td><span onClick={() => { props.deleteMeme(props.meme.id) }}>{iconDelete}</span></td>
      <td><Link to={newTo} >{iconEdit}</Link> </td>
    </tr>
  } else {
    return <tr>
      <td>{props.meme.id}</td>
      <td><Link to={path}>{props.meme.title}</Link></td>
      <td>{props.meme.creator}</td>
    </tr>
  }
}

export { MemeList };