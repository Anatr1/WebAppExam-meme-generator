import { Col, Row, Form, Button, Alert, Container } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { mapping } from './models/Templates';
import { Redirect, Link, useLocation } from 'react-router-dom';
import API from './API';
import m1 from './templates/1.jpg'
import m2 from './templates/2.jpg'
import m3 from './templates/3.jpg'
import m4 from './templates/4.jpg'
import m5 from './templates/5.jpg'
import m6 from './templates/6.jpg'
import m7 from './templates/7.jpg'
import m8 from './templates/8.jpg'
import m9 from './templates/9.jpg'
import not_found from './templates/notfound.jpg'


function MemePage(props) {
    const [meme, setMeme] = useState([]);
    const id = window.location.pathname.split("/")[2];

    useEffect(() => {
        const getMeme = async () => {
            try {
                const m = await API.getMeme(id);
                setMeme(m);
            } catch (err) {
                console.error(err.error);
            }
        };
        getMeme();
    }, [id]);

    const positions = mapping[meme.image];
    const pic = getImageFromTemplates(meme.image);

    return <Col>
        <MemeView meme={meme} positions={positions} pic={pic} />
    </Col>
}

function getImageFromTemplates(imageId) {
    switch (imageId) {
        case '1': return m1;
        case '2': return m2;
        case '3': return m3;
        case '4': return m4;
        case '5': return m5;
        case '6': return m6;
        case '7': return m7;
        case '8': return m8;
        case '9': return m9;
        default: return not_found;
    }
}

function getSentences(sentences) {
    let result = "";
    if (sentences !== undefined) {
        result = sentences.split(";");
    }
    return result;
}

function createSentences(fields) {
    let result = "";
    for (let i = 1; i <= 3; i++) {
        if (i < 3)
            result += fields[i] + ";"
        else result += fields[i]
    }
    return result
}

function MemeView(props) { //console.log("INVOKED MEMEVIEW")
    let sentences = Array.from(getSentences(props.meme.sentences));
    let sentences_positions = [];
    const size = "16px";

    if (props.positions !== undefined) {
        sentences_positions = Array.from(props.positions).reduce(function (sentences_positions, field, index) {
            sentences_positions[sentences[index]] = field;
            return sentences_positions;
        }, {})
    }

    return <Col>
        <Row><h1>{props.meme.title}</h1></Row>
        <Row>
            <Col xs={2}>
                <Row><span key="creator" style={{ fontSize: size, fontWeight: "bold" }}>Creator:</span><span style={{ fontSize: size }}>{props.meme.creator}</span></Row>
                <Row><span key="visibility" style={{ fontSize: size, fontWeight: "bold" }}>Visibility:</span><span style={{ fontSize: size }}>{props.meme.visibility}</span></Row>
            </Col>
            <Col>
                <div className="imgwrap">
                    <img src={props.pic} alt="Memozzo" />
                    {Array.from(sentences).map((sp) => <span key={Math.random()} className="sentence" style={{ top: sentences_positions[sp][1], left: sentences_positions[sp][0], color: props.meme.color, fontFamily: props.meme.font }}>{sp}</span>)}
                </div>
            </Col>

        </Row>
        <Link to="/"><Button variant='secondary'>Back</Button></Link>

    </Col>
}

function cleanFromEmpy(mapping) {
    let result = [];
    for (let i = 0; i < 3; i++) {
        if (mapping[i][0] !== 0 && mapping[i][1] !== 0)
            result.push(mapping[i]);
    }
    return result;
}

function cleanFromEmpySentences(sentences) {
    let result = [];
    for (let i = 0; i < 3; i++) {
        if (sentences[i] !== "")
            result.push(sentences[i]);
    }
    return result;
}

function hasDuplicates(array) {
    return (new Set(array)).size !== array.length;
}

function MemeCreation(props) {
    let copy = false;

    let data = useLocation();
    let startMeme = props.startMeme;
    if (data.state !== undefined) {
        startMeme = data.state.meme;
        if (startMeme.title.indexOf("(") >= 0) {
            startMeme.title = startMeme.title.substring(0, startMeme.title.indexOf("("));
        }
        startMeme.title += " (copied from " + startMeme.creator + ")";
        copy = true;
    }

    const [submitted, setSubmitted] = useState(false);
    const [title, setTitle] = useState(startMeme.title);
    const [image, setImage] = useState(startMeme.image);
    const [tempFields, setTempFields] = useState({ 1: "", 2: "", 3: "" });
    const [errorMessage, setErrorMessage] = useState('');
    const [visibility, setVisibility] = useState(startMeme.visibility);
    const [font, setFont] = useState(startMeme.font);
    const [color, setColor] = useState(startMeme.color);
    const [temp, setTemp] = useState("")
    const creator = props.creator;
    const images = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const fonts = ['sans-serif', 'serif', 'cursive', 'fantasy'];
    const colors = ['black', 'white', 'red', 'blue'];

    useEffect(() => { setTempFields({ 1: "", 2: "", 3: "" }) }, [image]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const sentences = createSentences(tempFields);
        const meme = { title: title, image: image, sentences: sentences, visibility: visibility, creator: creator, font: font, color: color };

        //Validation
        let valid = true;
        if (title === '' || sentences.length <= 2 || sentences.length > 90 || creator === '') {
            console.log("Error 1");
            valid = false;
        }
        if (!["protected", "public"].includes(visibility)) {
            console.log("Error 2");
            valid = false;
        }
        if (hasDuplicates(cleanFromEmpySentences(getSentences(sentences)))) {
            console.log("Error 3");
            valid = false;
        }

        if (valid) {
            props.saveNewMeme(meme);
            setSubmitted(true);
        } else {
            setErrorMessage("One or more errors in the form, please check the data.");
        }

    }

    return (
        <>{submitted ? <Redirect to="/" /> :
            <Container>
                <Form>
                    <br />
                    <Form.Group as={Row}>
                        <Form.Label>Meme Title:</Form.Label>
                        <Form.Control type="text" value={title} placeholder="Insert meme title" onChange={ev => setTitle(ev.target.value)}>
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group as={Row}>
                        <Form.Label>Background image:</Form.Label>
                        <Form.Control as="select" value={image} onChange={ev => setImage(ev.target.value)} >
                            {copy ? <option key={0} value={image}>{image}</option> : images.map(i => <option key={i} value={i} >{i}</option>)}
                        </Form.Control>
                        <Row>
                            <img src={getImageFromTemplates(image)} alt="Memozzo"></img>
                        </Row>
                    </Form.Group>
                    <Form.Group as={Row}>
                        {cleanFromEmpy(mapping[image]).map((coord) => <Form.Control type="text" value={tempFields[mapping[image].indexOf(coord) + 1]} placeholder="Insert text here" id={mapping[image].indexOf(coord) + 1} onChange={ev => {
                            tempFields[mapping[image].indexOf(coord) + 1] = ev.target.value;
                            setTempFields(tempFields);
                            setTemp(ev.target.value);
                        }}>
                        </Form.Control>)}
                    </Form.Group>
                    <br />
                    <Form.Group as={Row}>
                        <Form.Label>Font:</Form.Label>
                        <Form.Control as="select" value={font} onChange={ev => setFont(ev.target.value)}>
                            {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                        </Form.Control>
                        <Form.Label>Color:</Form.Label>
                        <Form.Control as="select" value={color} onChange={ev => setColor(ev.target.value)}>
                            {colors.map(c => <option key={c} value={c}>{c}</option>)}
                        </Form.Control>
                    </Form.Group>
                    <br />
                    <Form.Group as={Row}>
                        <Form.Label>Visibility:</Form.Label>
                        <div key={`inline-radio`} className="radio">
                            <Form.Check inline label="Public" name="radiogroup" type="radio" disabled={copy && startMeme.visibility === 'protected' && startMeme.creator !== creator} id="public" onChange={ev => setVisibility(ev.target.id)} />
                            <Form.Check inline label="Protected" name="radiogroup" type="radio" disabled={copy && startMeme.visibility === 'protected' && startMeme.creator !== creator} id="protected" onChange={ev => setVisibility(ev.target.id)} />
                        </div>
                    </Form.Group>
                    <br />
                    {errorMessage ? <Alert variant='danger'>{errorMessage}</Alert> : ''}
                    <br />
                    <Button onClick={handleSubmit} variant='success'>Save</Button><Link to="/"><Button variant='secondary'>Back</Button></Link>
                </Form>
            </Container>
        }
        </>
    )
}


export { MemePage, MemeCreation };