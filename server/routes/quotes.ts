import express from 'express';
import { z } from 'zod';
import { insertQuoteSchema } from '../../shared/schema';
import { storage } from '../storage';
import { isAuthenticated } from '../auth/local-auth';

const router = express.Router();

// Create a new quote
router.post('/', isAuthenticated, async (req, res) => {
  try {
    // Validate the quote data
    const validatedData = insertQuoteSchema.parse(req.body);
    
    // Get user ID from session
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    // Create the quote with user ID
    const quote = await storage.createQuote({
      ...validatedData,
      userId
    });
    
    res.status(201).json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// Get all quotes for the authenticated user
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const quotes = await storage.getUserQuotes(userId);
    res.json(quotes);
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Get a specific quote by ID
router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      return res.status(400).json({ error: 'Invalid quote ID' });
    }
    
    const quote = await storage.getQuoteById(quoteId);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    // Check if the quote belongs to the authenticated user
    const userId = req.user?.id;
    if (quote.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Get a quote by reference number
router.get('/reference/:reference', async (req, res) => {
  try {
    const reference = req.params.reference;
    const quote = await storage.getQuoteByReference(reference);
    
    if (!quote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    res.json(quote);
  } catch (error) {
    console.error('Error fetching quote by reference:', error);
    res.status(500).json({ error: 'Failed to fetch quote' });
  }
});

// Update a quote's status
router.patch('/:id/status', isAuthenticated, async (req, res) => {
  try {
    const quoteId = parseInt(req.params.id, 10);
    if (isNaN(quoteId)) {
      return res.status(400).json({ error: 'Invalid quote ID' });
    }
    
    const { status } = req.body;
    if (!status || typeof status !== 'string') {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    
    // Check if the quote exists and belongs to the user
    const existingQuote = await storage.getQuoteById(quoteId);
    if (!existingQuote) {
      return res.status(404).json({ error: 'Quote not found' });
    }
    
    const userId = req.user?.id;
    if (existingQuote.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    const updatedQuote = await storage.updateQuoteStatus(quoteId, status);
    res.json(updatedQuote);
  } catch (error) {
    console.error('Error updating quote status:', error);
    res.status(500).json({ error: 'Failed to update quote status' });
  }
});

export default router;