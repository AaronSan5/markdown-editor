
        class MarkdownEditor {
            constructor() {
                this.editor = document.getElementById('editor');
                this.preview = document.getElementById('preview');
                this.generateBtn = document.getElementById('generateBtn');
                this.contrastBtn = document.getElementById('contrastBtn');
                this.isContrasted = false;
                
                this.initEventListeners();
                this.loadInitialContent();
            }

            initEventListeners() {
                // Botón generar vista previa
                this.generateBtn.addEventListener('click', () => {
                    this.generatePreview();
                });

                // Botón contrastar encabezados
                this.contrastBtn.addEventListener('click', () => {
                    this.toggleHeaderContrast();
                });

                // Auto-generar preview mientras se escribe (opcional)
                this.editor.addEventListener('input', () => {
                    // Descomenta la siguiente línea para preview en tiempo real
                    // this.generatePreview();
                });
            }

            loadInitialContent() {
                // Cargar contenido de ejemplo
                const exampleContent = `# Título Principal
## Subtítulo Secundario
### Título de Nivel 3

Esta es una demostración del editor Markdown.

- Primera lista item
- Segunda lista item
- Tercera lista item

#### Lista Numerada:
1. Primer elemento
2. Segundo elemento  
3. Tercer elemento

##### Más títulos de ejemplo
###### Título más pequeño

- Otra lista
- Con más elementos
- Para probar el editor`;

                this.editor.value = exampleContent;
            }

            generatePreview() {
                const markdownText = this.editor.value;
                const htmlContent = this.markdownToHtml(markdownText);
                
                // Animación de fade in
                this.preview.style.opacity = '0';
                setTimeout(() => {
                    this.preview.innerHTML = htmlContent;
                    this.preview.style.opacity = '1';
                    this.preview.classList.add('fade-in');
                    
                    // Aplicar contraste si está activado
                    if (this.isContrasted) {
                        this.applyHeaderContrast();
                    }
                }, 150);
                
                // Feedback visual del botón
                this.generateBtn.style.background = 'rgba(255,255,255,0.4)';
                setTimeout(() => {
                    this.generateBtn.style.background = 'rgba(255,255,255,0.2)';
                }, 200);
            }

            markdownToHtml(markdown) {
                let html = markdown;

                // HU2: Transformación usando Regex y .replace()
                
                // Encabezados (H1-H6)
                html = html.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
                html = html.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
                html = html.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
                html = html.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
                html = html.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
                html = html.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');

                // Listas no ordenadas
                html = html.replace(/^[\s]*-\s+(.*)$/gm, '<li>$1</li>');
                html = html.replace(/(<li>.*<\/li>)/gs, (match) => {
                    return '<ul>' + match + '</ul>';
                });

                // Listas ordenadas
                html = html.replace(/^[\s]*\d+\.\s+(.*)$/gm, '<li>$1</li>');
                // Reemplazar las listas ordenadas que no están dentro de <ul>
                html = html.replace(/(?<!<\/ul>\n)(<li>(?:(?!<ul>).*\n?)*<\/li>)(?!\n<ul>)/gs, (match) => {
                    if (!match.includes('<ul>')) {
                        return '<ol>' + match + '</ol>';
                    }
                    return match;
                });

                // Limpiar listas duplicadas y mejorar formato
                html = html.replace(/<\/ul>\s*<ul>/g, '');
                html = html.replace(/<\/ol>\s*<ol>/g, '');

                // Convertir saltos de línea en párrafos
                html = html.replace(/\n\n/g, '</p><p>');
                html = html.replace(/^(?!<[hulo])/gm, '<p>');
                html = html.replace(/(?<!>)$/gm, '</p>');
                
                // Limpiar párrafos vacíos y mal formados
                html = html.replace(/<p><\/p>/g, '');
                html = html.replace(/<p>(<[hulo][^>]*>)/g, '$1');
                html = html.replace(/(<\/[hulo][^>]*>)<\/p>/g, '$1');

                return html;
            }

            toggleHeaderContrast() {
                this.isContrasted = !this.isContrasted;
                
                if (this.isContrasted) {
                    this.applyHeaderContrast();
                    this.contrastBtn.textContent = 'Quitar Contraste';
                    this.contrastBtn.style.background = 'rgba(255,255,255,0.4)';
                } else {
                    this.removeHeaderContrast();
                    this.contrastBtn.textContent = 'Contrastar Encabezados';
                    this.contrastBtn.style.background = 'rgba(255,255,255,0.2)';
                }
            }

            applyHeaderContrast() {
                // HU3: Usar querySelectorAll para seleccionar todos los encabezados
                const headers = this.preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
                
                headers.forEach(header => {
                    header.classList.add('contrasted-header');
                });
            }

            removeHeaderContrast() {
                const headers = this.preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
                
                headers.forEach(header => {
                    header.classList.remove('contrasted-header');
                });
            }
        }

        // Inicializar la aplicación cuando el DOM esté listo
        document.addEventListener('DOMContentLoaded', () => {
            new MarkdownEditor();
        });

        // Mensaje de bienvenida en consola
        console.log('🚀 Editor Markdown cargado correctamente!');
        console.log('📝 Funcionalidades implementadas:');
        console.log('   ✅ HU1: Barra de herramientas responsiva');
        console.log('   ✅ HU2: Conversión Markdown a HTML con Regex');
        console.log('   ✅ HU3: Contraste dinámico de encabezados');
    