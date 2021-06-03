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
import { Col, Jumbotron, Button, Table, Form, Modal, Spinner } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import {FaPencilAlt, FaTrashAlt, FaPlus, FaThList, FaRegSave} from "react-icons/fa";
import { BACKEND } from '../constants'

function Painel(){

  useEffect(() => {
    document.title = 'Painel Rota Cervejeira'
  }, [])

  const valorInicial = { nome: '', descricao: '', funcionamento: '', acessibilidade: 'false', status: 'true'}

  var statusValidado

  const [formInserir, setFormInserir] = useState(false)
  const [listaCervejaria, setListaCervejaria] = useState(false)
  const [modalExcluir, setModalExcluir] = useState(false)
  const [carregandoCervejarias, setCarregandoCervejarias] = useState(false)
  const [salvandoCervejarias, setSalvandoCervejarias] = useState(false)
  const [dadosCervejaria, setDadosCervejarias] = useState(valorInicial)
  const [cervejarias, setCervejarias] = useState([])
  const [aviso, setAviso] = useState('')
  const [erros, setErros] = useState({})
  const [confirmaExclusao, setConfirmaExclusao] = useState(false)

  const { nome, descricao, funcionamento, acessibilidade, status } = dadosCervejaria

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

  const alteraDadosCervejaria = e => {
      setDadosCervejarias({ ...dadosCervejaria, [e.target.name]: e.target.value})
      setErros({})
  }

  async function salvarCervejaria(e) {
    e.preventDefault()
    const novosErros = validaErrosCervejaria()
    if (Object.keys(novosErros).length > 0) {
        setErros(novosErros)
    } else {
        const metodo = dadosCervejaria.hasOwnProperty('_id') ? 'PUT' : 'POST'
        setSalvandoCervejarias(true)
        let url = `${BACKEND}/cervejarias`
        await fetch(url, {
            method: metodo,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dadosCervejaria)
        }).then(response => response.json())
            .then(data => {
                (data._id || data.message) ? setAviso('Registro salvo com sucesso') : setAviso('')
                setDadosCervejarias(valorInicial)
                listaCervejarias()
            }).catch(function (error) {
                console.error(`Erro ao salvar a cervejaria: ${error.message}`)
            })
        setSalvandoCervejarias(false)
        setFormInserir(false)
    }
  }

  async function excluirCervejaria() {
    let url = `${BACKEND}/cervejarias/${dadosCervejaria._id}`
    await fetch(url, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(response => response.json())
        .then(data => {
            data.message ? setAviso(data.message) : setAviso('')
            setDadosCervejarias(valorInicial)
            listaCervejarias()
        })
        .catch(function (error) {
            console.error(`Erro ao excluir a cervejaria: ${error.message}`)
        })
}

  const validaErrosCervejaria = () => {
    const novosErros = {}
    if (!nome || nome === '') novosErros.nome = 'O nome não pode ser vazio'
    else if (nome.length > 30) novosErros.nome = 'O nome informado é muito longo'
    else if (nome.length < 3) novosErros.nome = 'O nome informado é muito curto'

    if (!descricao || descricao === '') novosErros.descricao = 'A descrição não pode ser vazia'
    else if (descricao.length > 200) novosErros.descricao = 'A descrição informado é muito longa'
    else if (descricao.length < 3) novosErros.descricao = 'A descrição informado é muito curta'

    if (!funcionamento || funcionamento === '') novosErros.funcionamento = 'O funcionamento não pode ser vazio'
    else if (funcionamento.length > 100) novosErros.funcionamento = 'O funcionamento informado é muito longo'
    else if (funcionamento.length < 3) novosErros.funcionamento = 'O funcionamento informado é muito curto'
    return novosErros
  }

  function verificaStatus(status){
      if(status){
        statusValidado = 'Ativo'
      }else{
        statusValidado = 'Inativo'
      }
    return statusValidado
  }

  return(
    <>
      <Navbar bg="dark" variant="dark">
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
                <Link className="navLink" to="/">Home</Link>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
      <Container>
        <Row className="center painel">
          <Button variant="primary" onClick={()=>{setFormInserir(true);setListaCervejaria(false);setModalExcluir(false)}}><FaPlus/> Cadastrar</Button>
          <Button variant="secondary" onClick={()=>{setListaCervejaria(true);setFormInserir(false);setModalExcluir(false);listaCervejarias()}}><FaThList/> Listar Cervejarias</Button>
        </Row>
      </Container>
      
      {salvandoCervejarias &&
        <div className="center mt-3 mb-2">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      }

      {!salvandoCervejarias &&
        <>
          {formInserir &&
            <Container>
              <Row>
                <Form className="form">
                  <Form.Group className="mb-3">
                    <Form.Label>Nome</Form.Label>
                    <Form.Control type="text" 
                    placeholder="Nome" 
                    name="nome"
                    onChange={alteraDadosCervejaria}
                    value={nome} 
                    isInvalid={!!erros.nome}
                    required/>
                    <Form.Control.Feedback type='invalid'>
                        {erros.nome}
                    </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Descrição</Form.Label>
                    <Form.Control as="textarea" style={{height: '100px'}} 
                    onChange={alteraDadosCervejaria} 
                    name="descricao"
                    value={descricao} 
                    isInvalid={!!erros.descricao}
                    required/>
                    <Form.Control.Feedback type='invalid'>
                        {erros.descricao}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Funcionamento</Form.Label>
                    <Form.Control type="text" 
                    placeholder="Funcionamento"
                    name="funcionamento"
                    value={funcionamento}
                    isInvalid={!!erros.funcionamento}
                    onChange={alteraDadosCervejaria} 
                    required/>
                    <Form.Control.Feedback type='invalid'>
                        {erros.funcionamento}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Acessibilidade</Form.Label>
                    <Form.Check type="checkbox" label="Sim" name="acessibilidade" onChange={(e) => setDadosCervejarias({ ...dadosCervejaria, [e.target.name]: e.target.checked })} checked={acessibilidade} />
                  </Form.Group>

                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Foto da cervejaria</Form.Label> <br/>
                    <Form.Control type="file" name="foto" onChange={alteraDadosCervejaria}/>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Check type="checkbox" label="Ativo" name="status" onChange={(e) => setDadosCervejarias({ ...dadosCervejaria, [e.target.name]: e.target.checked })} checked={status} />
                  </Form.Group>

                  <Button className="formBtn" variant="primary" type="submit" onClick={(e) => salvarCervejaria(e)}>
                    <FaRegSave/> Salvar
                  </Button>
                </Form>
              </Row>
            </Container>
          }
        </>
      }  

      {modalExcluir &&
        <Modal.Dialog show={confirmaExclusao} onHide={() => setConfirmaExclusao(false)}>
          <Modal.Header>
            <Modal.Title>Excluir</Modal.Title>
            <button type="button" class="btn-close" aria-label="Close" onClick={()=>setModalExcluir(false)}></button>
          </Modal.Header>

          <Modal.Body>
            <p>Tem certeza que deseja excluir a cervejaria?</p>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="primary" onClick={()=>{setModalExcluir(false);setConfirmaExclusao(!confirmaExclusao)}}>Não</Button>
            <Button variant="secondary" onClick={()=>{setModalExcluir(false);setConfirmaExclusao(!confirmaExclusao);excluirCervejaria()}}>Sim</Button>
          </Modal.Footer>
        </Modal.Dialog>
      }

      {carregandoCervejarias &&
        <div className="center mt-3 mb-2">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      }

      {!carregandoCervejarias &&
        <>
          {listaCervejaria &&
            <Container>
              <Row>
                <Table className="mt-5" striped bordered hover>
                  <thead>
                    <tr>
                      <th>Nome:</th>
                      <th>Status:</th>
                      <th>Alterada em:</th>
                      <th>Opções:</th>
                    </tr>
                  </thead>
                  <tbody>

                  {cervejarias.map(item => (
                      <tr key={item._id}>
                          <td>{item.nome}</td>
                          <td>{verificaStatus(item.status)}</td>
                          <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                          <td>
                          <div className="listButtons">
                            <button onClick={()=>{setFormInserir(true);setModalExcluir(false);setDadosCervejarias(item)}}><FaPencilAlt/></button>
                            <button onClick={()=>{setModalExcluir(true);setFormInserir(false);setDadosCervejarias(item)}}><FaTrashAlt/></button>
                          </div>
                          </td>
                      </tr>
                  ))}
                  </tbody>
                </Table>
              </Row>
            </Container>
          }
        </>
      }
    </>
  )
}

export default Painel