-- ========================================
-- Script de Importação de Dados de Teste
-- ========================================
-- Este script contém os dados de teste para popular o banco de produção
-- Gerado em: 2026-02-16
-- Fonte: database/muraldafe-DEV.db

-- 1. INTERCESSOR: Padre Reus
INSERT INTO intercessores (nome, slug, historia_bio, oracao, imagem_url, status) VALUES (
    'Padre Reus',
    'padre-reus',
    'Johann Baptist Reus (1868–1947), nascido na Baviera, Alemanha, foi o oitavo de onze irmãos. Serviu no exército bávaro antes de ingressar na Companhia de Jesus. Em 1900, chegou ao Brasil após sobreviver a um surto de peste bubônica no navio. Atuou por 11 anos em Rio Grande, onde fundou a Liga Operária para apoiar estivadores. Ficou mundialmente conhecido por suas experiências místicas durante a Santa Missa, descrevendo visões de anjos e almas do Purgatório, registradas em mais de 1.100 esboços. Viveu seus últimos anos em São Leopoldo, onde seu túmulo no Santuário do Sagrado Coração de Jesus é destino de grandes romarias, especialmente na Sexta-Feira Santa. É considerado um ''Taumaturgo'' pela quantidade de graças atribuídas à sua intercessão.',
    'Senhor, que acendeste no coração do teu servo João Batista Reus um fogo de amor tão intenso que rompeu o véu entre o céu e a terra, concedei-me a graça de enxergar o sagrado onde o mundo vê apenas o vazio. Assim como ele transformou a disciplina militar em obediência ao Teu amor, ensina-me a ordenar meus dias com propósito. Pela intercessão deste Gigante da Liturgia, que viu Teus anjos protegerem o altar e Teu sangue aliviar as almas, peço hoje a graça que parece humanamente impossível [Fazer o Pedido]. Que o meu coração, a exemplo do dele, suporte o fogo das provações sem se consumir, tornando-se um altar silencioso onde a Vossa vontade sempre prevalece. Assim seja.',
    'https://brindaria.com.br/uploads/figuras/padre-reus-brindaria.webp',
    'publicado'
);

-- 2. COMUNIDADE: Santuário do Sagrado Coração de Jesus
INSERT INTO comunidades (nome, slug, historia, padroeiro_id, padroeiro_nome, fotos_galeria_json, status, site_url) VALUES (
    'Santuário do Sagrado Coração de Jesus',
    'santuario-sagrado_coracao_de_jesus_sao_leopoldo',
    'O Santuário do Sagrado Coração de Jesus, localizado em São Leopoldo (RS), é um dos principais centros de peregrinação do sul do Brasil, intimamente ligado à figura do Padre Reus (Johann Baptist Reus). Inaugurado oficialmente em 1968, o complexo foi construído para acolher o crescente número de fiéis que visitavam o túmulo do jesuíta, falecido em 1947. A arquitetura do Santuário é marcada por traços modernistas, destacando-se uma torre de 40 metros de altura e 14 grandes painéis de mosaico que retratam passagens da vida de Jesus e a história da salvação. Além do templo principal, o local abriga o Memorial Padre Reus e jardins que proporcionam um ambiente de silêncio e oração. O ponto alto das visitações ocorre na Sexta-feira Santa, quando milhares de devotos realizam romarias para agradecer graças alcançadas e pedir intercessão.',
    1,
    'Padre Reus',
    '["https://padrereus.org.br/wp-content/uploads/2023/08/Marcos-Ensaio-formatura-45-min-1024x684.jpg", "https://padrereus.org.br/wp-content/uploads/2019/09/santuÃ¡rio-padre-reus-1.jpg", "https://padrereus.org.br/wp-content/uploads/2019/09/santuÃ¡rio-padre-reus-4.jpg", "https://padrereus.org.br/wp-content/uploads/2019/09/santuÃ¡rio-padre-reus-12.jpg", "https://padrereus.org.br/wp-content/uploads/2019/09/santuÃ¡rio-padre-reus-21.jpg", "https://padrereus.org.br/wp-content/uploads/2019/09/santuÃ¡rio-padre-reus-26.jpg"]',
    'publicado',
    'https://padrereus.org.br/'
);

-- 3. GRAÇAS ALCANÇADAS

-- Graça 1: J.S.K.
INSERT INTO gracas (intercessor_id, comunidades_id, slug, nome_privado, nome_exibicao, localidade, resumo, relato, imagem_santinho_url, status, criado_em) VALUES (
    1,
    1,
    'jsk',
    'Jerônimo Samuel Knob',
    'J.S.K.',
    'Campo Bom/RS',
    'Câncer Colorretal',
    'Sou o J.S.K.. Aos 32 anos, recebi um diagnóstico de câncer colorretal com 50% de probabilidade de morte. O chão se abriu sob mim. Passei o meu aniversário de 33 anos dentro de uma U.T.I., no limiar entre a vida e a morte. Quando a medicina já não via mais saída, segurei na mão do Pe. Reus, visitando o Santuário e rezando com fé profunda. Agradeço a Deus, o autor de toda cura, e ao Padre Reus por ter sido o amigo e intercessor fiel que levou o meu clamor ao Coração do Pai.',
    '',
    'publicado',
    '2026-02-09 09:00:00'
);

-- Graça 2: L.I.
INSERT INTO gracas (intercessor_id, comunidades_id, slug, nome_privado, nome_exibicao, localidade, resumo, relato, imagem_santinho_url, status) VALUES (
    1,
    1,
    'lorem',
    'Lorem Ipsum',
    'L.I.',
    'Roma',
    'Alea Jacta Est',
    'Alea jacta est ou alea iacta est significa, em português, "o dado foi lançado", mas traduzido comumente como "a sorte foi lançada"',
    '',
    'publicado'
);

-- ========================================
-- INTERCESSOR 2: Nossa Senhora da Santa Cruz
-- ========================================

INSERT INTO intercessores (nome, slug, historia_bio, oracao, imagem_url, status) VALUES (
    'Nossa Senhora da Santa Cruz',
    'nossa-senhora-da-santa-cruz-erechim',
    'Nossa Senhora da Santa Cruz apareceu em 1944 em Lajeado Paca, Erechim (RS), para a agricultora Dorotéia Menegon Farina. O fenômeno começou após Dorotéia ser curada milagrosamente de uma enfermidade terminal (câncer) pela qual já havia sido declarada morta (o ''Fenômeno Lázaro''). As aparições seguiam um rigoroso calendário litúrgico e deixaram sinais físicos permanentes, como a ''Fitofania Negativa'' — uma cruz latina de 2,60m gravada no solo onde a vegetação se recusa a crescer há mais de 80 anos, mesmo após trocas de terra. A vidente também manifestava chagas (estigmas) e dermografia sacra (cruzes em relevo na pele). A mensagem centra-se no alerta contra práticas morais modernas e na proteção contra catástrofes, sendo o local hoje um Santuário Diocesano cujo reconhecimento oficial em 2024 cumpriu uma profecia matemática de 36 anos deixada pela vidente.',
    'Deus Todo-Poderoso, que sofrestes a morte sobre a madeira sagrada, que toda a Santa Cruz de Jesus Cristo seja a minha guarda; Santa Cruz de Jesus Cristo, compadecei-vos de mim; Santa Cruz de Jesus Cristo, sede a minha esperança; Santa Cruz de Jesus Cristo, afastai de mim toda arma cortante; Santa Cruz de Jesus Cristo, derramai sobre mim todo o bem; Santa Cruz de Jesus Cristo, desviai de mim todo o mal; Santa Cruz de Jesus Cristo, fazei que eu siga o caminho da salvação; Santa Cruz de Jesus Cristo, livrai-me dos acidentes corporais e temporais. Que eu possa adorar a Santa Cruz de Jesus Cristo para sempre. Jesus de Nazaré Crucificado, tende piedade de mim. Fazei que o espírito maligno fuja de mim, por todos os séculos dos séculos. Amém.',
    'https://brindaria.com.br/uploads/figuras/nossa-senhora-da-santa-cruz-erechim-brindaria.webp',
    'publicado'
);

-- Graças vinculadas a Nossa Senhora da Santa Cruz

-- Graça 3: L.I. (loren)
INSERT INTO gracas (intercessor_id, comunidades_id, slug, nome_privado, nome_exibicao, localidade, resumo, relato, imagem_santinho_url, status) VALUES (
    2,
    NULL,
    'loremipsum',
    'Lorem Ipsum',
    'L.I.',
    'Erechim',
    'Alea Jacta Est',
    'Alea jacta est ou alea iacta est significa, em português, "o dado foi lançado", mas traduzido comumente como "a sorte foi lançada"',
    '',
    'publicado'
);

-- Graça 4: L.I. (lorem)
INSERT INTO gracas (intercessor_id, comunidades_id, slug, nome_privado, nome_exibicao, localidade, resumo, relato, imagem_santinho_url, status) VALUES (
    2,
    NULL,
    'lorem',
    'Lorem Ipsum',
    'L.I.',
    'Erechim',
    'Alea Jacta Est',
    'Alea jacta est ou alea iacta est significa, em português, "o dado foi lançado", mas traduzido comumente como "a sorte foi lançada"',
    '',
    'publicado'
);

-- ========================================
-- FIM DO SCRIPT
-- ========================================
-- Total: 2 Intercessores, 1 Comunidade, 4 Graças
