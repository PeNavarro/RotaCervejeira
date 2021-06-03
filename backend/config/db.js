const mongoose = require('mongoose')

const conexaoMongo = process.env.MONGO_URL

const startMongoServer = async() =>{
    try{
        await mongoose.connect(conexaoMongo, {
            useNewUrlParser: true, useCreateIndex: true,
            useFindAndModify: false, useUnifiedTopology: true
        })
        console.log("Conectado ao MongoDB com sucesso!")
    }catch(e){
        console.error(e)
        throw(e)
    }
}

module.exports = startMongoServer