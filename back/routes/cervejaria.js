const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator')
const Cervejaria = require('../model/cervejaria')

const validarCervejaria = [
    check('nome', 'Nome da categoria é um campo obrigatório').not().isEmpty(),
    check('status', 'Informe um status válido para a categoria').isIn([true, false]),
    check('descricao', 'A descrição sobre a cervejaria é obrigatória').not().isEmpty(),
    check('acessibilidade', 'O campo de acessibilidade é obrigatório').not().isEmpty(),
    check('localizacao', 'O campo de localizacao é obrigatório').not().isEmpty()
]


router.get('/', async(req, res) => {
    try{
        const cervejarias = await Cervejaria.find()
        res.json(cervejarias)
    }catch(err){
        res.status(500).send({
            errors: [{message: 'Não foi possível listar as cervejarias'}]
        })
    }
})

router.get('/:id', async(req, res) => {
    try{
        const cervejaria = await Cervejaria.findById(req.params.id)
        res.json(cervejaria)
    }catch(err){
        res.status(500).send({
            errors: [{message: 'Não foi possível listar essa cervejaria'}]
        })
    }
})

router.post('/', validarCervejaria, async(req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try{
        let cervejaria = new Cervejaria(req.body)
        await cervejaria.save()
        res.send(cervejaria)
    }catch(err){
        return res.status(500).json({
            errors: [{message: `Erro ao salvar a cervejaria: ${err.message}`}]
        })
    }
})

router.delete('/:id', async(req, res) =>{
    await Cervejaria.findByIdAndRemove(req.params.id)
    .then(cervejaria => {res.send(
        {message: `Cervejaria ${cervejaria.nome} removida com sucesso`}
    )}).catch(err =>{
        return res.status(500).json({
            errors: [{message: `Erro ao excluir a cervejaria de Id: ${req.params.id}`}]
        })
    })
})

router.put('/', validarCervejaria, async(req, res) =>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    let dados = req.body
    await Cervejaria.findByIdAndUpdate(req.body._id,{
        $set: dados
    }, {new: true})
    .then(cervejaria => {
        res.send({message: `Cervejaria ${cervejaria.nome} alterada com sucesso!`})
    }).catch(err =>{
        errors: [{message: `Não foi possível editar a cervejaria com o Id ${req.body._id}`}]
    })
})

module.exports = router