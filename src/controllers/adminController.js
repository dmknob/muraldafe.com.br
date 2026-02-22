const db = require('../../config/database');
const auth = require('../middleware/auth');
const slugify = require('slugify');

module.exports = {
    // =========================================
    // AUTH
    // =========================================
    getLogin: (req, res) => {
        if (req.session && req.session.admin) {
            return res.redirect('/admin/dashboard');
        }
        res.render('admin/login', {
            title: 'Login',
            layout: 'layouts/layout-admin',
            hideNav: true,
            error: null
        });
    },

    postLogin: (req, res) => {
        const { password } = req.body;
        if (auth.checkPassword(password)) {
            req.session.admin = true;
            const redirect = req.session.returnTo || '/admin/dashboard';
            delete req.session.returnTo;
            req.session.save(() => {
                res.redirect(redirect);
            });
        } else {
            res.render('admin/login', {
                title: 'Login',
                layout: 'layouts/layout-admin',
                hideNav: true,
                error: 'Senha incorreta.'
            });
        }
    },

    logout: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    },

    // =========================================
    // INTERCESSORES
    // =========================================
    getIntercessores: (req, res) => {
        const intercessores = db.prepare('SELECT * FROM intercessores ORDER BY nome ASC').all();
        res.render('admin/lista-intercessores', {
            title: 'Gerenciar Intercessores',
            layout: 'layouts/layout-admin',
            intercessores,
            error: req.query.error,
            success: req.query.success
        });
    },

    getNovoIntercessor: (req, res) => {
        res.render('admin/form-intercessor', {
            title: 'Novo Intercessor',
            layout: 'layouts/layout-admin',
            intercessor: null,
            error: null
        });
    },

    postNovoIntercessor: (req, res) => {
        const { nome, historia_bio, oracao, imagem_url, status, slug } = req.body;

        try {
            const finalSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(nome, { lower: true, strict: true });

            const insert = db.prepare(`
                INSERT INTO intercessores (nome, slug, historia_bio, oracao, imagem_url, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            insert.run(nome, finalSlug, historia_bio, oracao, imagem_url, status || 'rascunho');

            res.redirect('/admin/intercessores?success=created');
        } catch (error) {
            console.error(error);
            // Se erro de duplicidade no slug
            if (error.code === 'SQLITE_CONSTRAINT') {
                return res.render('admin/form-intercessor', {
                    title: 'Novo Intercessor',
                    layout: 'layouts/layout-admin',
                    intercessor: req.body,
                    error: 'Este slug já existe. Escolha outro.'
                });
            }
            res.status(500).send('Erro ao criar intercessor');
        }
    },

    getEditarIntercessor: (req, res) => {
        const { id } = req.params;
        const intercessor = db.prepare('SELECT * FROM intercessores WHERE id = ?').get(id);

        if (!intercessor) return res.status(404).send('Intercessor não encontrado');

        res.render('admin/form-intercessor', {
            title: `Editar ${intercessor.nome}`,
            layout: 'layouts/layout-admin',
            intercessor,
            error: null
        });
    },

    postEditarIntercessor: (req, res) => {
        const { id } = req.params;
        const { nome, historia_bio, oracao, imagem_url, status, slug } = req.body;

        try {
            const finalSlug = slugify(slug, { lower: true, strict: true });

            const update = db.prepare(`
                UPDATE intercessores 
                SET nome = ?, slug = ?, historia_bio = ?, oracao = ?, imagem_url = ?, status = ?
                WHERE id = ?
            `);

            update.run(nome, finalSlug, historia_bio, oracao, imagem_url, status, id);

            res.redirect('/admin/intercessores?success=updated');
        } catch (error) {
            console.error(error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                return res.render('admin/form-intercessor', {
                    title: 'Editar Intercessor',
                    layout: 'layouts/layout-admin',
                    intercessor: { ...req.body, id },
                    error: 'Este slug já existe. Escolha outro.'
                });
            }
            res.status(500).send('Erro ao atualizar intercessor');
        }
    },

    postDeletarIntercessor: (req, res) => {
        const { id } = req.params;

        try {
            // Verificar dependências
            const comunidadesCount = db.prepare('SELECT COUNT(*) as count FROM comunidades WHERE padroeiro_id = ?').get(id).count;
            const gracasCount = db.prepare('SELECT COUNT(*) as count FROM gracas WHERE intercessor_id = ?').get(id).count;

            if (comunidadesCount > 0 || gracasCount > 0) {
                return res.redirect(`/admin/intercessores?error=dependency&details=${comunidadesCount} comunidades, ${gracasCount} gracas`);
            }

            db.prepare('DELETE FROM intercessores WHERE id = ?').run(id);
            res.redirect('/admin/intercessores?success=deleted');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao deletar intercessor');
        }
    },

    // =========================================
    // COMUNIDADES
    // =========================================
    getComunidades: (req, res) => {
        const comunidades = db.prepare(`
            SELECT c.*, i.nome as padroeiro_nome 
            FROM comunidades c
            LEFT JOIN intercessores i ON c.padroeiro_id = i.id
            ORDER BY c.nome ASC
        `).all();

        res.render('admin/lista-comunidades', {
            title: 'Gerenciar Comunidades',
            layout: 'layouts/layout-admin',
            comunidades,
            error: req.query.error,
            success: req.query.success
        });
    },

    getNovaComunidade: (req, res) => {
        const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();

        res.render('admin/form-comunidade', {
            title: 'Nova Comunidade',
            layout: 'layouts/layout-admin',
            comunidade: null,
            intercessores,
            error: null
        });
    },

    postNovaComunidade: (req, res) => {
        const { nome, historia, padroeiro_id, site_url, fotos_galeria_json, status, slug } = req.body;

        try {
            const finalSlug = slug ? slugify(slug, { lower: true, strict: true }) : slugify(nome, { lower: true, strict: true });

            // Buscar nome do padroeiro para redundância (schema legado pede padroeiro_nome)
            const padroeiro = db.prepare('SELECT nome FROM intercessores WHERE id = ?').get(padroeiro_id);
            const padroeiro_nome = padroeiro ? padroeiro.nome : 'Desconhecido';

            const insert = db.prepare(`
                INSERT INTO comunidades (nome, slug, historia, padroeiro_id, padroeiro_nome, site_url, fotos_galeria_json, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insert.run(nome, finalSlug, historia, padroeiro_id, padroeiro_nome, site_url, fotos_galeria_json || '[]', status || 'rascunho');

            res.redirect('/admin/comunidades?success=created');
        } catch (error) {
            console.error(error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();
                return res.render('admin/form-comunidade', {
                    title: 'Nova Comunidade',
                    layout: 'layouts/layout-admin',
                    comunidade: req.body,
                    intercessores,
                    error: 'Este slug já existe. Escolha outro.'
                });
            }
            res.status(500).send('Erro ao criar comunidade');
        }
    },

    getEditarComunidade: (req, res) => {
        const { id } = req.params;
        const comunidade = db.prepare('SELECT * FROM comunidades WHERE id = ?').get(id);
        const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();

        if (!comunidade) return res.status(404).send('Comunidade não encontrada');

        res.render('admin/form-comunidade', {
            title: `Editar ${comunidade.nome}`,
            layout: 'layouts/layout-admin',
            comunidade,
            intercessores,
            error: null
        });
    },

    postEditarComunidade: (req, res) => {
        const { id } = req.params;
        const { nome, historia, padroeiro_id, site_url, fotos_galeria_json, status, slug } = req.body;

        try {
            const finalSlug = slugify(slug, { lower: true, strict: true });

            const padroeiro = db.prepare('SELECT nome FROM intercessores WHERE id = ?').get(padroeiro_id);
            const padroeiro_nome = padroeiro ? padroeiro.nome : 'Desconhecido';

            const update = db.prepare(`
                UPDATE comunidades 
                SET nome = ?, slug = ?, historia = ?, padroeiro_id = ?, padroeiro_nome = ?, site_url = ?, fotos_galeria_json = ?, status = ?
                WHERE id = ?
            `);

            update.run(nome, finalSlug, historia, padroeiro_id, padroeiro_nome, site_url, fotos_galeria_json || '[]', status, id);

            res.redirect('/admin/comunidades?success=updated');
        } catch (error) {
            console.error(error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();
                return res.render('admin/form-comunidade', {
                    title: 'Editar Comunidade',
                    layout: 'layouts/layout-admin',
                    comunidade: { ...req.body, id },
                    intercessores,
                    error: 'Este slug já existe. Escolha outro.'
                });
            }
            res.status(500).send('Erro ao atualizar comunidade');
        }
    },

    postDeletarComunidade: (req, res) => {
        const { id } = req.params;

        try {
            // Verificar dependências
            const gracasCount = db.prepare('SELECT COUNT(*) as count FROM gracas WHERE comunidades_id = ?').get(id).count;

            if (gracasCount > 0) {
                return res.redirect(`/admin/comunidades?error=dependency&details=${gracasCount} gracas`);
            }

            db.prepare('DELETE FROM comunidades WHERE id = ?').run(id);
            res.redirect('/admin/comunidades?success=deleted');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao deletar comunidade');
        }
    },
    // =========================================
    // GRAÇAS
    // =========================================
    getGracas: (req, res) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        // Filtros ??

        const gracas = db.prepare(`
            SELECT g.*, i.nome as intercessor_nome, c.nome as comunidade_nome
            FROM gracas g
            JOIN intercessores i ON g.intercessor_id = i.id
            LEFT JOIN comunidades c ON g.comunidades_id = c.id
            ORDER BY g.criado_em DESC
            LIMIT ? OFFSET ?
        `).all(limit, offset);

        const total = db.prepare('SELECT COUNT(*) as count FROM gracas').get().count;
        const totalPages = Math.ceil(total / limit);

        res.render('admin/lista-gracas', {
            title: 'Gerenciar Graças',
            layout: 'layouts/layout-admin',
            gracas,
            currentPage: page,
            totalPages,
            error: req.query.error,
            success: req.query.success
        });
    },

    getNovaGraca: (req, res) => {
        const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();
        const comunidades = db.prepare('SELECT id, nome FROM comunidades ORDER BY nome ASC').all();

        res.render('admin/form-graca', {
            title: 'Nova Graça',
            layout: 'layouts/layout-admin',
            graca: null,
            intercessores,
            comunidades,
            error: null
        });
    },

    postNovaGraca: (req, res) => {
        const {
            intercessor_id, comunidades_id, slug,
            nome_privado, nome_exibicao, localidade,
            resumo, relato, imagem_santinho_frente, imagem_santinho_verso,
            foto_devoto, status
        } = req.body;

        try {
            // Slug generation logic (often simpler for graces: just random or initials)
            // But requirement says slugs personalized.
            // Unique constraint is (intercessor_id, slug)

            const insert = db.prepare(`
                INSERT INTO gracas (
                    intercessor_id, comunidades_id, slug,
                    nome_privado, nome_exibicao, localidade,
                    resumo, relato, imagem_santinho_frente, imagem_santinho_verso,
                    foto_devoto, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);

            insert.run(
                intercessor_id,
                comunidades_id || null,
                slug,
                nome_privado,
                nome_exibicao,
                localidade,
                resumo,
                relato,
                imagem_santinho_frente,
                imagem_santinho_verso,
                foto_devoto || null,
                status || 'rascunho'
            );

            res.redirect('/admin/gracas?success=created');
        } catch (error) {
            console.error(error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();
                const comunidades = db.prepare('SELECT id, nome FROM comunidades ORDER BY nome ASC').all();
                return res.render('admin/form-graca', {
                    title: 'Nova Graça',
                    layout: 'layouts/layout-admin',
                    graca: req.body,
                    intercessores,
                    comunidades,
                    error: 'Este slug já existe para este intercessor.'
                });
            }
            res.status(500).send('Erro ao criar graça');
        }
    },

    getEditarGraca: (req, res) => {
        const { id } = req.params;
        const graca = db.prepare('SELECT * FROM gracas WHERE id = ?').get(id);
        const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();
        const comunidades = db.prepare('SELECT id, nome FROM comunidades ORDER BY nome ASC').all();

        if (!graca) return res.status(404).send('Graça não encontrada');

        res.render('admin/form-graca', {
            title: `Editar Graça`,
            layout: 'layouts/layout-admin',
            graca,
            intercessores,
            comunidades,
            error: null
        });
    },

    postEditarGraca: (req, res) => {
        const { id } = req.params;
        const {
            intercessor_id, comunidades_id, slug,
            nome_privado, nome_exibicao, localidade,
            resumo, relato, imagem_santinho_frente, imagem_santinho_verso,
            foto_devoto, status
        } = req.body;

        try {
            const update = db.prepare(`
                UPDATE gracas 
                SET intercessor_id = ?, comunidades_id = ?, slug = ?,
                    nome_privado = ?, nome_exibicao = ?, localidade = ?,
                    resumo = ?, relato = ?, imagem_santinho_frente = ?, imagem_santinho_verso = ?,
                    foto_devoto = ?, status = ?
                WHERE id = ?
            `);

            update.run(
                intercessor_id,
                comunidades_id || null,
                slug,
                nome_privado,
                nome_exibicao,
                localidade,
                resumo,
                relato,
                imagem_santinho_frente,
                imagem_santinho_verso,
                foto_devoto || null,
                status,
                id
            );

            res.redirect('/admin/gracas?success=updated');
        } catch (error) {
            console.error(error);
            if (error.code === 'SQLITE_CONSTRAINT') {
                const intercessores = db.prepare('SELECT id, nome FROM intercessores ORDER BY nome ASC').all();
                const comunidades = db.prepare('SELECT id, nome FROM comunidades ORDER BY nome ASC').all();
                return res.render('admin/form-graca', {
                    title: 'Editar Graça',
                    layout: 'layouts/layout-admin',
                    graca: { ...req.body, id },
                    intercessores,
                    comunidades,
                    error: 'Este slug já existe para este intercessor.'
                });
            }
            res.status(500).send('Erro ao atualizar graça');
        }
    },

    postDeletarGraca: (req, res) => {
        const { id } = req.params;
        try {
            db.prepare('DELETE FROM gracas WHERE id = ?').run(id);
            res.redirect('/admin/gracas?success=deleted');
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao deletar graça');
        }
    },
    getDashboard: (req, res) => {
        try {
            const totalIntercessores = db.prepare('SELECT COUNT(*) as count FROM intercessores').get().count;
            const totalComunidades = db.prepare('SELECT COUNT(*) as count FROM comunidades').get().count;
            const totalGracas = db.prepare('SELECT COUNT(*) as count FROM gracas').get().count;

            const ultimasGracas = db.prepare(`
                SELECT g.*, i.nome as intercessor_nome, i.slug as intercessor_slug 
                FROM gracas g
                JOIN intercessores i ON g.intercessor_id = i.id
                ORDER BY g.criado_em DESC
                LIMIT 10
            `).all();

            res.render('admin/dashboard', {
                title: 'Dashboard',
                layout: 'layouts/layout-admin',
                totalIntercessores,
                totalComunidades,
                totalGracas,
                ultimasGracas
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Erro ao carregar dashboard');
        }
    }
};
