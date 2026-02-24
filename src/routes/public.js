// src/routes/index.js
const express = require('express');
const router = express.Router();
const intercessoresController = require('../controllers/intercessores');
const comunidadesController = require('../controllers/comunidades');
const gracasController = require('../controllers/gracas');
const sitemapController = require('../controllers/sitemap');
const { publicCache } = require('../middleware/cache');

// Rota para sitemap.xml
router.get('/sitemap.xml', publicCache, sitemapController.generate);

// Rotas para intercessores
router.get('/intercessores', publicCache, intercessoresController.list);
router.get('/intercessores/:slug', publicCache, intercessoresController.show);
router.get('/intercessores/:slug/:grace_slug', publicCache, intercessoresController.showGrace);

// Rotas para comunidades
router.get('/comunidades', publicCache, comunidadesController.list);
router.get('/comunidades/:slug', publicCache, comunidadesController.show);

// Rotas para graças
router.get('/gracas', publicCache, gracasController.list);
router.get('/gracas/:slug', publicCache, gracasController.show);

// Rota para a página inicial
router.get('/', publicCache, (req, res) => {
    res.render('pages/home', {
        title: 'Mural da Fé'
    });
});

module.exports = router;