-- Migration: Add optional devotee photo field to gracas
-- Date: 2026-02-22
-- Description: Adds foto_devoto field for a wide/personal photo of the devotee (e.g. 1200x675)

ALTER TABLE gracas ADD COLUMN foto_devoto TEXT;
