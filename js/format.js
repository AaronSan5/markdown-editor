/**
 * format.js - Funciones para formato de texto
 * HU1: Botón para Alternar el Formato de Texto
 */

class TextFormatter {
    constructor() {
        this.currentFormat = 'bold'; // Alterna entre 'bold' e 'italic'
    }

    /**
     * Función de orden superior que recibe un callback para aplicar formato
     * @param {Function} formatCallback - Función que define cómo aplicar el formato
     * @param {HTMLTextAreaElement} editor - El elemento textarea del editor
     */
    applyFormatWithCallback(formatCallback, editor) {
        const selectedText = this.getSelectedText(editor);
        const selection = this.getSelectionInfo(editor);
        
        if (selectedText) {
            const formattedText = formatCallback(selectedText, this.currentFormat);
            this.replaceSelectedText(editor, formattedText, selection);
            
            // Alternar formato para la próxima aplicación
            this.toggleFormat();
        } else {
            // Si no hay texto seleccionado, mostrar mensaje
            this.showFormatMessage(editor);
        }
    }

    /**
     * Callback para aplicar formato negrita
     * @param {string} text - Texto a formatear
     * @returns {string} - Texto formateado
     */
    applyBoldFormat(text) {
        // Verificar si ya tiene formato negrita
        if (text.startsWith('**') && text.endsWith('**')) {
            // Quitar formato negrita
            return text.slice(2, -2);
        }
        // Aplicar formato negrita
        return `**${text}**`;
    }

    /**
     * Callback para aplicar formato cursiva
     * @param {string} text - Texto a formatear
     * @returns {string} - Texto formateado
     */
    applyItalicFormat(text) {
        // Verificar si ya tiene formato cursiva (pero no negrita)
        if (text.startsWith('*') && text.endsWith('*') && !text.startsWith('**')) {
            // Quitar formato cursiva
            return text.slice(1, -1);
        }
        // Aplicar formato cursiva
        return `*${text}*`;
    }

    /**
     * Función de orden superior principal que ejecuta el callback apropiado
     * @param {string} text - Texto a formatear
     * @param {string} formatType - Tipo de formato ('bold' o 'italic')
     * @returns {string} - Texto formateado
     */
    formatTextCallback(text, formatType) {
        if (formatType === 'bold') {
            return this.applyBoldFormat(text);
        } else if (formatType === 'italic') {
            return this.applyItalicFormat(text);
        }
        return text;
    }

    /**
     * Obtener el texto seleccionado en el editor
     * @param {HTMLTextAreaElement} editor 
     * @returns {string}
     */
    getSelectedText(editor) {
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        return editor.value.substring(start, end);
    }

    /**
     * Obtener información de la selección
     * @param {HTMLTextAreaElement} editor 
     * @returns {Object}
     */
    getSelectionInfo(editor) {
        return {
            start: editor.selectionStart,
            end: editor.selectionEnd
        };
    }

    /**
     * Reemplazar el texto seleccionado
     * @param {HTMLTextAreaElement} editor 
     * @param {string} newText 
     * @param {Object} selection 
     */
    replaceSelectedText(editor, newText, selection) {
        const { start, end } = selection;
        const beforeText = editor.value.substring(0, start);
        const afterText = editor.value.substring(end);
        
        editor.value = beforeText + newText + afterText;
        
        // Mantener el cursor en la posición correcta
        const newCursorPos = start + newText.length;
        editor.setSelectionRange(newCursorPos, newCursorPos);
        editor.focus();
    }

    /**
     * Alternar entre formatos
     */
    toggleFormat() {
        this.currentFormat = this.currentFormat === 'bold' ? 'italic' : 'bold';
    }

    /**
     * Obtener el formato actual
     * @returns {string}
     */
    getCurrentFormat() {
        return this.currentFormat;
    }

    /**
     * Mostrar mensaje cuando no hay texto seleccionado
     * @param {HTMLTextAreaElement} editor 
     */
    showFormatMessage(editor) {
        const cursorPos = editor.selectionStart;
        const beforeText = editor.value.substring(0, cursorPos);
        const afterText = editor.value.substring(cursorPos);
        
        const formatExample = this.currentFormat === 'bold' ? 
            '**texto en negrita**' : '*texto en cursiva*';
        
        editor.value = beforeText + formatExample + afterText;
        
        // Seleccionar el texto de ejemplo
        const startPos = cursorPos + (this.currentFormat === 'bold' ? 2 : 1);
        const endPos = startPos + (this.currentFormat === 'bold' ? 'texto en negrita'.length : 'texto en cursiva'.length);
        
        editor.focus();
        editor.setSelectionRange(startPos, endPos);
    }

    /**
     * Obtener descripción del formato actual
     * @returns {string}
     */
    getFormatDescription() {
        return this.currentFormat === 'bold' ? 'Negrita (**texto**)' : 'Cursiva (*texto*)';
    }
}

// Crear instancia global del formateador
const textFormatter = new TextFormatter();

/**
 * Función principal para aplicar formato usando función de orden superior
 * @param {HTMLTextAreaElement} editor - El editor donde aplicar el formato
 */
function applyTextFormat(editor) {
    // Usar la función de orden superior con callback
    textFormatter.applyFormatWithCallback(
        (text, formatType) => textFormatter.formatTextCallback(text, formatType),
        editor
    );
}

/**
 * Obtener información del formato actual
 * @returns {Object}
 */
function getCurrentFormatInfo() {
    return {
        type: textFormatter.getCurrentFormat(),
        description: textFormatter.getFormatDescription()
    };
}