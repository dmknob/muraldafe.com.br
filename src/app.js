// src/app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const db = require('../config/database');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o app
const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do EJS como engine de templates
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/default');

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para parsear dados de formulários
//app.use(express.urlencoded({ extended: true }));

// Middleware para parsear JSON
//app.use(express.json());

// Middleware para disponibilizar o caminho atual para as views
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// Configuração das rotas
app.use('/', publicRoutes);
app.use('/', adminRoutes);

// Rota de fallback para páginas não encontradas
app.use((req, res, next) => {
    res.status(404).render('pages/404', {
        title: 'Página não encontrada'
    });
});

// Middleware para tratar erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('pages/500', {
        title: 'Erro interno do servidor'
    });
});

// Iniciar o servidor
const server = app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    //console.log(`📦 Banco de dados conectado: ${db.database.filename}`);
});

// Exportar o servidor para testes ou outros módulos
module.exports = server;
