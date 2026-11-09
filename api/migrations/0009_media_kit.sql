-- Material de apresentação (PDF) gerado pelo painel.

-- Marca/parceria marcada como "fechada". Uma marca pode ter parcerias feitas
-- (fotos publicadas) e também aparecer como parceria fechada (novo contrato).
ALTER TABLE photo_groups ADD COLUMN is_closed INTEGER NOT NULL DEFAULT 0;

-- Visualizações do período (insights da conta), além das views das mídias.
ALTER TABLE instagram_snapshots ADD COLUMN views INTEGER;

-- Dados públicos do perfil do Instagram usados no material.
ALTER TABLE instagram_state ADD COLUMN full_name TEXT;
ALTER TABLE instagram_state ADD COLUMN biography TEXT;
ALTER TABLE instagram_state ADD COLUMN website TEXT;
ALTER TABLE instagram_state ADD COLUMN follows_count INTEGER;
ALTER TABLE instagram_state ADD COLUMN profile_picture_url TEXT;
