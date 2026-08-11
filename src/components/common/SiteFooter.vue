<template>
  <footer class="site-footer">
    <div class="footer-main">
      <RouterLink to="/" class="footer-brand" aria-label="Mundo de Miriam — página inicial">
        <span class="brand-monogram" aria-hidden="true">M</span>
        <span class="brand-copy">
          <strong>Mundo de Miriam</strong>
          <small>
            <TranslatableText text="Maquiagem, fotografia e beleza em cada detalhe." />
          </small>
        </span>
      </RouterLink>

      <nav class="footer-links" aria-label="Redes sociais e contato">
        <a
          href="https://www.instagram.com/mihforastieri/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.8" />
            <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
            <circle cx="17.4" cy="6.7" r="1.1" fill="currentColor" />
          </svg>
        </a>

        <a
          href="https://wa.me/5515991962479"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          title="WhatsApp"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.92L2 22l5.22-1.57A9.94 9.94 0 1 0 12.04 2Zm0 17.98a8 8 0 0 1-4.08-1.12l-.3-.18-3.1.94.96-3.02-.2-.31a7.92 7.92 0 1 1 6.72 3.69Zm4.36-5.94c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.42-1.33-1.66-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.09 3.62.57.25 1.02.39 1.37.5.57.18 1.1.16 1.51.1.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
          </svg>
        </a>

        <a
          href="mailto:cleresmimakeup@gmail.com"
          aria-label="E-mail"
          title="E-mail"
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
            <path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </a>
      </nav>
    </div>

    <div class="footer-base">
      <span>© {{ currentYear }} Miriam Cléres Forastieri</span>
      <span>Sorocaba · São Paulo</span>
    </div>
  </footer>
</template>

<script>
import TranslatableText from './TranslatableText.vue'

export default {
  name: 'SiteFooter',
  components: {
    TranslatableText
  },
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.site-footer {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: #fff;
  background: #552200;
  box-shadow: 0 16px 38px rgba(85, 34, 0, 0.16);
  box-sizing: border-box;
}

@media (min-width: 769px) {
  .site-footer {
    position: relative;
    z-index: 10005;
    width: 100%;
    max-width: none;
    margin: 0;
  }
}

.footer-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.5rem 1.75rem;
}

.footer-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.9rem;
  min-width: 0;
  color: inherit;
  text-decoration: none;
}

.brand-monogram {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  color: var(--primary);
  background: var(--on-primary);
  border-radius: 50%;
  font-size: 1.8rem;
  line-height: 1;
}

.brand-copy {
  display: flex;
  flex-direction: column;
}

.brand-copy strong {
  font-size: 1.15rem;
  font-weight: normal;
  letter-spacing: 0.08em;
}

.brand-copy small {
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.72rem;
  line-height: 1.35;
  letter-spacing: 0.04em;
}

.footer-links {
  display: flex;
  gap: 0.65rem;
}

.footer-links a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  transition: color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.footer-links a:hover {
  color: #552200;
  background: #fff;
  transform: translateY(-2px);
}

.footer-links a:focus-visible,
.footer-brand:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 4px;
}

.footer-links svg {
  width: 19px;
  height: 19px;
}

.footer-base {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1.75rem;
  color: rgba(255, 255, 255, 0.66);
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  font-size: 0.68rem;
  letter-spacing: 0.06em;
}

@media (max-width: 600px) {
  .site-footer {
    margin-top: 0;
  }

  .footer-main {
    align-items: center;
    flex-direction: column;
    gap: 1.25rem;
    padding: 1.25rem;
    text-align: center;
  }

  .footer-brand {
    justify-content: center;
  }

  .brand-copy small {
    max-width: 170px;
  }

  .footer-base {
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 1.25rem;
    text-align: center;
  }

  .footer-links {
    align-self: center;
  }
}

@media (max-width: 400px) {
  .footer-brand {
    align-items: center;
    flex-direction: column;
  }

  .brand-copy strong {
    font-size: 1.02rem;
  }

  .footer-links {
    width: 100%;
    justify-content: space-between;
  }
}

@media (prefers-reduced-motion: reduce) {
  .footer-links a {
    transition: none;
  }
}
</style>
