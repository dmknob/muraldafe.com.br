// scripts/setup-database.js
const Database = require('better-sqlite3');
const { readFileSync } = require('fs');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis do .env

// Caminho para o arquivo schema.sql
const schemaPath = path.resolve(__dirname, '../database/schema.sql');

// Nome do arquivo do banco de dados (vindo do .env ou padrão)
const dbFileName = process.env.DB_FILE;
const dbPath = path.resolve(__dirname, `../database/${dbFileName}`);

try {
    // Conectar ao banco de dados (cria se não existir)
    const db = new Database(dbPath, { verbose: console.log });
    console.log(`Conexão com o banco de dados "${dbFileName}" estabelecida com sucesso!`);

    // Ler e executar o schema.sql
    const schema = readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    console.log('Tabelas criadas com sucesso!');

    // Fechar a conexão
    db.close();
    console.log('Conexão com o banco de dados fechada.');

} catch (err) {
    console.error('Erro ao configurar o banco de dados:', err);
    process.exit(1);
}