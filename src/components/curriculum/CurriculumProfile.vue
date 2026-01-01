<template>
  <div class="curriculum-profile">
    <!-- Header Section -->
    <div class="curriculum-header">
      <button @click="goBack" class="back-button">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        <span><TranslatableText text="Voltar" /></span>
      </button>
      
      <div class="header-content">
        <h1 class="curriculum-title">
          <TranslatableText text="Currículo" />
        </h1>
        <div class="buttons-group">
          <button @click="downloadPDF" class="download-button" ref="downloadBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            <span><TranslatableText text="Curriculo Moderno" /></span>
          </button>
          <button @click="downloadTraditionalPDF" class="download-traditional-button" ref="downloadTraditionalBtn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
            </svg>
            <span><TranslatableText text="Currículo Tradicional" /></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Curriculum Content -->
    <div class="curriculum-content" ref="curriculumContent">
      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-info">
          <h2 class="name">Miriam</h2>
          <p class="title">Maquiadora Profissional & Fotógrafa</p>
          <p class="website">
            <a href="https://mundodemiriam.vercel.app/" target="_blank" rel="noopener noreferrer" class="portfolio-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"/>
              </svg>
              <TranslatableText text="Meu Portfolio" />
            </a>
            <a href="https://instagram.com/mihforastieri" target="_blank" rel="noopener noreferrer" class="instagram-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <TranslatableText text="Instagram" />
            </a>
            <a href="https://wa.me/5515920029139" target="_blank" class="whatsapp-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              (15) 92002-9139
            </a>
          </p>
          <p class="location">Sorocaba, São Paulo</p>
        </div>
        <div class="profile-image">
          <img src="/assets/profile/fotodalinda.jpg" alt="Miriam - Maquiadora" />
        </div>
      </div>

      <!-- About Section -->
      <div class="section">
        <h3 class="section-title"><TranslatableText text="Sobre" /></h3>
        <div class="section-content">
          <p>
            Maquiadora profissional especializada em maquiagem artística, beauty e fotografia e-commerce. Experiência em vendas, atendimento ao cliente e operações de loja.
          </p>
          <p>
            Expertise em fotografia profissional, edição digital e marketing para redes sociais. Conhecimento avançado em colorimetria, iluminação e produção de conteúdo visual. Profissional proativa, organizada e com facilidade para trabalhar em equipe.
          </p>
        </div>
      </div>

      <!-- Skills Section -->
      <div class="section">
        <h3 class="section-title"><TranslatableText text="Habilidades" /></h3>
        <div class="skills-content">
          <div class="skill-category">
            <h4><TranslatableText text="Maquiagem" /></h4>
            <ul>
              <li>Maquiagem Artística</li>
              <li>Beauty Makeup</li>
              <li>Colorimetria</li>
            </ul>
          </div>
          <div class="skill-category">
            <h4><TranslatableText text="Vendas e Operações" /></h4>
            <ul>
              <li>Vendas Consultivas</li>
              <li>Operação de Caixa</li>
              <li>Controle de Estoque</li>
            </ul>
          </div>
          <div class="skill-category">
            <h4><TranslatableText text="Fotografia" /></h4>
            <ul>
              <li>Fotografia Beauty</li>
              <li>Marketing Digital</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Education Section -->
      <div class="section">
        <h3 class="section-title"><TranslatableText text="Educação" /></h3>
        <div class="education-content">
          <div class="education-item">
            <div class="education-header">
              <h4>Curso Aviação Civil - Comissário de Bordo</h4>
              <span class="period">01/2020 - 12/2021</span>
            </div>
            <p class="location">Belo Horizonte, Minas Gerais</p>
          </div>
          <div class="education-item">
            <div class="education-header">
              <h4>Curso Fotografia e Marketing para Redes Sociais</h4>
              <span class="period">01/2018 - 12/2019</span>
            </div>
            <p class="location">Belo Horizonte, Minas Gerais</p>
          </div>
          <div class="education-item">
            <div class="education-header">
              <h4>Ensino Médio Completo</h4>
              <span class="period">01/2015 - 12/2018</span>
            </div>
            <p class="location">Belo Horizonte, Minas Gerais</p>
          </div>
        </div>
      </div>

      <!-- Specializations Section -->
      <div class="section">
        <h3 class="section-title"><TranslatableText text="Especializações" /></h3>
        <div class="education-content">
          <div class="education-item">
            <div class="education-header">
              <h4>Masterclass Fotografia e Edição</h4>
              <span class="period">2025</span>
            </div>
            <p class="location">Nathalia Teodoro</p>
            <p class="description">Fotografia profissional, edição digital e técnicas avançadas de pós-produção.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Segredos da Make LiftGlow</h4>
              <span class="period">2024</span>
            </div>
            <p class="location">Luana Charamba</p>
            <p class="description">Técnicas de maquiagem com lifting facial e efeito glow para realçar beleza natural.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Nível Social Make Atendimento</h4>
              <span class="period">2024</span>
            </div>
            <p class="location">Carla Marinhos</p>
            <p class="description">Maquiagem para eventos sociais e atendimento profissional especializado.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Maquiadora Nível Milionária</h4>
              <span class="period">2022</span>
            </div>
            <p class="location">Carla Marinhos</p>
            <p class="description">Maquiagem profissional avançada e estratégias de gestão de carreira.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Curso de Transformação De Maquiagem</h4>
              <span class="period">2022</span>
            </div>
            <p class="location">Katiely Marques</p>
            <p class="description">Técnicas de transformação, correção facial e modelagem através da maquiagem.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Descomplicando a Maquiagem</h4>
              <span class="period">2022</span>
            </div>
            <p class="location">Workshop Katiely Marques</p>
            <p class="description">Workshop prático em técnicas básicas de maquiagem e ensino didático.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>O Segredo Dos Reels e Fotos Que Viralizam</h4>
              <span class="period">2023</span>
            </div>
            <p class="location">O Biel Moura</p>
            <p class="description">Criação de conteúdo viral no Instagram com estratégias de reels e engajamento.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>O Segredo Das Fotos De Maquiagem</h4>
              <span class="period">2022</span>
            </div>
            <p class="location">Carla Marinhos</p>
            <p class="description">Fotografia especializada para maquiagem com técnicas de iluminação e composição.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Guia de Conteúdo Para Instagram</h4>
              <span class="period">2022</span>
            </div>
            <p class="location">Nathalia Teodoro</p>
            <p class="description">Estratégias de conteúdo para Instagram com planejamento e otimização de posts.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Guia de Vídeos para Redes Sociais</h4>
              <span class="period">2022</span>
            </div>
            <p class="location">Nathalia Teodoro</p>
            <p class="description">Criação de conteúdo audiovisual para redes sociais e estratégias digitais.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Fotografia para Maquiadores</h4>
              <span class="period">2021</span>
            </div>
            <p class="location">Nathalia Teodoro</p>
            <p class="description">Fotografia para maquiagem com captura de detalhes e iluminação beauty.</p>
          </div>
          
          <div class="education-item">
            <div class="education-header">
              <h4>Colorimetria como Você Nunca Viu</h4>
              <span class="period">2020</span>
            </div>
            <p class="location">Nathalia Teodoro</p>
            <p class="description">Teoria das cores aplicada à maquiagem e técnicas de correção de cor.</p>
          </div>
        </div>
      </div>

      <!-- Experience Section -->
      <div class="section">
        <h3 class="section-title"><TranslatableText text="Experiência" /></h3>
        <div class="experience-content">
          <div class="experience-item">
            <div class="experience-header">
              <h4>Operador de Loja, Vendedora Setor Maquiagem</h4>
              <span class="period">2025</span>
            </div>
            <p class="company">Supermercado dos Cosméticos Princesa</p>
            <p class="location">Sorocaba, São Paulo</p>
            <ul class="responsibilities">
              <li>Consultoria especializada em maquiagem e vendas de produtos de beleza.</li>
              <li>Operação de loja, controle de estoque e atendimento personalizado ao cliente.</li>
            </ul>
          </div>
          
          <div class="experience-item">
            <div class="experience-header">
              <h4>Vendedora</h4>
              <span class="period">2024</span>
            </div>
            <p class="company">Mais Q Makeup</p>
            <p class="location">Betim, Minas Gerais</p>
            <ul class="responsibilities">
              <li>Vendas consultivas de produtos de maquiagem e demonstração de técnicas.</li>
              <li>Atendimento especializado e relacionamento com clientes no setor de beleza.</li>
            </ul>
          </div>
          
          <div class="experience-item">
            <div class="experience-header">
              <h4>Caixa e Operadora de Loja</h4>
              <span class="period">01/2024 - 12/2024</span>
            </div>
            <p class="company">Shopping Partage Estripulia</p>
            <p class="location">Betim, Minas Gerais</p>
            <ul class="responsibilities">
              <li>Operação de caixa, controle de estoque e atendimento ao cliente.</li>
              <li>Vendas no setor de varejo e organização da loja.</li>
            </ul>
          </div>
          <div class="experience-item">
            <div class="experience-header">
              <h4>Cabeleireira e Maquiadora</h4>
              <span class="period">01/2020 - 12/2023</span>
            </div>
            <p class="company">Salão de beleza</p>
            <p class="location">Juatuba, Minas Gerais</p>
            <ul class="responsibilities">
              <li>Maquiagem profissional para eventos e ensaios fotográficos.</li>
              <li>Fotografia, edição de imagens e marketing para redes sociais.</li>
            </ul>
          </div>
          <div class="experience-item">
            <div class="experience-header">
              <h4>Atendente</h4>
              <span class="period">01/2020 - 12/2021</span>
            </div>
            <p class="company">Jadore Semijoias</p>
            <p class="location">Juatuba, Minas Gerais</p>
            <ul class="responsibilities">
              <li>Vendas de semijoias e atendimento especializado ao cliente.</li>
              <li>Operação de caixa e controle de pagamentos.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { TranslatableText } from '../common'
import html2pdf from 'html2pdf.js'

export default {
  name: 'CurriculumProfile',
  components: {
    TranslatableText
  },
  setup() {
    const router = useRouter()
    const { t } = useI18n()
    const curriculumContent = ref(null)
    const downloadBtn = ref(null)
    const downloadTraditionalBtn = ref(null)
    
    const goBack = () => {
      router.push('/about')
    }

    const downloadPDF = async () => {
      try {
        const originalText = downloadBtn.value.innerHTML
        downloadBtn.value.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="animate-spin">
            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364-6.364l-2.828 2.828M7.464 16.536l-2.828 2.828m12.728-12.728l-2.828-2.828M7.464 7.464L4.636 4.636"/>
          </svg>
          <span>${t('Gerando PDF...')}</span>
        `
        downloadBtn.value.disabled = true

        const opt = {
          margin: [0.3, 0.3, 0.3, 0.3],
          filename: 'curriculo-miriam.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            scrollX: 0,
            scrollY: 0,
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { 
            mode: ['avoid-all', 'css', 'legacy']
          }
        }

        curriculumContent.value.classList.add('pdf-export')
        
        await html2pdf().set(opt).from(curriculumContent.value).save()
        
        curriculumContent.value.classList.remove('pdf-export')

        downloadBtn.value.innerHTML = originalText
        downloadBtn.value.disabled = false

      } catch (error) {
        downloadBtn.value.innerHTML = originalText
        downloadBtn.value.disabled = false
        alert(t('Erro ao gerar PDF. Tente novamente.'))
      }
    }

    const downloadTraditionalPDF = async () => {
      const originalText = downloadTraditionalBtn.value.innerHTML
      let tempDiv = null
      
      try {
        downloadTraditionalBtn.value.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="animate-spin">
            <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.364-6.364l-2.828 2.828M7.464 16.536l-2.828 2.828m12.728-12.728l-2.828-2.828M7.464 7.464L4.636 4.636"/>
          </svg>
          <span>${t('Gerando...')}</span>
        `
        downloadTraditionalBtn.value.disabled = true

        const traditionalContent = createTraditionalContent()
        
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed'
        overlay.style.top = '0'
        overlay.style.left = '0'
        overlay.style.width = '100%'
        overlay.style.height = '100%'
        overlay.style.background = 'rgba(0, 0, 0, 0.85)'
        overlay.style.zIndex = '99999'
        overlay.style.display = 'flex'
        overlay.style.alignItems = 'center'
        overlay.style.justifyContent = 'center'
        overlay.style.color = 'white'
        overlay.style.fontSize = '20px'
        overlay.style.fontFamily = 'Arial, sans-serif'
        overlay.innerHTML = `<div style="text-align: center;"><div style="font-size: 40px; margin-bottom: 10px;">⏳</div><div>${t('Gerando PDF Tradicional...')}</div></div>`
        document.body.appendChild(overlay)
        
        tempDiv = document.createElement('div')
        tempDiv.innerHTML = traditionalContent
        tempDiv.style.position = 'fixed'
        tempDiv.style.top = '0'
        tempDiv.style.left = '0'
        tempDiv.style.width = '210mm'
        tempDiv.style.zIndex = '9998'
        tempDiv.style.background = 'white'
        tempDiv.style.visibility = 'visible'
        tempDiv.style.opacity = '1'
        document.body.appendChild(tempDiv)

        await new Promise(resolve => setTimeout(resolve, 1000))

        const opt = {
          margin: [0.4, 0.5, 0.4, 0.5],
          filename: 'curriculo-miriam-tradicional.pdf',
          image: { type: 'jpeg', quality: 0.95 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: tempDiv.offsetWidth,
            height: tempDiv.offsetHeight,
            windowWidth: tempDiv.offsetWidth,
            windowHeight: tempDiv.offsetHeight
          },
          jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait',
            compress: true
          }
        }

        await html2pdf().set(opt).from(tempDiv).save()
        
        document.body.removeChild(tempDiv)
        document.body.removeChild(overlay)
        tempDiv = null

        downloadTraditionalBtn.value.innerHTML = originalText
        downloadTraditionalBtn.value.disabled = false

      } catch (error) {
        if (tempDiv && tempDiv.parentNode) {
          document.body.removeChild(tempDiv)
        }
        const overlayElement = document.querySelector('[style*="z-index: 99999"]')
        if (overlayElement && overlayElement.parentNode) {
          document.body.removeChild(overlayElement)
        }
        
        downloadTraditionalBtn.value.innerHTML = originalText
        downloadTraditionalBtn.value.disabled = false
        alert(t('Erro ao gerar PDF. Tente novamente.'))
      }
    }

    const createTraditionalContent = () => {
      return `
        <div style="font-family: Arial, sans-serif; width: 100%; margin: 0; padding: 20px 20px 20px 80px; font-size: 11pt; line-height: 1.3; color: #000; background: #fff; box-sizing: border-box;">
          <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
            <h1 style="margin: 0 0 5px 0; font-size: 18pt; font-weight: bold; color: #000;">MIRIAM ALVES FORASTIERI</h1>
            <p style="margin: 3px 0; font-size: 11pt; font-weight: bold;">Vendas | Maquiagem | Atendimento ao Cliente</p>
            <p style="margin: 3px 0; font-size: 10pt;">Sorocaba, São Paulo | (15) 92002-9139</p>
          </div>

          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; color: #000; margin: 0 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">PERFIL PROFISSIONAL</h2>
            <p style="margin: 0; text-align: justify; font-size: 10pt;">
              Profissional com sólida experiência em vendas consultivas e atendimento ao cliente no setor de beleza e varejo. 
              Habilidade em operação de loja, controle de estoque e gestão de caixa. Especializada em maquiagem profissional, 
              com conhecimento em colorimetria e técnicas artísticas. Experiência adicional em fotografia e marketing digital. 
              Proativa, organizada e com excelente relacionamento interpessoal.
            </p>
          </div>

          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; color: #000; margin: 0 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">HABILIDADES</h2>
            <table style="width: 100%; font-size: 9pt; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px; vertical-align: top; width: 25%;">
                  <strong>Vendas:</strong> Vendas Consultivas, Operação de Caixa, Relacionamento
                </td>
                <td style="padding: 5px; vertical-align: top; width: 25%;">
                  <strong>Atendimento:</strong> Atendimento ao Cliente, Organização, Estoque
                </td>
                <td style="padding: 5px; vertical-align: top; width: 25%;">
                  <strong>Maquiagem:</strong> Artística, Beauty, Colorimetria
                </td>
                <td style="padding: 5px; vertical-align: top; width: 25%;">
                  <strong>Fotografia:</strong> Fotografia Beauty, Edição, Marketing Digital
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; color: #000; margin: 0 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">EXPERIÊNCIA PROFISSIONAL</h2>
            
            <div style="margin-bottom: 8px; font-size: 10pt;">
              <p style="margin: 0;"><strong>Operador de Loja, Vendedora Setor Maquiagem</strong> | 2025</p>
              <p style="margin: 0; font-style: italic;">Supermercado dos Cosméticos Princesa - Sorocaba, SP</p>
              <p style="margin: 0;">• Consultoria especializada em maquiagem e vendas de produtos de beleza</p>
              <p style="margin: 0;">• Operação de loja, controle de estoque e atendimento personalizado</p>
            </div>

            <div style="margin-bottom: 8px; font-size: 10pt;">
              <p style="margin: 0;"><strong>Vendedora</strong> | 2024</p>
              <p style="margin: 0; font-style: italic;">Mais Q Makeup - Betim, MG</p>
              <p style="margin: 0;">• Vendas consultivas de produtos de maquiagem e demonstração de técnicas</p>
            </div>

            <div style="margin-bottom: 8px; font-size: 10pt;">
              <p style="margin: 0;"><strong>Caixa e Operadora de Loja</strong> | 2024</p>
              <p style="margin: 0; font-style: italic;">Shopping Partage Estripulia - Betim, MG</p>
              <p style="margin: 0;">• Operação de caixa, controle de estoque e atendimento ao cliente</p>
            </div>

            <div style="margin-bottom: 8px; font-size: 10pt;">
              <p style="margin: 0;"><strong>Cabeleireira e Maquiadora</strong> | 2020 - 2023</p>
              <p style="margin: 0; font-style: italic;">Salão de beleza - Juatuba, MG</p>
              <p style="margin: 0;">• Maquiagem profissional para eventos e ensaios fotográficos</p>
              <p style="margin: 0;">• Fotografia, edição de imagens e marketing para redes sociais</p>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <h2 style="font-size: 13pt; font-weight: bold; color: #000; margin: 0 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">FORMAÇÃO ACADÊMICA</h2>
            <div style="font-size: 10pt;">
              <p style="margin: 3px 0;"><strong>Curso Aviação Civil - Comissário de Bordo</strong> | 2020 - 2021</p>
              <p style="margin: 3px 0;"><strong>Curso Fotografia e Marketing para Redes Sociais</strong> | 2018 - 2019</p>
              <p style="margin: 3px 0;"><strong>Ensino Médio Completo</strong> | 2015 - 2018</p>
            </div>
          </div>

          <div style="margin-bottom: 10px;">
            <h2 style="font-size: 13pt; font-weight: bold; color: #000; margin: 0 0 5px 0; border-bottom: 1px solid #333; padding-bottom: 2px;">CURSOS E ESPECIALIZAÇÕES</h2>
            <div style="font-size: 9pt; line-height: 1.3;">
              <p style="margin: 2px 0 0 0;"><strong>Masterclass Fotografia e Edição</strong> (Nathalia Teodoro, 2025)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Fotografia profissional, edição digital e técnicas avançadas de pós-produção.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>Segredos da Make LiftGlow</strong> (Luana Charamba, 2024)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Técnicas de maquiagem com lifting facial e efeito glow.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>Nível Social Make Atendimento</strong> (Carla Marinhos, 2024)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Maquiagem para eventos sociais e atendimento profissional.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>Maquiadora Nível Milionária</strong> (Carla Marinhos, 2022)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Maquiagem profissional avançada e gestão de carreira.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>Curso de Transformação De Maquiagem</strong> (Katiely Marques, 2022)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Técnicas de transformação e correção facial através da maquiagem.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>O Segredo Das Fotos De Maquiagem</strong> (Carla Marinhos, 2022)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Fotografia especializada com técnicas de iluminação e composição.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>Fotografia para Maquiadores</strong> (Nathalia Teodoro, 2021)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Fotografia para maquiagem com captura de detalhes e iluminação beauty.</p>
              
              <p style="margin: 2px 0 0 0;"><strong>Colorimetria como Você Nunca Viu</strong> (Nathalia Teodoro, 2020)</p>
              <p style="margin: 0 0 4px 0; font-style: italic; color: #333;">Teoria das cores aplicada à maquiagem e técnicas de correção de cor.</p>
            </div>
          </div>
        </div>
      `
    }
    
    return {
      goBack,
      downloadPDF,
      downloadTraditionalPDF,
      curriculumContent,
      downloadBtn,
      downloadTraditionalBtn
    }
  }
}
</script>

<style scoped>
.curriculum-profile {
  max-width: 100%;
  width: 100%;
  animation: fadeIn 0.8s ease;
}

.curriculum-header {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8f9fa;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: #520;
  font-family: 'Gilda Display', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: #520;
  color: white;
  transform: translateY(-2px);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.curriculum-title {
  font-family: 'Gilda Display', serif;
  font-size: 2.5rem;
  color: #520;
  margin: 0;
  font-weight: normal;
  letter-spacing: 2px;
}

.buttons-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.download-button,
.download-traditional-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #520;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-family: 'Gilda Display', serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-traditional-button {
  background: #2c5282;
}

.download-button:hover {
  background: #3d0;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.download-traditional-button:hover {
  background: #1e3a5f;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.download-button:disabled,
.download-traditional-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.curriculum-content {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  padding: 2rem;
  font-family: 'Gilda Display', serif;
  line-height: 1.6;
  color: #333;
}

.profile-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.profile-info {
  flex: 1;
}

.profile-info .name {
  font-size: 2.5rem;
  color: #520;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
  letter-spacing: 1px;
}

.profile-info .title {
  font-size: 1.2rem;
  color: #666;
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.profile-info .website {
  font-size: 1rem;
  color: #520;
  margin: 0 0 0.5rem 0;
}

.profile-info .website .portfolio-link,
.profile-info .website .instagram-link,
.profile-info .website .whatsapp-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #520;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: rgba(82, 0, 0, 0.05);
  margin-right: 0.5rem;
}

.profile-info .website .portfolio-link:hover,
.profile-info .website .instagram-link:hover,
.profile-info .website .whatsapp-link:hover {
  background: rgba(82, 0, 0, 0.1);
  transform: translateY(-1px);
}

.profile-info .location {
  font-size: 1rem;
  color: #888;
  margin: 0;
}

.profile-image {
  margin-left: 2rem;
}

.profile-image img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #520;
}

.pdf-export .profile-image img {
  width: 120px !important;
  height: 120px !important;
  object-fit: cover !important;
  object-position: center !important;
  border: 4px solid #520 !important;
}

.pdf-export .curriculum-content {
  padding-top: 0.5rem !important;
  margin-top: 0 !important;
}

.pdf-export .curriculum-header {
  margin-bottom: 1rem !important;
  padding: 1rem !important;
}

.pdf-export .section {
  page-break-inside: avoid;
  margin-bottom: 1.5rem;
  display: block !important;
  visibility: visible !important;
}

.pdf-export .experience-item,
.pdf-export .education-item {
  page-break-inside: avoid;
  margin-bottom: 1rem;
  display: block !important;
  visibility: visible !important;
}

.pdf-export .experience-content,
.pdf-export .education-content {
  display: block !important;
  visibility: visible !important;
}

.pdf-export {
  width: 100% !important;
  max-width: 100% !important;
  min-width: 100% !important;
  height: auto !important;
}

.pdf-export .profile-info .website {
  display: flex !important;
  flex-direction: row !important;
  gap: 0.5rem !important;
  align-items: center !important;
  flex-wrap: nowrap !important;
}

.pdf-export .profile-info .website .portfolio-link,
.pdf-export .profile-info .website .instagram-link,
.pdf-export .profile-info .website .whatsapp-link {
  display: inline-flex !important;
  width: auto !important;
  justify-content: flex-start !important;
  margin-right: 0.5rem !important;
  margin-bottom: 0 !important;
  flex-shrink: 0 !important;
}

.pdf-export .profile-section {
  flex-direction: row !important;
  text-align: left !important;
}

.pdf-export .profile-image {
  margin: 0 !important;
}

.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.8rem;
  color: #520;
  margin: 0 0 1rem 0;
  font-weight: normal;
  letter-spacing: 1px;
  border-bottom: 2px solid #520;
  padding-bottom: 0.5rem;
}

.section-content p {
  margin-bottom: 1rem;
  text-align: justify;
}

.skills-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.skill-category h4 {
  font-size: 1.2rem;
  color: #520;
  margin: 0 0 0.5rem 0;
  font-weight: normal;
}

.skill-category ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.skill-category li {
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1rem;
}

.skill-category li::before {
  content: "•";
  color: #520;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.education-content,
.experience-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.education-item,
.experience-item {
  border-left: 4px solid #520;
  padding-left: 1rem;
}

.education-header,
.experience-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.education-header h4,
.experience-header h4 {
  font-size: 1.2rem;
  color: #520;
  margin: 0;
  font-weight: normal;
  flex: 1;
}

.period {
  font-size: 0.9rem;
  color: #666;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
}

.company {
  font-size: 1rem;
  color: #520;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.location {
  font-size: 0.9rem;
  color: #666;
  margin: 0 0 0.5rem 0;
}

.responsibilities {
  list-style: none;
  padding: 0;
  margin: 0;
}

.responsibilities li {
  padding: 0.25rem 0;
  position: relative;
  padding-left: 1rem;
}

.responsibilities li::before {
  content: "•";
  color: #520;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.education-item .description {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0 0 0;
  line-height: 1.4;
  font-style: italic;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@media (max-width: 768px) {
  .curriculum-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }
  
  .header-content {
    justify-content: center;
    flex-direction: column;
    gap: 1rem;
  }
  
  .buttons-group {
    flex-direction: column;
    width: 100%;
  }

  .download-button,
  .download-traditional-button {
    width: 100%;
    justify-content: center;
  }
  
  .curriculum-title {
    font-size: 2rem;
  }
  
  .profile-section {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-image {
    margin: 1rem 0 0 0;
  }
  
  .skills-content {
    grid-template-columns: 1fr;
  }
  
  .education-header,
  .experience-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .curriculum-content {
    padding: 1.5rem;
  }
  
  .profile-info .website {
    display: flex !important;
    flex-direction: column !important;
    gap: 0.5rem !important;
    align-items: center !important;
  }
  
  .profile-info .website .portfolio-link,
  .profile-info .website .instagram-link,
  .profile-info .website .whatsapp-link {
    display: flex !important;
    width: 100% !important;
    justify-content: center !important;
    margin-right: 0 !important;
    margin-bottom: 0.25rem !important;
  }
}

@media (max-width: 480px) {
  .curriculum-title {
    font-size: 1.5rem;
  }
  
  .curriculum-content {
    padding: 1rem;
  }
  
  .back-button,
  .download-button,
  .download-traditional-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }
  
}

@media print {
  .portfolio-link::after {
    content: " (https://mundodemiriam.vercel.app/)";
    font-size: 0.8rem;
    color: #666;
  }
  
  .instagram-link::after {
    content: " (https://instagram.com/mihforastieri)";
    font-size: 0.8rem;
    color: #666;
  }
  
  .whatsapp-link::after {
    content: " (https://wa.me/5515920029139)";
    font-size: 0.8rem;
    color: #666;
  }
  
  .portfolio-link,
  .instagram-link,
  .whatsapp-link {
    text-decoration: underline !important;
    color: #000 !important;
    background: none !important;
    padding: 0 !important;
    margin-right: 0.5rem !important;
  }
  
  .back-button,
  .download-button {
    display: none !important;
  }
}
</style>
