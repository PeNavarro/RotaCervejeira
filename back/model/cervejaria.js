const mongoose = require('mongoose')

const cervejariaSchema = mongoose.Schema({
    nome: {type: String},
    descricao: {type: String},
    funcionamento: {type: String},
    acessibilidade: {type: Boolean},
    localizacao: {type: String},
    status: {type: Boolean, default: true}
}, {timestamps:true})

module.exports = mongoose.model('cervejaria', cervejariaSchema)