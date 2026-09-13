/**
 * Motor de Búsqueda Inteligente para Alta Relojería L'gant
 * 
 * Características:
 * - Independiente del orden de las palabras ("reloj rosado" === "rosado reloj")
 * - Normalización de tildes y diacríticos ("automático" === "automatico")
 * - Variaciones de plurales y singulares en español ("relojes" === "reloj", "rosados" === "rosado")
 * - Búsqueda exhaustiva multicampo (Nombre, Marca, Categorías, Atributos, SKU/Modelo, Descripción)
 * - Tolerancia a errores tipográficos leves (Levenshtein distance <= 1 para palabras de 5+ letras)
 * - Puntuación de relevancia para mostrar primero los resultados más exactos
 */

export function normalizeText(str) {
  if (!str) return '';
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Quita acentos / tildes
    .trim();
}

export function getWordVariants(word) {
  const norm = normalizeText(word);
  if (!norm) return [];
  const variants = new Set([norm]);

  // Si termina en 'es' (ej. relojes -> reloj)
  if (norm.length > 4 && norm.endsWith('es')) {
    variants.add(norm.slice(0, -2));
  }
  // Si termina en 's' (ej. rosados -> rosado, correas -> correa)
  if (norm.length > 3 && norm.endsWith('s')) {
    variants.add(norm.slice(0, -1));
  }
  // Variación plural inversa (ej. busca 'reloj' -> incluye 'relojes')
  if (!norm.endsWith('s')) {
    variants.add(norm + 's');
    if (norm.endsWith('j') || norm.endsWith('l') || norm.endsWith('r') || norm.endsWith('n') || norm.endsWith('d')) {
      variants.add(norm + 'es');
    }
  }

  return Array.from(variants);
}

export function getProductCorpus(product) {
  const title = normalizeText(product.nombre || product.name || '');
  const brand = normalizeText(product.marca || product.brand || '');
  const description = normalizeText(product.descripcion || product.description || '');
  const category = normalizeText(product.categoria || product.category || '');
  const model = normalizeText(product.codigoModelo || product.sku || product.modelo || product.id || '');
  
  const categoriesArr = Array.isArray(product.categorias) 
    ? product.categorias.map(normalizeText) 
    : [];

  const attributesArr = [];
  if (Array.isArray(product.atributos)) {
    product.atributos.forEach(attr => {
      if (attr) {
        if (attr.nombre || attr.Nombre) attributesArr.push(normalizeText(attr.nombre || attr.Nombre));
        if (attr.valor || attr.Valor) attributesArr.push(normalizeText(attr.valor || attr.Valor));
      }
    });
  }

  const allText = [
    title,
    brand,
    model,
    category,
    ...categoriesArr,
    ...attributesArr,
    description
  ].filter(Boolean).join(' ');

  return {
    title,
    brand,
    model,
    category,
    allText
  };
}

function isFuzzyMatch(word1, word2) {
  if (word1 === word2) return true;
  if (word1.length < 5 || word2.length < 5) return false;
  if (Math.abs(word1.length - word2.length) > 1) return false;

  let diff = 0;
  let i = 0, j = 0;
  while (i < word1.length && j < word2.length) {
    if (word1[i] !== word2[j]) {
      diff++;
      if (diff > 1) return false;
      if (word1.length > word2.length) i++;
      else if (word2.length > word1.length) j++;
      else { i++; j++; }
    } else {
      i++; j++;
    }
  }
  return true;
}

/**
 * Evalúa si un producto coincide con una consulta de búsqueda inteligente.
 * @param {Object} product - El producto a evaluar.
 * @param {string} query - La consulta de búsqueda introducida por el usuario.
 * @returns {{ matches: boolean, score: number }}
 */
export function matchProductSmart(product, query) {
  if (!query || !query.trim()) {
    return { matches: true, score: 0 };
  }

  const corpus = getProductCorpus(product);
  const queryTokens = normalizeText(query).split(/\s+/).filter(Boolean);

  if (queryTokens.length === 0) {
    return { matches: true, score: 0 };
  }

  const corpusWords = corpus.allText.split(/\s+/).filter(Boolean);
  let totalScore = 0;

  // Cada palabra de la consulta debe coincidir en el producto (independiente del orden)
  for (const token of queryTokens) {
    const variants = getWordVariants(token);
    let tokenMatched = false;
    let tokenScore = 0;

    // 1. Coincidencia en título
    if (variants.some(v => corpus.title.includes(v))) {
      tokenMatched = true;
      tokenScore = Math.max(tokenScore, 100);
      if (corpus.title.split(/\s+/).some(w => variants.includes(w))) {
        tokenScore += 50;
      }
    }

    // 2. Coincidencia en marca o modelo
    if (variants.some(v => corpus.brand.includes(v) || corpus.model.includes(v))) {
      tokenMatched = true;
      tokenScore = Math.max(tokenScore, 80);
    }

    // 3. Coincidencia en categoría
    if (variants.some(v => corpus.category.includes(v))) {
      tokenMatched = true;
      tokenScore = Math.max(tokenScore, 50);
    }

    // 4. Coincidencia en atributos o descripción
    if (!tokenMatched && variants.some(v => corpus.allText.includes(v))) {
      tokenMatched = true;
      tokenScore = Math.max(tokenScore, 30);
    }

    // 5. Coincidencia difusa (tolerancia a pequeños typos)
    if (!tokenMatched) {
      const fuzzyMatch = corpusWords.some(w => variants.some(v => isFuzzyMatch(v, w)));
      if (fuzzyMatch) {
        tokenMatched = true;
        tokenScore = Math.max(tokenScore, 20);
      }
    }

    if (!tokenMatched) {
      return { matches: false, score: 0 };
    }

    totalScore += tokenScore;
  }

  // Bonus si la frase entera coincide contigua en el título
  const normalizedQuery = normalizeText(query);
  if (corpus.title.includes(normalizedQuery)) {
    totalScore += 200;
  }

  return { matches: true, score: totalScore };
}
