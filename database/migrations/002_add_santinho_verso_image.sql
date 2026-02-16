-- Migration: Add second santinho image field and rename existing one
-- Date: 2026-02-16
-- Description: Adds imagem_santinho_verso field and renames imagem_santinho_url to imagem_santinho_frente

-- Step 1: Rename existing column
ALTER TABLE gracas RENAME COLUMN imagem_santinho_url TO imagem_santinho_frente;

-- Step 2: Add new column for verso image
ALTER TABLE gracas ADD COLUMN imagem_santinho_verso TEXT;
