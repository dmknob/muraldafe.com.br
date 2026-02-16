-- /database/schema.sql

-- Tabela para armazenar intercessores
CREATE TABLE IF NOT EXISTS intercessores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    historia_bio TEXT,
    oracao TEXT,
    imagem_url TEXT,
    status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Índice para pesquisa rápida por slug em intercessores
CREATE INDEX IF NOT EXISTS idx_intercessores_slug ON intercessores (slug);

-- Tabela para armazenar comunidades
CREATE TABLE IF NOT EXISTS comunidades (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    historia TEXT,
    padroeiro_id INTEGER NOT NULL, -- Chave estrangeira para intercessores
    padroeiro_nome TEXT, -- Nome do patrono para exibição rápida
    fotos_galeria_json TEXT, -- Caminho para imagens da comunidade (JSON ?)
    site_url TEXT, -- URL do site oficial da comunidade
    status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (padroeiro_id) REFERENCES intercessores(id)
);

-- Índice para pesquisa rápida por slug em comunidades
CREATE INDEX IF NOT EXISTS idx_comunidades_slug ON comunidades (slug);

-- Tabela para armazenar graças
CREATE TABLE IF NOT EXISTS gracas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    intercessor_id INTEGER NOT NULL, -- Chave estrangeira para intercessores
    comunidades_id INTEGER , -- Chave estrangeira para comunidade vinculada
    slug TEXT NOT NULL,
    nome_privado TEXT,
    nome_exibicao TEXT NOT NULL,
    localidade TEXT,
    resumo TEXT NOT NULL,
    relato TEXT NOT NULL,
    imagem_santinho_url TEXT,
    status TEXT DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'publicado')),
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(intercessor_id, slug),
    FOREIGN KEY (intercessor_id) REFERENCES intercessores(id),
    FOREIGN KEY (comunidades_id) REFERENCES comunidades(id)
);

-- Índice para pesquisa rápida por slug em graças
CREATE INDEX IF NOT EXISTS idx_gracas_slug ON gracas (slug);

CREATE INDEX IF NOT EXISTS idx_gracas_intercessor_id ON gracas (intercessor_id);
CREATE INDEX IF NOT EXISTS idx_gracas_comunidades_id ON gracas (comunidades_id);
CREATE INDEX IF NOT EXISTS idx_comunidades_padroeiro_id ON comunidades (padroeiro_id);