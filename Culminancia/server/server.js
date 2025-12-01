const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const mongoose = require("mongoose")

const app = express()

app.use(express.json())
app.use(cors())

dotenv.config()

async function connectDB() {
    const connect = await mongoose.connect(process.env.MONGO_URI)

    if (!connect) {
        console.log("Erro ao conectar ao banco de dados")
        return;
    }

    console.log("Conectado Ao Banco de Dados")
}

connectDB()