PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  last_login_at TEXT
);

CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  token_hash TEXT NOT NULL UNIQUE,
  admin_user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  last_seen_at TEXT NOT NULL,
  ip TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  email TEXT,
  success INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_created ON login_attempts(ip, created_at);

CREATE TABLE IF NOT EXISTS screens (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  kind TEXT NOT NULL DEFAULT 'gallery' CHECK (kind IN ('gallery', 'partnerships', 'single')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS photo_groups (
  id TEXT PRIMARY KEY,
  screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_photo_groups_screen ON photo_groups(screen_id, sort_order);

CREATE TABLE IF NOT EXISTS photos (
  id TEXT PRIMARY KEY,
  screen_id TEXT NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  group_id TEXT REFERENCES photo_groups(id) ON DELETE CASCADE,
  storage_key TEXT NOT NULL,
  alt TEXT,
  caption TEXT,
  content_type TEXT NOT NULL DEFAULT 'image/jpeg',
  bytes INTEGER NOT NULL DEFAULT 0,
  width INTEGER,
  height INTEGER,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible INTEGER NOT NULL DEFAULT 1,
  is_featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_photos_screen ON photos(screen_id, group_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_photos_created ON photos(created_at);
CREATE UNIQUE INDEX IF NOT EXISTS idx_photos_one_featured_per_group
  ON photos(group_id) WHERE group_id IS NOT NULL AND is_featured = 1;

CREATE TABLE IF NOT EXISTS instagram_state (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  encrypted_token TEXT,
  token_iv TEXT,
  token_expires_at TEXT,
  token_updated_at TEXT,
  instagram_user_id TEXT,
  username TEXT,
  last_attempt_at TEXT,
  last_success_at TEXT,
  last_error TEXT
);

CREATE TABLE IF NOT EXISTS instagram_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  followers INTEGER,
  posts INTEGER,
  recent_views INTEGER,
  recent_interactions INTEGER,
  recent_items INTEGER,
  captured_at TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'cron',
  success INTEGER NOT NULL DEFAULT 1,
  error TEXT
);

CREATE INDEX IF NOT EXISTS idx_instagram_snapshots_captured ON instagram_snapshots(captured_at);
