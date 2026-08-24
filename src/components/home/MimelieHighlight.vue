<template>
  <div class="mimelie-highlight-wrap">
    <a
      href="https://mimelie.com"
      class="mimelie-highlight"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Visitar o site oficial da Mimelie"
    >
      <div class="mimelie-highlight__symbol">
        <img src="/assets/mimelie/mimelie-symbol.png" alt="Símbolo da Mimelie" />
      </div>
      <div class="mimelie-highlight__copy">
        <span>Marca autoral</span>
        <h2>Criadora da marca Mimelie</h2>
        <p>Cílios leves e maquiagem delicada para acompanhar a beleza real.</p>
      </div>
      <span class="mimelie-highlight__action">
        <span class="mimelie-highlight__action-label">mimelie.com</span>
        <i aria-hidden="true">↗</i>
      </span>
    </a>

  </div>
</template>

<style scoped>
.mimelie-highlight-wrap { margin: 0 0 3rem; }

.mimelie-highlight {
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) auto;
  gap: clamp(1rem, 3vw, 2rem);
  align-items: center;
  padding: clamp(1rem, 2.5vw, 1.5rem);
  overflow: hidden;
  color: #542a30;
  background: #fbebdc;
  border: 1px solid rgba(84, 42, 48, 0.16);
  border-radius: 1.25rem;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.mimelie-highlight:hover { transform: var(--interactive-lift); box-shadow: var(--interactive-shadow); }
.mimelie-highlight__symbol {
  display: grid;
  aspect-ratio: 1;
  place-items: center;
  padding: 0.9rem;
  background: #fff7ef;
  border: 1px solid rgba(84, 42, 48, 0.2);
  border-radius: 50%;
  box-shadow: 0 8px 22px rgba(84, 42, 48, 0.12);
}
.mimelie-highlight__symbol img { width: 100%; height: 100%; object-fit: contain; }
.mimelie-highlight__copy > span { color: #9f4d4d; font-family: system-ui, sans-serif; font-size: 0.64rem; font-weight: 750; letter-spacing: 0.16em; text-transform: uppercase; }
.mimelie-highlight h2 { margin: 0.4rem 0; color: #542a30; font-size: clamp(1.8rem, 3.5vw, 3rem); font-weight: normal; line-height: 1; }
.mimelie-highlight p { margin: 0; color: #765052; font-family: system-ui, sans-serif; line-height: 1.6; }
.mimelie-highlight__action { display: inline-flex; gap: 0.5rem; align-items: center; font-family: system-ui, sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; white-space: nowrap; text-transform: uppercase; }
.mimelie-highlight__action i { font-size: 1.1rem; font-style: normal; transition: transform 0.2s ease; }
.mimelie-highlight:hover .mimelie-highlight__action i { transform: translate(3px, -3px); }

:global(html[data-theme="dark"] .mimelie-highlight) {
  color: #fff8f3 !important;
  background: #351b20;
  border-color: #9e686d;
  box-shadow: inset 0 0 0 1px rgba(255, 248, 243, 0.08), 0 12px 30px rgba(0, 0, 0, 0.2);
}
:global(html[data-theme="dark"] .mimelie-highlight__symbol) {
  background: #fff7ef;
  border-color: rgba(255, 255, 255, 0.68);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.28);
}
:global(html[data-theme="dark"] .mimelie-highlight__copy > span) { color: #ffc7a5 !important; }
:global(html[data-theme="dark"] .mimelie-highlight h2) { color: #ffffff !important; }
:global(html[data-theme="dark"] .mimelie-highlight p) { color: #f7ded4 !important; }
:global(html[data-theme="dark"] .mimelie-highlight__action) { color: #ffffff !important; }

@media (max-width: 680px) {
  .mimelie-highlight-wrap { margin-bottom: 2rem; }
  .mimelie-highlight { grid-template-columns: 64px minmax(0, 1fr) auto; gap: 0.9rem; padding: 0.9rem; }
  .mimelie-highlight__symbol { padding: 0.6rem; }
  .mimelie-highlight h2 { margin: 0.25rem 0; font-size: 1.45rem; }
  .mimelie-highlight p { display: -webkit-box; overflow: hidden; font-size: 0.78rem; line-height: 1.35; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
  .mimelie-highlight__action { gap: 0.3rem; font-size: 0.62rem; }
}

@media (max-width: 480px) {
  .mimelie-highlight { grid-template-columns: 52px minmax(0, 1fr) auto; gap: 0.7rem; padding: 0.75rem; border-radius: 0.9rem; }
  .mimelie-highlight__copy > span { font-size: 0.55rem; letter-spacing: 0.11em; }
  .mimelie-highlight h2 { font-size: 1.28rem; }
  .mimelie-highlight__action-label { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }
  .mimelie-highlight__action i { font-size: 1rem; }
}

@media (max-width: 360px) {
  .mimelie-highlight p { display: none; }
}

</style>
