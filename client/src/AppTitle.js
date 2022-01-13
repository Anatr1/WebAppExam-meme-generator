import { Col } from 'react-bootstrap';

function AppTitle() {
  const font = "sans-serif";
  const color = "green";
  const size = "46px";
  return (
      <Col>
        <h1 style={{fontFamily: font, color: color, fontSize: size}}>Meme Generator</h1>
      </Col>
  );
}

export default AppTitle;