import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

// Initialize the Google Gen AI SDK
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Generates a vector embedding for a given text.
 * @param {string} text - The input text (e.g. product description).
 * @returns {Promise<Array<number>>} - The numerical vector array.
 */
export const generateEmbedding = async (text) => {
  try {
    const response = await ai.models.embedContent({
      model: "text-embedding-004",
      contents: text,
    });
    return response.embeddings[0].values;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
};

/**
 * Chats with the Gemini RAG model by injecting relevant products as context.
 * @param {string} query - The user's query.
 * @param {Array} similarProducts - Array of product objects from DB retrieved via Cosine Similarity.
 * @returns {Promise<string>} - The LLM's intelligent response.
 */
export const chatWithRAG = async (query, similarProducts) => {
  try {
    // Construct the context string from retrieved products
    const contextLines = similarProducts.map(
      (p, index) =>
        `[Product ${index + 1}]: Title: ${p.title}. Category: ${p.category}. Price: $${p.price}. Description: ${p.description}`
    );
    const contextText = contextLines.join("\n\n");

    const prompt = `You are a helpful and persuasive AI Shopping Assistant for 'Shop-Smart'. 
A customer is asking a question. Please use the following catalog products to craft a specific, accurate, and formatted response. 
Focus ONLY on the products provided in the context below. If none of the products seem relevant, politely state that we don't carry matching items right now.
Keep your response concise and structured nicely using markdown. Do not hallucinate products.

AVAILABLE PRODUCTS CONTEXT:
${contextText}

CUSTOMER QUERY:
${query}

YOUR HELPFUL RESPONSE:`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error communicating with Gemini RAG:", error);
    throw error;
  }
};
