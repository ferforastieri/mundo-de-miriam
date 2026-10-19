-- Cada tela passa a carregar os próprios dados de menu/apresentação.
-- Nada de títulos, rotas, rótulos ou ícones fixos no código.
ALTER TABLE screens ADD COLUMN menu_label TEXT NOT NULL DEFAULT '';
ALTER TABLE screens ADD COLUMN menu_category TEXT NOT NULL DEFAULT '';
ALTER TABLE screens ADD COLUMN icon TEXT NOT NULL DEFAULT 'image';

UPDATE screens SET menu_label = 'Artístico',      menu_category = 'Criação',      icon = 'palette'     WHERE id = 'artistic';
UPDATE screens SET menu_label = 'Beauty',         menu_category = 'Maquiagem',    icon = 'image'       WHERE id = 'beauty';
UPDATE screens SET menu_label = 'E-commerce',     menu_category = 'Fotografia',   icon = 'camera'      WHERE id = 'ecommerce';
UPDATE screens SET menu_label = 'Parcerias',      menu_category = 'Colaborações', icon = 'partnership' WHERE id = 'partnerships';
UPDATE screens SET menu_label = 'Foto de perfil', menu_category = 'Site',         icon = 'portrait'    WHERE id = 'profile';
UPDATE screens SET menu_label = 'Currículo',      menu_category = 'Site',         icon = 'document'    WHERE id = 'curriculum';
UPDATE screens SET menu_label = 'Mimelie',        menu_category = 'Site',         icon = 'symbol'      WHERE id = 'mimelie';

-- telas que ainda não têm rótulo definido passam a usar o próprio nome
UPDATE screens SET menu_label = name WHERE menu_label = '';
