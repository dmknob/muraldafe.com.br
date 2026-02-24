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

    const BASE_URL = process.env.BASE_URL || 'https://muraldafe.com.br';
    const pageUrl = `${BASE_URL}/gracas/${slug}`;
    const rawImage = graça.foto_devoto || graça.imagem_santinho_frente;
    const ogImage = rawImage
        ? (rawImage.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`)
        : `${BASE_URL}/images/og-default.png`;

    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Mural da Fé", "item": BASE_URL },
                    { "@type": "ListItem", "position": 2, "name": "Graças", "item": `${BASE_URL}/gracas` },
                    { "@type": "ListItem", "position": 3, "name": graça.nome_exibicao, "item": pageUrl }
                ]
            }
        ]
    });

    res.render('pages/graça', {
        title: graça.nome_exibicao,
        graça,
        jsonLd
    });
};