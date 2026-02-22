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

    const BASE_URL = process.env.BASE_URL || 'https://muraldafe.com.br';
    const pageUrl = `${BASE_URL}/intercessores/${slug}`;
    const ogImage = intercessor.imagem_url
        ? (intercessor.imagem_url.startsWith('http') ? intercessor.imagem_url : `${BASE_URL}${intercessor.imagem_url}`)
        : `${BASE_URL}/images/og-default.png`;
    const ogDesc = intercessor.historia_bio
        ? intercessor.historia_bio.replace(/<[^>]+>/g, '').substring(0, 155) + '...'
        : 'Mural da Fé — Registro de Memória Digital de graças alcançadas por intercessão dos santos.';

    const ogMeta = `
        <meta name="description" content="${ogDesc}">
        <meta property="og:site_name" content="Mural da Fé">
        <meta property="og:title" content="${intercessor.nome} | Mural da Fé">
        <meta property="og:description" content="${ogDesc}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="${pageUrl}">
        <meta property="og:image" content="${ogImage}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="pt_BR">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${intercessor.nome} | Mural da Fé">
        <meta name="twitter:description" content="${ogDesc}">
        <meta name="twitter:image" content="${ogImage}">`;

    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        "name": intercessor.nome,
        "description": ogDesc,
        "image": ogImage,
        "url": pageUrl
    });

    res.render('pages/intercessor', {
        title: intercessor.nome,
        intercessor,
        gracas,
        ogMeta,
        jsonLd
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

    const BASE_URL = process.env.BASE_URL || 'https://muraldafe.com.br';
    const pageUrl = `${BASE_URL}/intercessores/${slug}/${grace_slug}`;
    const rawImage = graca.foto_devoto || graca.imagem_santinho_frente;
    const ogImage = rawImage
        ? (rawImage.startsWith('http') ? rawImage : `${BASE_URL}${rawImage}`)
        : `${BASE_URL}/images/og-default.png`;
    const ogTitle = `Graça de ${graca.nome_exibicao} — ${intercessor.nome} | Mural da Fé`;
    const ogDesc = graca.resumo
        ? graca.resumo.substring(0, 155)
        : `Relato de graça alcançada pela intercessão de ${intercessor.nome}. Mural da Fé.`;

    const ogMeta = `
        <meta name="description" content="${ogDesc}">
        <meta property="og:site_name" content="Mural da Fé">
        <meta property="og:title" content="${ogTitle}">
        <meta property="og:description" content="${ogDesc}">
        <meta property="og:type" content="article">
        <meta property="og:url" content="${pageUrl}">
        <meta property="og:image" content="${ogImage}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="675">
        <meta property="og:locale" content="pt_BR">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="${ogTitle}">
        <meta name="twitter:description" content="${ogDesc}">
        <meta name="twitter:image" content="${ogImage}">`;

    const jsonLd = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": ogTitle,
        "image": ogImage,
        "author": {
            "@type": "Person",
            "name": graca.nome_exibicao || "Devoto Anônimo"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Mural da Fé",
            "url": BASE_URL
        },
        "datePublished": graca.criado_em,
        "description": ogDesc,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": pageUrl
        },
        "about": {
            "@type": "Person",
            "name": intercessor.nome
        }
    });

    res.render('pages/grace', {
        title: `Graça de ${graca.nome_exibicao} - ${intercessor.nome}`,
        intercessor,
        graca,
        ogMeta,
        jsonLd
    });
};