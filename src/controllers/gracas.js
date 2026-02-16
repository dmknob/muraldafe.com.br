// src/controllers/gracas.js
const db = require('../../config/database');

// Listar todas as graças
exports.list = (req, res) => {
    const stmt = db.prepare("SELECT * FROM gracas WHERE status = 'publicado'");
    const graças = stmt.all();

    res.render('pages/gracas', {
        title: 'Graças',
        graças
    });
};

// Exibir uma graça específica por slug
exports.show = (req, res) => {
    const { slug } = req.params;

    const stmt = db.prepare("SELECT * FROM gracas WHERE slug = ? AND status = 'publicado'");
    const graça = stmt.get(slug);

    if (!graça) {
        return res.status(404).render('pages/404', {
            title: 'Página não encontrada'
        });
    }

    res.render('pages/graça', {
        title: graça.nome_exibicao,
        graça
    });
};