-- Link privado por tela (substitui o módulo de álbuns de branding):
-- token secreto + validade opcional. Nulo = sem link / para sempre.
ALTER TABLE screens ADD COLUMN share_token TEXT;
ALTER TABLE screens ADD COLUMN expires_at TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_screens_share_token ON screens(share_token);
