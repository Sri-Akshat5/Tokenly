import axios from 'axios';
import { RAG_KNOWLEDGE_CHUNKS, TOKENLY_FAQ_ITEMS } from '../data/tokenlyRagData';



export const MAX_SELECTION_LENGTH = 500;
export const MIN_SELECTION_LENGTH = 3;

const AI_SERVICE_BASE_URL = import.meta.env.VITE_AI_SERVICE_URL || '';


export function sanitizeSelection(text) {
    if (!text || typeof text !== 'string') {
        return { sanitizedQuery: '', isTruncated: false, originalLength: 0 };
    }

    const trimmed = text.trim().replace(/\s+/g, ' ');
    const originalLength = trimmed.length;
    const isTruncated = originalLength > MAX_SELECTION_LENGTH;
    const sanitizedQuery = isTruncated ? trimmed.slice(0, MAX_SELECTION_LENGTH) : trimmed;

    return {
        sanitizedQuery,
        isTruncated,
        originalLength,
    };
}

function getLocalRagFallbackAnswer(query) {
    const lowerQuery = query.toLowerCase();

    // Check FAQ items first
    for (const item of TOKENLY_FAQ_ITEMS) {
        const lowerQ = item.question.toLowerCase();
        if (lowerQuery.includes(lowerQ) || lowerQ.includes(lowerQuery) ||
            query.split(' ').filter(w => w.length > 3).some(w => lowerQ.includes(w.toLowerCase()))) {
            return item.answer;
        }
    }

    // Check Knowledge Chunks
    const matchedChunk = RAG_KNOWLEDGE_CHUNKS.find(chunk =>
        chunk.keywords.some(k => lowerQuery.includes(k.toLowerCase())) ||
        chunk.title.toLowerCase().includes(lowerQuery) ||
        lowerQuery.includes(chunk.category.toLowerCase())
    );

    if (matchedChunk) {
        return `**${matchedChunk.title} (${matchedChunk.category})**\n\n${matchedChunk.summary}\n\n* **Key Details:** ${matchedChunk.content.slice(0, 350)}...`;
    }

    return "Please try again later.";
}

/**
 * Queries the Context AI endpoint via POST /query?q=... or POST http://localhost:8080/query?q=...
 * 
 * @param {string} queryText 
 * @param {object} [options] 
 * @returns {Promise<{ answer: string, success: boolean, source: 'ai_engine' | 'local_rag' | 'fallback', latencyMs: number }>}
 */
export async function queryContextAI(queryText, options = {}) {
    const startTime = performance.now();
    const { sanitizedQuery, isTruncated } = sanitizeSelection(queryText);

    if (!sanitizedQuery || sanitizedQuery.length < MIN_SELECTION_LENGTH) {
        throw new Error("Please select valid text to explain.");
    }

    // Primary endpoint uses relative /query (handled by Vite proxy), with fallback to direct localhost:8080
    const primaryUrl = AI_SERVICE_BASE_URL
        ? `${AI_SERVICE_BASE_URL.replace(/\/$/, '')}/query?q=${encodeURIComponent(sanitizedQuery)}`
        : `/query?q=${encodeURIComponent(sanitizedQuery)}`;

    try {
        let response;
        try {
            response = await axios.post(
                primaryUrl,
                null,
                {
                  
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                    },
                }
            );
        } catch (firstErr) {
            // If relative /query failed (e.g. in non-proxied env), try direct localhost:8080/query
            if (!AI_SERVICE_BASE_URL && !primaryUrl.startsWith('http')) {
                const directUrl = `http://localhost:8080/query?q=${encodeURIComponent(sanitizedQuery)}`;
                response = await axios.post(
                    directUrl,
                    null,
                    {
                        timeout: options.timeout || 8000,
                        headers: {
                            'Accept': 'application/json, text/plain, */*',
                        },
                    }
                );
            } else {
                throw firstErr;
            }
        }

        const latencyMs = Math.round(performance.now() - startTime);

        // Normalize response payload according to { responseCode, message, data }
        let answerText = '';
        if (typeof response.data === 'string') {
            answerText = response.data;
        } else if (response.data && typeof response.data === 'object') {
            answerText = response.data.data ||
                response.data.response ||
                response.data.answer ||
                response.data.result ||
                response.data.text ||
                response.data.message ||
                '';
        }

        if (!answerText || answerText.trim() === '') {
            return {
                answer: "Please try again later.",
                success: false,
                source: 'fallback',
                latencyMs,
            };
        }

        if (isTruncated) {
            answerText = `*(Query truncated to max ${MAX_SELECTION_LENGTH} characters)*\n\n` + answerText;
        }

        return {
            answer: answerText,
            success: true,
            source: 'ai_engine',
            latencyMs,
        };
    } catch (err) {
        const latencyMs = Math.round(performance.now() - startTime);
        console.warn(`[Tokenly Context AI] AI service request failed:`, err.message);

        // Try local RAG fallback first
        const fallbackText = getLocalRagFallbackAnswer(sanitizedQuery);

        return {
            answer: fallbackText || "Please try again later.",
            success: true,
            source: 'local_rag',
            latencyMs,
        };
    }
}

export default {
    queryContextAI,
    sanitizeSelection,
    MAX_SELECTION_LENGTH,
    MIN_SELECTION_LENGTH,
};
