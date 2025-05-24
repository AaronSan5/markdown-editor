/**
 * app.js - Aplicación principal del Editor Markdown
 * Integra todas las funcionalidades de las historias de usuario
 */

class MarkdownEditor {
    constructor() {
        // Elementos del DOM
        this.editor = document.getElementById('editor');
        this.preview = document.getElementById('preview');
        this.generateBtn = document.getElementById('generateBtn');
        this.contrastBtn = document.getElementById('contrastBtn');
        this.formatBtn = document.getElementById('formatBtn');
        
        // Estados de la aplicación
        this.isContrasted = false;
        this.isProcessing = false;
        
        // Inicializar la aplicación
        this.initEventListeners();
        this.loadInitialContent();
        this.updateFormatButtonText();
        
        console.log('🚀 Editor Markdown inicializado correctamente!');
    }

    /**
     * Configurar todos los event listeners
     */
    initEventListeners() {
        // HU1: Botón generar vista previa (funcionalidad original)
        this.generateBtn.addEventListener('click', () => {
            this.generatePreview();
        });

        // HU1: Botón contrastar encabezados (funcionalidad original)
        this.contrastBtn.addEventListener('click', () => {
            this.toggleHeaderContrast();
        });

        // HU1: Nuevo botón para aplicar formato
        this.formatBtn.addEventListener('click', () => {
            this.handleFormatButtonClick();
        });

        // Evento opcional para preview en tiempo real
        this.editor.addEventListener('input', () => {
            // Descomenta para activar preview automático
            // this.generatePreview();
        });

        // Manejar selección de texto para actualizar botón de formato
        this.editor.addEventListener('selectionchange', () => {
            this.updateFormatButtonText();
        });

        this.editor.addEventListener('mouseup', () => {
            this.updateFormatButtonText();
        });

        this.editor.addEventListener('keyup', () => {
            this.updateFormatButtonText();
        });
    }

    /**
     * Cargar contenido inicial de ejemplo
     */
    loadInitialContent() {
        const exampleContent = `# Editor Markdown Avanzado
## Funcionalidades Implementadas

### HU1: Formato de Texto
Selecciona texto y usa el botón **"Aplicar Formato"** para alternar entre:
- **Texto en negrita**
- *Texto en cursiva*

### HU2: Listas Dinámicas
Las listas se procesan automáticamente:

#### Lista Ordenada:
1. Primer elemento de la lista
2. Segundo elemento de la lista
3. Tercer elemento de la lista

#### Lista No Ordenada:
- Elemento con viñeta
- Otro elemento con viñeta
- Tercer elemento con viñeta

### HU3: Bloques de Código
El código se resalta automáticamente:

\`\`\`
// Ejemplo de código JavaScript
function saludar(nombre) {
    console.log('Hola ' + nombre);
    return "¡Bienvenido!";
}

const usuario = "Desarrollador";
saludar(usuario);

// Números y comentarios también se resaltan
let contador = 42;
/* Este es un comentario
   de múltiples líneas */
\`\`\`

También funciona con código inline: \`console.log('Hola mundo')\`

##### Más características
###### Prueba todas las funcionalidades`;

        this.editor.value = exampleContent;
    }

    /**
     * HU1 & HU2 & HU3: Generar vista previa integrando todas las funcionalidades
     */
    generatePreview() {
        if (this.isProcessing) return;
        
        this.setProcessingState(true);
        
        const markdownText = this.editor.value;
        
        // Mostrar información de procesamiento en consola
        this.logProcessingInfo(markdownText);
        
        // Aplicar todas las transformaciones en orden
        let htmlContent = this.processMarkdownToHtml(markdownText);
        
        // Actualizar preview con animación
        this.updatePreviewWithAnimation(htmlContent);
        
        this.setProcessingState(false);
    }

    /**
     * Procesar Markdown a HTML integrando todas las funcionalidades
     * @param {string} markdown 
     * @returns {string}
     */
    processMarkdownToHtml(markdown) {
        let html = markdown;

        // HU3: Procesar bloques de código PRIMERO (antes que otros elementos)
        html = processCodeBlocksWithFirstClassFunction(html);

        // HU2: Procesar listas con función de orden superior
        html = processListsWithHigherOrderFunction(html);

        // Procesar encabezados (funcionalidad original)
        html = this.processHeaders(html);

        // Procesar texto en negrita y cursiva
        html = this.processTextFormatting(html);

        // Procesar párrafos
        html = this.processParagraphs(html);

        return html;
    }

    /**
     * Procesar encabezados (funcionalidad original mejorada)
     * @param {string} text 
     * @returns {string}
     */
    processHeaders(text) {
        // Procesar encabezados H1-H6
        text = text.replace(/^######\s+(.*)$/gm, '<h6>$1</h6>');
        text = text.replace(/^#####\s+(.*)$/gm, '<h5>$1</h5>');
        text = text.replace(/^####\s+(.*)$/gm, '<h4>$1</h4>');
        text = text.replace(/^###\s+(.*)$/gm, '<h3>$1</h3>');
        text = text.replace(/^##\s+(.*)$/gm, '<h2>$1</h2>');
        text = text.replace(/^#\s+(.*)$/gm, '<h1>$1</h1>');
        
        return text;
    }

    /**
     * Procesar formato de texto (negrita y cursiva)
     * @param {string} text 
     * @returns {string}
     */
    processTextFormatting(text) {
        // Procesar negrita
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Procesar cursiva (pero no afectar negrita ya procesada)
        text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
        
        return text;
    }

    /**
     * Procesar párrafos
     * @param {string} text 
     * @returns {string}
     */
    processParagraphs(text) {
        // Dividir en líneas y procesar párrafos
        const lines = text.split('\n');
        const processedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Si la línea no está vacía y no es HTML
            if (line && !line.startsWith('<')) {
                processedLines.push(`<p>${line}</p>`);
            } else {
                processedLines.push(line);
            }
        }
        
        return processedLines.join('\n');
    }

    /**
     * HU1: Manejar clic en botón de formato
     */
    handleFormatButtonClick() {
        applyTextFormat(this.editor);
        this.updateFormatButtonText();
        
        // Feedback visual
        this.formatBtn.classList.add('pulse');
        setTimeout(() => {
            this.formatBtn.classList.remove('pulse');
        }, 300);
    }

    /**
     * Actualizar texto del botón de formato según selección
     */
    updateFormatButtonText() {
        const selectedText = this.editor.value.substring(
            this.editor.selectionStart, 
            this.editor.selectionEnd
        );
        
        const formatInfo = getCurrentFormatInfo();
        
        if (selectedText) {
            this.formatBtn.textContent = `Aplicar ${formatInfo.description}`;
        } else {
            this.formatBtn.textContent = `Insertar ${formatInfo.description}`;
        }
    }

    /**
     * Alternar contraste de encabezados (funcionalidad original)
     */
    toggleHeaderContrast() {
        this.isContrasted = !this.isContrasted;
        
        if (this.isContrasted) {
            this.applyHeaderContrast();
            this.contrastBtn.textContent = 'Quitar Contraste';
            this.contrastBtn.classList.add('active');
        } else {
            this.removeHeaderContrast();
            this.contrastBtn.textContent = 'Contrastar Encabezados';
            this.contrastBtn.classList.remove('active');
        }
    }

    /**
     * Aplicar contraste a encabezados
     */
    applyHeaderContrast() {
        const headers = this.preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headers.forEach(header => {
            header.classList.add('contrasted-header');
        });
    }

    /**
     * Remover contraste de encabezados
     */
    removeHeaderContrast() {
        const headers = this.preview.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headers.forEach(header => {
            header.classList.remove('contrasted-header');
        });
    }

    /**
     * Actualizar preview con animación
     * @param {string} htmlContent 
     */
    updatePreviewWithAnimation(htmlContent) {
        this.preview.style.opacity = '0';
        
        setTimeout(() => {
            this.preview.innerHTML = htmlContent;
            this.preview.style.opacity = '1';
            this.preview.classList.add('fade-in');
            
            // Aplicar contraste si está activado
            if (this.isContrasted) {
                this.applyHeaderContrast();
            }
            
            // Feedback visual del botón
            this.generateBtn.classList.add('success');
            setTimeout(() => {
                this.generateBtn.classList.remove('success');
            }, 1000);
            
        }, 150);
    }

    /**
     * Establecer estado de procesamiento
     * @param {boolean} processing 
     */
    setProcessingState(processing) {
        this.isProcessing = processing;
        
        if (processing) {
            this.generateBtn.classList.add('processing');
            this.generateBtn.textContent = 'Procesando...';
        } else {
            this.generateBtn.classList.remove('processing');
            this.generateBtn.textContent = 'Generar Vista Previa';
        }
    }

    /**
     * Mostrar información de procesamiento en consola
     * @param {string} text 
     */
    logProcessingInfo(text) {
        const listInfo = getListInfo(text);
        const codeInfo = getCodeBlockInfo(text);
        
        console.group('📊 Información de Procesamiento');
        console.log('📝 Texto original:', text.length, 'caracteres');
        console.log('📋 Listas detectadas:', listInfo);
        console.log('💻 Código detectado:', codeInfo);
        console.groupEnd();
    }
}

/**
 * Función utilitaria para mostrar información del sistema
 */
function showSystemInfo() {
    console.group('🔧 Información del Sistema');
    console.log('✅ HU1: Botón de formato con función de orden superior');
    console.log('✅ HU2: Listas dinámicas con función de orden superior');
    console.log('✅ HU3: Resaltado de código con funciones de primera clase');
    console.log('📁 Estructura modular implementada correctamente');
    console.groupEnd();
}

/**
 * Inicializar la aplicación cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia de la aplicación
    window.markdownEditor = new MarkdownEditor();
    
    // Mostrar información del sistema
    showSystemInfo();
    
    // Mensaje de bienvenida
    console.log('🎉 ¡Editor Markdown completamente funcional!');
    console.log('🚀 Todas las historias de usuario implementadas');
});

// Manejo de errores global
window.addEventListener('error', (event) => {
    console.error('❌ Error en la aplicación:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise rechazada:', event.reason);
});