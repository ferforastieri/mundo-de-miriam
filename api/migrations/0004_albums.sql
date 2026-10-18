-- Álbuns de branding: páginas públicas e não listadas com fotos selecionadas.
-- Validade opcional (expires_at nulo = para sempre).

CREATE TABLE IF NOT EXISTS albums (
  id TEXT PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_albums_token ON albums(token);
CREATE INDEX IF NOT EXISTS idx_albums_created ON albums(created_at);

CREATE TABLE IF NOT EXISTS album_photos (
  id TEXT PRIMARY KEY,
  album_id TEXT NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  alt TEXT,
  content_type TEXT NOT NULL,
  bytes INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_album_photos_album ON album_photos(album_id, sort_order);
