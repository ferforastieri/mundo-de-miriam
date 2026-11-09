-- Totais oficiais do Instagram por janela (7, 30 e 90 dias).
-- A API entrega o total do período com metric_type=total_value; guardamos
-- esse recorte para o painel e o PDF mostrarem exatamente o número do app.
CREATE TABLE IF NOT EXISTS instagram_period_totals (
  days INTEGER PRIMARY KEY,
  captured_at TEXT NOT NULL,
  window_from TEXT,
  window_to TEXT,
  payload TEXT NOT NULL
);
