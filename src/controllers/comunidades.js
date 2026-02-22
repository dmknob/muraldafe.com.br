// src/controllers/comunidades.js
const db = require('../../config/database');

// Listar todas as comunidades
exports.list = (req, res) => {
    const stmt = db.prepare("SELECT * FROM comunidades WHERE status = 'publicado'");
    const comunidades = stmt.all();

    res.render('pages/comunidades', {
        title: 'Comunidades',
        comunidades
    });
};

// Exibir uma comunidade específica por slug
exports.show = (req, res) => {
    const { slug } = req.params;

    const stmt = db.prepare(`
        SELECT c.*, i.slug as padroeiro_slug 
        FROM comunidades c
        LEFT JOIN intercessores i ON c.padroeiro_id = i.id
        WHERE c.slug = ? AND c.status = 'publicado'
    `);
    const comunidade = stmt.get(slug);

    if (!comunidade) {
        return res.status(404).render('pages/404', {
            title: 'Página não encontrada'
        });
    }

    // Buscar graças vinculadas ao padroeiro da comunidade
    const stmtGracas = db.prepare(`
        SELECT g.*, i.nome as intercessor_nome 
        FROM gracas g
        JOIN intercessores i ON g.intercessor_id = i.id
        WHERE g.intercessor_id = ? AND g.status = 'publicado'
        ORDER BY g.criado_em DESC
        LIMIT 6
    `);
    const gracas = stmtGracas.all(comunidade.padroeiro_id);

    const BASE_URL = process.env.BASE_URL || 'https://muraldafe.com.br';
    const pageUrl = `${BASE_URL}/comunidades/${slug}`;
    const ogImage = `${BASE_URL}/images/og-default.png`; // Fallback image for community (could be dynamic in future)

    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "PlaceOfWorship",
        "name": comunidade.nome,
        "description": comunidade.historia_local ? comunidade.historia_local.replace(/<[^>]+>/g, '').substring(0, 155) : `Comunidade ${comunidade.nome} no Mural da Fé`,
        "url": pageUrl,
        "image": ogImage
    });

    res.render('pages/comunidade', {
        title: comunidade.nome,
        comunidade,
        gracas,
        jsonLd
    });
};