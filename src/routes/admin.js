const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

// Rotas de Autenticação
router.get('/', (req, res) => res.redirect('/admin/dashboard'));
router.get('/login', adminController.getLogin);
router.post('/login', adminController.postLogin);
router.get('/logout', adminController.logout);

// Rotas Dashboard (Protegidas)
router.get('/dashboard', auth.isAuthenticated, adminController.getDashboard);

// Intercessores
router.get('/intercessores', auth.isAuthenticated, adminController.getIntercessores);
router.get('/intercessores/novo', auth.isAuthenticated, adminController.getNovoIntercessor);
router.post('/intercessores/novo', auth.isAuthenticated, adminController.postNovoIntercessor);
router.get('/intercessores/:id/editar', auth.isAuthenticated, adminController.getEditarIntercessor);
router.post('/intercessores/:id/editar', auth.isAuthenticated, adminController.postEditarIntercessor);
router.post('/intercessores/:id/deletar', auth.isAuthenticated, adminController.postDeletarIntercessor);

// Comunidades
router.get('/comunidades', auth.isAuthenticated, adminController.getComunidades);
router.get('/comunidades/nova', auth.isAuthenticated, adminController.getNovaComunidade);
router.post('/comunidades/nova', auth.isAuthenticated, adminController.postNovaComunidade);
router.get('/comunidades/:id/editar', auth.isAuthenticated, adminController.getEditarComunidade);
router.post('/comunidades/:id/editar', auth.isAuthenticated, adminController.postEditarComunidade);
router.post('/comunidades/:id/deletar', auth.isAuthenticated, adminController.postDeletarComunidade);

// Graças
router.get('/gracas', auth.isAuthenticated, adminController.getGracas);
router.get('/gracas/nova', auth.isAuthenticated, adminController.getNovaGraca);
router.post('/gracas/nova', auth.isAuthenticated, adminController.postNovaGraca);
router.get('/gracas/:id/editar', auth.isAuthenticated, adminController.getEditarGraca);
router.post('/gracas/:id/editar', auth.isAuthenticated, adminController.postEditarGraca);
router.post('/gracas/:id/deletar', auth.isAuthenticated, adminController.postDeletarGraca);

module.exports = router;
