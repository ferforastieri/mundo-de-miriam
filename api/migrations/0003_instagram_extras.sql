-- Estatísticas extras do Instagram (conta, mídias e demografia)
-- e histórico de publicações feitas pelo painel.

ALTER TABLE instagram_snapshots ADD COLUMN reach INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN profile_views INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN accounts_engaged INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN total_interactions INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN likes INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN comments INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN shares INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN saves INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN new_followers INTEGER;
ALTER TABLE instagram_snapshots ADD COLUMN website_clicks INTEGER;

CREATE TABLE IF NOT EXISTS instagram_media (
  id TEXT PRIMARY KEY,
  media_type TEXT,
  permalink TEXT,
  caption TEXT,
  published_at TEXT,
  like_count INTEGER,
  comments_count INTEGER,
  views INTEGER,
  reach INTEGER,
  shares INTEGER,
  saves INTEGER,
  total_interactions INTEGER,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_instagram_media_published ON instagram_media(published_at);

CREATE TABLE IF NOT EXISTS instagram_demographics (
  id TEXT PRIMARY KEY,
  captured_at TEXT NOT NULL,
  metric TEXT NOT NULL,
  breakdown TEXT NOT NULL,
  payload TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_instagram_demographics ON instagram_demographics(captured_at);

CREATE TABLE IF NOT EXISTS instagram_publications (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  published_at TEXT,
  status TEXT NOT NULL,
  caption TEXT,
  ig_media_id TEXT,
  permalink TEXT,
  photo_ids TEXT,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_instagram_publications_created ON instagram_publications(created_at);
