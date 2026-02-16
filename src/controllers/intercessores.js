// src/controllers/intercessores.js
const db = require('../../config/database');

// Listar todos os intercessores
exports.list = (req, res) => {
    const stmt = db.prepare("SELECT * FROM intercessores WHERE status = 'publicado'");
    const intercessores = stmt.all();

    res.render('pages/intercessores', {
        title: 'Intercessores',
        intercessores
    });
};

// Exibir um intercessor específico por slug
exports.show = (req, res) => {
    const { slug } = req.params;

    const stmt = db.prepare("SELECT * FROM intercessores WHERE slug = ? AND status = 'publicado'");
    const intercessor = stmt.get(slug);

    if (!intercessor) {
        return res.status(404).render('pages/404', {
            title: 'Página não encontrada'
        });
    }

    // Buscar graças relacionadas ao intercessor
    const gracesStmt = db.prepare("SELECT * FROM gracas WHERE intercessor_id = ? AND status = 'publicado' ORDER BY criado_em DESC");
    const gracas = gracesStmt.all(intercessor.id);

    res.render('pages/intercessor', {
        title: intercessor.nome,
        intercessor,
        gracas
    });
};

// Exibir uma graça específica (Standalone)
exports.showGrace = (req, res) => {
    const { slug, grace_slug } = req.params;

    // Buscar Intercessor
    const stmtIntercessor = db.prepare("SELECT * FROM intercessores WHERE slug = ? AND status = 'publicado'");
    const intercessor = stmtIntercessor.get(slug);

    if (!intercessor) {
        return res.status(404).render('pages/404', {
            title: 'Intercessor não encontrado'
        });
    }

    // Buscar Graça
    const stmtGrace = db.prepare("SELECT * FROM gracas WHERE slug = ? AND intercessor_id = ? AND status = 'publicado'");
    const graca = stmtGrace.get(grace_slug, intercessor.id);

    if (!graca) {
        return res.status(404).render('pages/404', {
            title: 'Graça não encontrada'
        });
    }

    res.render('pages/grace', {
        title: `Graça de ${graca.nome_exibicao} - ${intercessor.nome}`,
        intercessor,
        graca
    });
};