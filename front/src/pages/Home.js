import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Container from 'react-bootstrap/Container'
import Logo from '../images/logo.png'
import Parallax from '../images/parallax.jpg'
import Row from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import '../css/style.css'
import { Col, Jumbotron, Spinner } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import { BACKEND } from '../constants'

function Home(){

  useEffect(() => {
    document.title = 'Rota Cervejeira'
    listaCervejarias()
  }, [])

  const [cervejarias, setCervejarias] = useState([])
  const [carregandoCervejarias, setCarregandoCervejarias] = useState(false)

  async function listaCervejarias(){
    setCarregandoCervejarias(true)
    let url = `${BACKEND}/cervejarias`
    await fetch(url)
    .then(response=>response.json())
    .then(data=>{
      setCervejarias(data)
      console.log(data)
    })
    setCarregandoCervejarias(false)
  }

  return(
    <>
      <Navbar bg="dark" variant="dark" fixed="top">
        <Container>
          <Navbar.Brand className="navbarBrand" href="#home">
            <img
              src={Logo}
              width="50"
              height="50"
              className="d-inline-block align-top"
              alt="logo"
            />
            <h1 className="logo">Rota Cervejeira</h1>
          </Navbar.Brand>
          <Nav>
            <Nav.Link>
                <Link className="navLink" to="/painel">Painel</Link>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Jumbotron>
        <div className="parallax" alt="cerveja parallax"/>
      </Jumbotron>
      <div className="center">
        <Container className="content">
          <Row xs={1} md={3} className="g-3">

            {carregandoCervejarias &&
              <div className="center mb-2">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            }

            {!carregandoCervejarias &&

                cervejarias.filter(item => item.status === true).map(item => (
                  <Col>
                    <Card>
                      <Card.Img variant="top" src={Parallax} />
                      <Card.Body>
                        <Card.Title>{item.nome}</Card.Title>
                        <Card.Text>
                          {item.descricao}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))

            }
          </Row>
        </Container>
      </div>
      <footer>
        <Container>
          <div className="center footer">
            <h2>Rota cervejeira</h2>
            <p>Desenvolvido por Pedro Mack Navarro e Nickolas da Silva Veiga</p>
            <p className="copyright">Todos os direitos reservados &copy;</p>
          </div>
        </Container>
      </footer>
    </>
  )
}

export default Home