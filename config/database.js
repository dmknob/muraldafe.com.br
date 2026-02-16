// config/database.js
const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

// Nome do arquivo do banco de dados (vindo do .env)
const dbFileName = process.env.DB_FILE || 'muraldafe-DEV.db';

// Caminho completo para o arquivo do banco de dados
const dbPath = path.join(__dirname, '..', 'database', dbFileName);

// Configuração da conexão
const db = new Database(dbPath, {
    verbose: process.env.NODE_ENV !== 'production' ? console.log : null
});

console.log(`📦 Banco de dados conectado: ${dbPath}`);

// Exporta a instância do banco de dados
module.exports = db;