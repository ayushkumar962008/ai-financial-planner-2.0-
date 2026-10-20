import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { db } from './db.js';
import { askGeminiAdvisor } from './gemini.js';

// Load .env if present
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY);
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasKey,
    activeModel: 'gemini-3.8-flash',
  });
});

// --- PORTFOLIO & CASHFLOW ---
app.get('/api/portfolio', (req, res) => {
  res.json(db.getPortfolio());
});

app.put('/api/portfolio', (req, res) => {
  const updated = db.updatePortfolio(req.body);
  res.json(updated);
});

app.post('/api/portfolio/execute-move', (req, res) => {
  const result = db.executeNextMove();
  res.json(result);
});

// --- GOALS CRUD ---
app.get('/api/goals', (req, res) => {
  res.json(db.getGoals());
});

app.post('/api/goals', (req, res) => {
  const newGoal = {
    id: req.body.id || `goal-${Date.now()}`,
    title: req.body.title,
    icon: req.body.icon || '🎯',
    targetAmount: Number(req.body.targetAmount),
    currentAmount: Number(req.body.currentAmount || 0),
    monthlyRequired: Number(req.body.monthlyRequired || 100),
    status: req.body.status || 'on_track',
    statusLabel: req.body.statusLabel || 'Auto-contribution active',
    horizon: req.body.horizon || 'medium',
    priority: req.body.priority || 'medium',
    targetYear: Number(req.body.targetYear || 2028),
    targetDateLabel: req.body.targetDateLabel || `Target ${req.body.targetYear || 2028}`,
    note: req.body.note || '',
    accountType: req.body.accountType || 'High-Yield & Index Allocations',
  };
  const created = db.addGoal(newGoal);
  res.status(201).json(created);
});

app.put('/api/goals/:id', (req, res) => {
  const updated = db.updateGoal(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Goal not found' });
  }
  res.json(updated);
});

app.delete('/api/goals/:id', (req, res) => {
  const deleted = db.deleteGoal(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Goal not found' });
  }
  res.json({ success: true, id: req.params.id });
});

// --- ROADMAP ---
app.get('/api/roadmap', (req, res) => {
  res.json(db.getRoadmap());
});

app.put('/api/roadmap/:id', (req, res) => {
  const updated = db.updateRoadmapMilestone(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Milestone not found' });
  }
  res.json(updated);
});

app.post('/api/roadmap/apply-option', (req, res) => {
  const option = req.body.option;
  if (option !== 'A' && option !== 'B') {
    return res.status(400).json({ error: 'Invalid option. Must be A or B' });
  }
  const result = db.applyRoadmapOption(option);
  res.json(result);
});

// --- SCENARIO SIMULATOR ---
app.get('/api/scenarios', (req, res) => {
  res.json(db.getScenarios());
});

app.put('/api/scenarios', (req, res) => {
  const updated = db.updateScenarios(req.body);
  res.json(updated);
});

// --- AUTO TRANSFERS ---
app.get('/api/transfers', (req, res) => {
  res.json(db.getTransfers());
});

app.post('/api/transfers', (req, res) => {
  const newTransfer = {
    id: req.body.id || `t-${Date.now()}`,
    name: req.body.name,
    subtitle: req.body.subtitle || 'Automated Transfer',
    amount: Number(req.body.amount),
    status: req.body.status || 'Settled',
    icon: req.body.icon || '💸',
    date: req.body.date || 'Today',
  };
  const created = db.addTransfer(newTransfer);
  res.status(201).json(created);
});

// --- LUMO AI ADVISOR (GEMINI API) ---
app.get('/api/chat/history', (req, res) => {
  res.json(db.getChatHistory());
});

app.post('/api/ai/advisor', async (req, res) => {
  const query = req.body.query || req.body.message || '';
  if (!query.trim()) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const clientApiKey =
    req.body.apiKey || (req.headers['x-gemini-api-key'] as string) || undefined;

  // Record user query in chat history
  db.addChatMessage({
    id: `usr-${Date.now()}`,
    sender: 'user',
    text: query,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });

  try {
    const advisorResponse = await askGeminiAdvisor(query, clientApiKey);

    // Record AI reply in chat history
    db.addChatMessage({
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: advisorResponse.reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      tags: advisorResponse.tags,
      metrics: advisorResponse.metrics,
    });

    res.json(advisorResponse);
  } catch (err: any) {
    console.error('Advisor error:', err);
    res.status(500).json({ error: 'Failed to generate advisory response', details: err?.message });
  }
});

// Configure or update Gemini API key in .env
app.post('/api/ai/set-key', (req, res) => {
  const key = (req.body.apiKey || '').trim();
  if (key) {
    process.env.GEMINI_API_KEY = key;
    try {
      const envPath = path.join(process.cwd(), '.env');
      let envContent = '';
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
      }
      if (envContent.includes('GEMINI_API_KEY=')) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*(\r?\n|$)/, `GEMINI_API_KEY=${key}$1`);
      } else {
        envContent += `\nGEMINI_API_KEY=${key}\n`;
      }
      fs.writeFileSync(envPath, envContent, 'utf-8');
    } catch (e) {
      console.warn('Could not persist to .env file, retained in memory:', e);
    }
    return res.json({ success: true, message: 'Gemini API Key saved and activated successfully.' });
  } else {
    delete process.env.GEMINI_API_KEY;
    return res.json({ success: true, message: 'Gemini API Key cleared.' });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🚀 Lumo AI Financial Planner Backend Server Live`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`💾 Database: server/data/lumo_database.json`);
  console.log(`🤖 Model: gemini-3.8-flash`);
  console.log(`🔑 Gemini Configured: ${Boolean(process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY)}`);
  console.log(`===============================================`);
});
