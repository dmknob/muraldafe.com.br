// src/controllers/sitemap.js
const db = require('../../config/database');

// Gerar sitemap.xml dinâmico
exports.generate = (req, res) => {
    try {
        // Obter todas as entidades publicadas
        const intercessores = db.prepare("SELECT slug, criado_em FROM intercessores WHERE status = 'publicado'").all();
        const comunidades = db.prepare("SELECT slug, criado_em FROM comunidades WHERE status = 'publicado'").all();
        const gracas = db.prepare(`
            SELECT g.slug, i.slug as intercessor_slug, g.criado_em 
            FROM gracas g
            JOIN intercessores i ON g.intercessor_id = i.id
            WHERE g.status = 'publicado'
        `).all();

        // Construir o XML
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

        // URL base do site
        const baseUrl = process.env.BASE_URL || 'https://muraldafe.com.br';

        // Adicionar páginas estáticas
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/</loc>\n`;
        xml += `    <priority>1.0</priority>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `  </url>\n`;

        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/intercessores</loc>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `  </url>\n`;

        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/comunidades</loc>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `  </url>\n`;

        // Adicionar intercessores
        intercessores.forEach(intercessor => {
            const lastmod = new Date(intercessor.criado_em).toISOString().split('T')[0];
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/intercessores/${intercessor.slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <priority>0.7</priority>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `  </url>\n`;
        });

        // Adicionar comunidades
        comunidades.forEach(comunidade => {
            const lastmod = new Date(comunidade.criado_em).toISOString().split('T')[0];
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/comunidades/${comunidade.slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <priority>0.6</priority>\n`;
            xml += `    <changefreq>monthly</changefreq>\n`;
            xml += `  </url>\n`;
        });

        // Adicionar graças
        gracas.forEach(graca => {
            const lastmod = new Date(graca.criado_em).toISOString().split('T')[0];
            xml += `  <url>\n`;
            xml += `    <loc>${baseUrl}/intercessores/${graca.intercessor_slug}/${graca.slug}</loc>\n`;
            xml += `    <lastmod>${lastmod}</lastmod>\n`;
            xml += `    <priority>0.5</priority>\n`;
            xml += `    <changefreq>yearly</changefreq>\n`;
            xml += `  </url>\n`;
        });

        xml += '</urlset>';

        // Enviar resposta com tipo correto
        res.header('Content-Type', 'application/xml');
        res.send(xml);
    } catch (error) {
        console.error('Erro ao gerar sitemap:', error);
        res.status(500).send('Erro ao gerar sitemap');
    }
};
