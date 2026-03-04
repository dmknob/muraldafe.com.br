const sizeOf = require('image-size');
const path = require('path');
const fs = require('fs');

/**
 * Retorna as dimensões (width, height) de uma imagem local através do seu path web.
 * @param {string} webPath Ex: /images/og-default.webp ou /uploads/intercessores/img.webp
 * @returns {{width: number, height: number} | null} Objeto real com largura e altura, ou null.
 */
function getImageDimensions(webPath) {
    if (!webPath || webPath.startsWith('http://') || webPath.startsWith('https://')) {
        // Imagens externas ou strings mal formatadas não serão processadas no FS local
        return null;
    }

    try {
        const baseUrl = process.env.BASE_URL || 'https://muraldafe.com.br';
        let localPath = webPath;
        // Se a url completa foi passada e aponta para nós, vamos varrer e pegar só a rota local
        if (webPath.startsWith(baseUrl)) {
             localPath = webPath.replace(baseUrl, '');
        }
        
        // Remove a "/" extra se houver
        if (localPath.startsWith('/')) {
            localPath = localPath.substring(1);
        }

        const absolutePath = path.join(__dirname, '../../public', localPath);

        if (fs.existsSync(absolutePath)) {
            const dimensions = sizeOf(absolutePath);
            return dimensions;
        }
    } catch (e) {
        // Apenas silencia: se o utilitário não conseguir ler a imagem, 
        // o chamador deverá usar os tamanhos de fallback (1200x630).
        console.error('Erro ao ler dimensões da imagem [image-size]:', webPath, e.message);
    }
    return null;
}

module.exports = { getImageDimensions };
