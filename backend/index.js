const express = require('express')
require('dotenv').config()
const startMongoServer = require('./config/db')
startMongoServer()

const rotasCervejarias = require('./routes/cervejaria')
const rotasUpload = require('./routes/uploads')

const app = express()

app.disable('x-powered-by')

const PORT = process.env.PORT || 4000

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers','*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    next()
})

app.use(express.json())

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API da Rota Cervejeira',
        versao: '1.0.0'
    })
})

app.use('/cervejarias', rotasCervejarias)
app.use('/upload', rotasUpload)

app.use(function(req, res){
    res.status(404).json({
        mensagem: `A rota ${req.originalUrl} não existe!`
    })
})

app.listen(PORT, (req, res) => {
    console.log(`Servidor rodando na porta ${PORT}`)
})