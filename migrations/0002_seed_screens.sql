INSERT INTO screens (id, name, description, kind, sort_order, is_visible, created_at, updated_at) VALUES
  ('artistic',    'Portfólio Artístico',   'Maquiagem artística e caracterização',            'gallery',       10, 1, datetime('now'), datetime('now')),
  ('beauty',      'Portfólio Beauty',      'Maquiagem beauty e produção de beleza',           'gallery',       20, 1, datetime('now'), datetime('now')),
  ('ecommerce',   'Fotografia E-commerce', 'Fotografia profissional de produtos',             'gallery',       30, 1, datetime('now'), datetime('now')),
  ('partnerships','Parcerias',             'Campanhas e conteúdos com marcas parceiras',      'partnerships',  40, 1, datetime('now'), datetime('now')),
  ('profile',     'Foto de perfil',        'Retrato usado na home, sobre e currículo',        'single',        50, 1, datetime('now'), datetime('now')),
  ('curriculum',  'Imagem do currículo',   'Imagem de fundo do cartão de contato',            'single',        60, 1, datetime('now'), datetime('now')),
  ('mimelie',     'Símbolo Mimelie',       'Símbolo da marca autoral Mimelie',                'single',        70, 1, datetime('now'), datetime('now'))
ON CONFLICT(id) DO NOTHING;

INSERT INTO photo_groups (id, screen_id, name, sort_order, created_at, updated_at) VALUES
  ('chocolashes', 'partnerships', 'Chocolashes', 10, datetime('now'), datetime('now')),
  ('freshlady',   'partnerships', 'Fresh Lady',  20, datetime('now'), datetime('now')),
  ('gliben',      'partnerships', 'Gliben',      30, datetime('now'), datetime('now')),
  ('icoice',      'partnerships', 'Icoice',      40, datetime('now'), datetime('now')),
  ('ttdeye',      'partnerships', 'TTD Eye',     50, datetime('now'), datetime('now')),
  ('unibling',    'partnerships', 'Unibling',    60, datetime('now'), datetime('now'))
ON CONFLICT(id) DO NOTHING;
