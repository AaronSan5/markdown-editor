/**
 * blocks.js - Funciones para resaltado de bloques de código
 * HU3: Resaltado Dinámico de Código en el Preview
 */

class CodeBlockProcessor {
    constructor() {
        this.codeBlockRegex = /```([\s\S]*?)```/g;
        this.inlineCodeRegex = /`([^`]+)`/g;
        
        // Palabras clave para resaltado básico
        this.keywords = [
            'function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 
            'return', 'class', 'import', 'export', 'from', 'default', 'async', 
            'await', 'try', 'catch', 'finally', 'new', 'this', 'super', 'extends'
        ];
        
        this.stringPatterns = [
            /'[^']*'/g,  // Strings con comillas simples
            /"[^"]*"/g,  // Strings con comillas dobles
            /`[^`]*`/g   // Template literals
        ];
        
        this.commentPatterns = [
            /\/\/.*$/gm,     // Comentarios de línea
            /\/\*[\s\S]*?\*\//g  // Comentarios de bloque
        ];
        
        this.numberPattern = /\b\d+\.?\d*\b/g;
        
        this.functionPattern = /\b(\w+)\s*\(/g;
    }

    /**
     * Función de primera clase para procesar bloques de código
     * Esta función encapsula toda la lógica de transformación
     */
    processCodeBlocks = (text) => {
        return text.replace(this.codeBlockRegex, (match, codeContent) => {
            // Aplicar resaltado de sintaxis al contenido del código
            const highlightedCode = this.applySyntaxHighlighting(codeContent.trim());
            
            // Retornar estructura HTML con clases para CSS
            return `<pre><code>${highlightedCode}</code></pre>`;
        });
    }

    /**
     * Función de primera clase para procesar código inline
     */
    processInlineCode = (text) => {
        return text.replace(this.inlineCodeRegex, (match, codeContent) => {
            return `<code class="inline-code">${codeContent}</code>`;
        });
    }

    /**
     * Función de primera clase principal que combina ambos procesadores
     */
    processAllCodeElements = (text) => {
        // Primero procesar bloques de código
        let processedText = this.processCodeBlocks(text);
        
        // Luego procesar código inline (fuera de los bloques ya procesados)
        processedText = this.processInlineCodeOutsideBlocks(processedText);
        
        return processedText;
    }

    /**
     * Aplicar resaltado de sintaxis básico
     * @param {string} code - Código a resaltar
     * @returns {string} - Código con etiquetas de resaltado
     */
    applySyntaxHighlighting(code) {
        let highlightedCode = code;
        
        // Escapar caracteres HTML primero
        highlightedCode = this.escapeHtml(highlightedCode);
        
        // Resaltar comentarios primero (para que no interfieran con otras reglas)
        highlightedCode = this.highlightComments(highlightedCode);
        
        // Resaltar strings
        highlightedCode = this.highlightStrings(highlightedCode);
        
        // Resaltar números
        highlightedCode = this.highlightNumbers(highlightedCode);
        
        // Resaltar palabras clave
        highlightedCode = this.highlightKeywords(highlightedCode);
        
        // Resaltar funciones
        highlightedCode = this.highlightFunctions(highlightedCode);
        
        return highlightedCode;
    }

    /**
     * Escapar caracteres HTML
     * @param {string} text 
     * @returns {string}
     */
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Resaltar comentarios
     * @param {string} code 
     * @returns {string}
     */
    highlightComments(code) {
        // Comentarios de línea
        code = code.replace(/\/\/.*$/gm, (match) => {
            return `<span class="highlight-comment">${match}</span>`;
        });
        
        // Comentarios de bloque
        code = code.replace(/\/\*[\s\S]*?\*\//g, (match) => {
            return `<span class="highlight-comment">${match}</span>`;
        });
        
        return code;
    }

    /**
     * Resaltar strings
     * @param {string} code 
     * @returns {string}
     */
    highlightStrings(code) {
        // Strings con comillas simples
        code = code.replace(/'([^']*)'/g, (match) => {
            return `<span class="highlight-string">${match}</span>`;
        });
        
        // Strings con comillas dobles
        code = code.replace(/"([^"]*)"/g, (match) => {
            return `<span class="highlight-string">${match}</span>`;
        });
        
        // Template literals
        code = code.replace(/`([^`]*)`/g, (match) => {
            return `<span class="highlight-string">${match}</span>`;
        });
        
        return code;
    }

    /**
     * Resaltar números
     * @param {string} code 
     * @returns {string}
     */
    highlightNumbers(code) {
        return code.replace(/\b\d+\.?\d*\b/g, (match) => {
            return `<span class="highlight-number">${match}</span>`;
        });
    }

    /**
     * Resaltar palabras clave
     * @param {string} code 
     * @returns {string}
     */
    highlightKeywords(code) {
        this.keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            code = code.replace(regex, (match) => {
                return `<span class="highlight-keyword">${match}</span>`;
            });
        });
        
        return code;
    }

    /**
     * Resaltar nombres de funciones
     * @param {string} code 
     * @returns {string}
     */
    highlightFunctions(code) {
        return code.replace(/\b(\w+)\s*\(/g, (match, functionName) => {
            return `<span class="highlight-function">${functionName}</span>(`;
        });
    }

    /**
     * Procesar código inline fuera de bloques de código
     * @param {string} text 
     * @returns {string}
     */
    processInlineCodeOutsideBlocks(text) {
        // Dividir el texto en partes: dentro y fuera de bloques <pre><code>
        const parts = text.split(/(<pre><code>[\s\S]*?<\/code><\/pre>)/);
        
        return parts.map((part, index) => {
            // Si el índice es impar, es un bloque de código, no procesarlo
            if (index % 2 === 1) {
                return part;
            }
            
            // Si es par, procesar código inline
            return part.replace(this.inlineCodeRegex, (match, codeContent) => {
                return `<code class="inline-code">${this.escapeHtml(codeContent)}</code>`;
            });
        }).join('');
    }

    /**
     * Detectar si el texto contiene bloques de código
     * @param {string} text 
     * @returns {Object}
     */
    detectCodeBlocks(text) {
        const codeBlocks = text.match(this.codeBlockRegex) || [];
        const inlineCode = text.match(this.inlineCodeRegex) || [];
        
        return {
            hasCodeBlocks: codeBlocks.length > 0,
            hasInlineCode: inlineCode.length > 0,
            codeBlockCount: codeBlocks.length,
            inlineCodeCount: inlineCode.length,
            totalCodeElements: codeBlocks.length + inlineCode.length
        };
    }

    /**
     * Función utilitaria para obtener estadísticas del código
     * @param {string} text 
     * @returns {Object}
     */
    getCodeStatistics(text) {
        const detection = this.detectCodeBlocks(text);
        const codeBlocks = text.match(this.codeBlockRegex) || [];
        
        const languages = new Set();
        const totalLines = codeBlocks.reduce((total, block) => {
            const lines = block.split('\n').length - 2; // Restar las líneas de ```
            return total + lines;
        }, 0);

        return {
            ...detection,
            totalCodeLines: totalLines,
            detectedLanguages: Array.from(languages),
            averageLinesPerBlock: detection.codeBlockCount > 0 ? 
                Math.round(totalLines / detection.codeBlockCount) : 0
        };
    }

    /**
     * Función para limpiar código antes del procesamiento
     * @param {string} code 
     * @returns {string}
     */
    cleanCode(code) {
        return code
            .replace(/^\n+/, '') // Remover saltos de línea al inicio
            .replace(/\n+$/, '') // Remover saltos de línea al final
            .replace(/\t/g, '    '); // Convertir tabs a espacios
    }
}

// Crear instancia global del procesador de bloques de código
const codeBlockProcessor = new CodeBlockProcessor();

/**
 * Función principal para procesar bloques de código usando función de primera clase
 * @param {string} text - Texto del editor
 * @returns {string} - Texto con bloques de código procesados
 */
function processCodeBlocksWithFirstClassFunction(text) {
    return codeBlockProcessor.processAllCodeElements(text);
}

/**
 * Obtener información sobre bloques de código en el texto
 * @param {string} text 
 * @returns {Object}
 */
function getCodeBlockInfo(text) {
    return codeBlockProcessor.getCodeStatistics(text);
}

/**
 * Función específica para resaltar código (función de primera clase reutilizable)
 * @param {string} code 
 * @returns {string}
 */
const highlightCodeSyntax = (code) => {
    return codeBlockProcessor.applySyntaxHighlighting(code);
};