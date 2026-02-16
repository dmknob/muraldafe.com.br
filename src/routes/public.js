// src/routes/index.js
const express = require('express');
const router = express.Router();
const intercessoresController = require('../controllers/intercessores');
const comunidadesController = require('../controllers/comunidades');
const gracasController = require('../controllers/gracas');
const sitemapController = require('../controllers/sitemap');

// Rota para sitemap.xml
router.get('/sitemap.xml', sitemapController.generate);

// Rotas para intercessores
router.get('/intercessores', intercessoresController.list);
router.get('/intercessores/:slug', intercessoresController.show);
router.get('/intercessores/:slug/:grace_slug', intercessoresController.showGrace);

// Rotas para comunidades
router.get('/comunidades', comunidadesController.list);
router.get('/comunidades/:slug', comunidadesController.show);

// Rotas para graças
router.get('/gracas', gracasController.list);
router.get('/gracas/:slug', gracasController.show);

// Rota para a página inicial
router.get('/', (req, res) => {
    res.render('pages/home', {
        title: 'Mural da Fé'
    });
});

module.exports = router;