const publicCache = (req, res, next) => {
    // Only apply cache to GET requests (safety check)
    if (req.method === 'GET') {
        // Cache de 5 minutos (300s) no navegador/Nginx Edge
        res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=300');
    }
    next();
};

module.exports = {
    publicCache
};
