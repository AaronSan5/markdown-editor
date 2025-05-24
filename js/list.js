/**
 * lists.js - Funciones para manejo de listas dinámicas
 * HU2: Generación de Listas Numéricas Dinámicamente
 */

class ListProcessor {
    constructor() {
        this.orderedListRegex = /^(\d+)\.\s+(.+)$/;
        this.unorderedListRegex = /^[\s]*[-*+]\s+(.+)$/;
    }

    /**
     * Función de orden superior para procesar listas con callback
     * @param {string} text - Texto completo del editor
     * @param {Function} itemCallback - Callback para procesar cada item de lista
     * @returns {string} - Texto con listas convertidas a HTML
     */
    processListsWithCallback(text, itemCallback) {
        const lines = text.split('\n');
        const processedLines = [];
        let currentOrderedList = [];
        let currentUnorderedList = [];
        let inOrderedList = false;
        let inUnorderedList = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Detectar listas ordenadas
            if (this.isOrderedListItem(line)) {
                if (!inOrderedList) {
                    // Cerrar lista no ordenada si estaba abierta
                    if (inUnorderedList) {
                        processedLines.push(this.closeUnorderedList(currentUnorderedList, itemCallback));
                        currentUnorderedList = [];
                        inUnorderedList = false;
                    }
                    inOrderedList = true;
                }
                currentOrderedList.push(line);
            }
            // Detectar listas no ordenadas
            else if (this.isUnorderedListItem(line)) {
                if (!inUnorderedList) {
                    // Cerrar lista ordenada si estaba abierta
                    if (inOrderedList) {
                        processedLines.push(this.closeOrderedList(currentOrderedList, itemCallback));
                        currentOrderedList = [];
                        inOrderedList = false;
                    }
                    inUnorderedList = true;
                }
                currentUnorderedList.push(line);
            }
            // Línea que no es parte de lista
            else {
                // Cerrar listas abiertas
                if (inOrderedList) {
                    processedLines.push(this.closeOrderedList(currentOrderedList, itemCallback));
                    currentOrderedList = [];
                    inOrderedList = false;
                }
                if (inUnorderedList) {
                    processedLines.push(this.closeUnorderedList(currentUnorderedList, itemCallback));
                    currentUnorderedList = [];
                    inUnorderedList = false;
                }
                
                // Agregar línea normal
                if (line.length > 0) {
                    processedLines.push(line);
                } else {
                    processedLines.push('');
                }
            }
        }

        // Cerrar listas al final si están abiertas
        if (inOrderedList) {
            processedLines.push(this.closeOrderedList(currentOrderedList, itemCallback));
        }
        if (inUnorderedList) {
            processedLines.push(this.closeUnorderedList(currentUnorderedList, itemCallback));
        }

        return processedLines.join('\n');
    }

    /**
     * Verificar si una línea es un item de lista ordenada
     * @param {string} line 
     * @returns {boolean}
     */
    isOrderedListItem(line) {
        return this.orderedListRegex.test(line);
    }

    /**
     * Verificar si una línea es un item de lista no ordenada
     * @param {string} line 
     * @returns {boolean}
     */
    isUnorderedListItem(line) {
        return this.unorderedListRegex.test(line);
    }

    /**
     * Callback para procesar items de lista ordenada
     * @param {string} item - Item de la lista
     * @returns {string} - Item convertido a HTML
     */
    processOrderedListItem(item) {
        const match = item.match(this.orderedListRegex);
        if (match) {
            const content = match[2];
            return `<li>${content}</li>`;
        }
        return item;
    }

    /**
     * Callback para procesar items de lista no ordenada
     * @param {string} item - Item de la lista
     * @returns {string} - Item convertido a HTML
     */
    processUnorderedListItem(item) {
        const match = item.match(this.unorderedListRegex);
        if (match) {
            const content = match[1];
            return `<li>${content}</li>`;
        }
        return item;
    }

    /**
     * Cerrar y convertir lista ordenada usando callback
     * @param {Array} listItems 
     * @param {Function} itemCallback 
     * @returns {string}
     */
    closeOrderedList(listItems, itemCallback) {
        if (listItems.length === 0) return '';
        
        const processedItems = listItems.map(item => 
            itemCallback(item, 'ordered')
        );
        
        return `<ol>\n${processedItems.join('\n')}\n</ol>`;
    }

    /**
     * Cerrar y convertir lista no ordenada usando callback
     * @param {Array} listItems 
     * @param {Function} itemCallback 
     * @returns {string}
     */
    closeUnorderedList(listItems, itemCallback) {
        if (listItems.length === 0) return '';
        
        const processedItems = listItems.map(item => 
            itemCallback(item, 'unordered')
        );
        
        return `<ul>\n${processedItems.join('\n')}\n</ul>`;
    }

    /**
     * Función de orden superior principal que aplica el callback apropiado
     * @param {string} item - Item de lista
     * @param {string} listType - Tipo de lista ('ordered' o 'unordered')
     * @returns {string} - Item procesado
     */
    processListItemCallback(item, listType) {
        if (listType === 'ordered') {
            return this.processOrderedListItem(item);
        } else if (listType === 'unordered') {
            return this.processUnorderedListItem(item);
        }
        return item;
    }

    /**
     * Detectar automáticamente si el texto contiene listas
     * @param {string} text 
     * @returns {Object}
     */
    detectLists(text) {
        const lines = text.split('\n');
        let orderedCount = 0;
        let unorderedCount = 0;

        lines.forEach(line => {
            if (this.isOrderedListItem(line.trim())) {
                orderedCount++;
            } else if (this.isUnorderedListItem(line.trim())) {
                unorderedCount++;
            }
        });

        return {
            hasOrderedLists: orderedCount > 0,
            hasUnorderedLists: unorderedCount > 0,
            orderedCount,
            unorderedCount,
            totalLists: orderedCount + unorderedCount
        };
    }

    /**
     * Validar numeración secuencial en listas ordenadas
     * @param {string} text 
     * @returns {Object}
     */
    validateOrderedListSequence(text) {
        const lines = text.split('\n');
        const orderedItems = [];
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (this.isOrderedListItem(trimmed)) {
                const match = trimmed.match(this.orderedListRegex);
                if (match) {
                    orderedItems.push(parseInt(match[1]));
                }
            }
        });

        const isSequential = orderedItems.every((num, index) => 
            index === 0 || num === orderedItems[index - 1] + 1
        );

        return {
            isValid: isSequential,
            numbers: orderedItems,
            expectedSequence: orderedItems.map((_, index) => index + 1)
        };
    }
}

// Crear instancia global del procesador de listas
const listProcessor = new ListProcessor();

/**
 * Función principal para procesar listas usando función de orden superior
 * @param {string} text - Texto del editor
 * @returns {string} - Texto con listas convertidas
 */
function processListsWithHigherOrderFunction(text) {
    return listProcessor.processListsWithCallback(
        text,
        (item, listType) => listProcessor.processListItemCallback(item, listType)
    );
}

/**
 * Detectar y retornar información sobre listas en el texto
 * @param {string} text 
 * @returns {Object}
 */
function getListInfo(text) {
    const detection = listProcessor.detectLists(text);
    const validation = listProcessor.validateOrderedListSequence(text);
    
    return {
        ...detection,
        sequenceValidation: validation
    };
}