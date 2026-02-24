// src/app.js
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const expressLayouts = require('express-ejs-layouts');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');
const db = require('../config/database');

// Carregar variáveis de ambiente
dotenv.config();

const session = require('express-session');
const auth = require('./middleware/auth');

// Inicializar o app
const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy - CRÍTICO para produção com Nginx/reverse proxy
// Permite que o Express confie no proxy e leia corretamente o protocolo HTTPS
app.set('trust proxy', 1);

// Segurança com Helmet (Desativando CSP para manter compatibilidade com scripts inline)
app.use(helmet({
    contentSecurityPolicy: false
}));

// Setup de Cookies (necessário para o csurf de forma moderna)
app.use(cookieParser(process.env.SESSION_SECRET || 'segredo_padrao_mural_da_fe'));

// Configuração de Sessão
app.use(session({
    secret: process.env.SESSION_SECRET || 'segredo_padrao_mural_da_fe',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true se HTTPS
        httpOnly: true, // Previne acesso via JavaScript
        maxAge: 1000 * 60 * 60 * 24, // 1 dia
        sameSite: 'lax' // Proteção CSRF
    }
}));

// Configuração do EJS como engine de templates
app.use(expressLayouts);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', 'layouts/default');

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Middleware para parsear dados de formulários
app.use(express.urlencoded({ extended: true }));

// Middleware para parsear JSON
app.use(express.json());

// Injetar variável de usuário (admin) nas views
app.use(auth.injectUserVar);

// Middleware para disponibilizar o caminho atual e BASE_URL para as views
app.use((req, res, next) => {
    res.locals.path = req.path;
    res.locals.BASE_URL = process.env.BASE_URL || 'https://muraldafe.com.br';
    next();
});

// Configuração das rotas
app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

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
