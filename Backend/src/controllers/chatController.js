import { Product } from '../models/product.js'
import { generateEmbedding, chatWithRAG } from "../services/aiService.js";

// Helper for pure cosine similarity math (used since we are doing in-memory search instead of Atlas indexing)
const cosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0.0;
  let normA = 0.0;
  let normB = 0.0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const askAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: "Message is required." });
    }

    // 1. Generate an embedding for the user's question
    const queryVector = await generateEmbedding(message);

    // 2. Retrieve all products that have an embedding mathematically mapped
    // (For thousands of products, this should be done natively in MongoDB Atlas Vector Search)
    const allProducts = await Product.find({ embedding: { $not: { $size: 0 } } });

    // 3. Compute cosine similarity between the user's query and each product
    let scoredProducts = allProducts.map((prod) => {
      const score = cosineSimilarity(queryVector, prod.embedding);
      return { product: prod, score };
    });

    // 4. Sort to get top 5 best matches
    scoredProducts.sort((a, b) => b.score - a.score);
    const topMatches = scoredProducts.slice(0, 5).map((sp) => sp.product);

    // 5. Send matches and query to Gemini for Conversational RAG response
    const answer = await chatWithRAG(message, topMatches);

    res.status(200).json({
      success: true,
      answer,
      recommendedProducts: topMatches.map(p => ({
        id: p._id,
        title: p.title,
        price: p.price,
        image: p.images && p.images.length > 0 ? p.images[0] : null
      }))
    });
  } catch (error) {
    console.error("Assistant Error:", error);
    res.status(500).json({ success: false, error: "Failed to generate AI response." });
  }
};

/**
 * Utility route designed to be run once to embed all existing database products.
 * Should be run cautiously in production.
 */
export const syncEmbeddings = async (req, res) => {
  try {
    const productsToProcess = await Product.find({
      $or: [{ embedding: { $exists: false } }, { embedding: { $size: 0 } }]
    });

    let embeddedCount = 0;
    for (const product of productsToProcess) {
      const combinedText = `Product: ${product.title}. Category: ${product.category}. Description: ${product.description}. Price is $${product.price}`;
      const vector = await generateEmbedding(combinedText);
      product.embedding = vector;
      await product.save();
      embeddedCount++;
      // Sleep slightly to respect rate limits if needed
      await new Promise((r) => setTimeout(r, 500));
    }

    res.status(200).json({ success: true, message: `Successfully synced ${embeddedCount} products.` });
  } catch (error) {
    console.error("Sync Error:", error);
    res.status(500).json({ success: false, error: "Failed to sync database embeddings." });
  }
};
