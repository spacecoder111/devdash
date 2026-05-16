const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const cache = new Map();

app.use(cors());
app.use(express.json());

// Simple cache helper
function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data, ttlSeconds = 300) {
  cache.set(key, {
    data: data,
    expiry: Date.now() + (ttlSeconds * 1000)
  });
}

// GitHub endpoint
app.get('/api/github', async (req, res) => {
  const cached = getCache('github');
  if (cached) return res.json(cached);

  try {
    const token = process.env.GITHUB_TOKEN;
    const username = process.env.GITHUB_USERNAME;

    if (!username) {
      return res.json({ 
        issues: [], 
        pullRequests: [], 
        count: 0,
        message: '⚠️ Set GITHUB_USERNAME in backend/.env file'
      });
    }

    const headers = {};
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const [issuesRes, prsRes] = await Promise.all([
      fetch(`https://api.github.com/search/issues?q=assignee:${username}+is:open+is:issue`, { headers }),
      fetch(`https://api.github.com/search/issues?q=assignee:${username}+is:open+is:pr`, { headers })
    ]);

    const issues = await issuesRes.json();
    const prs = await prsRes.json();

    const data = {
      issues: issues.items || [],
      pullRequests: prs.items || [],
      count: (issues.items?.length || 0) + (prs.items?.length || 0)
    };

    setCache('github', data);
    res.json(data);
  } catch (error) {
    console.error('GitHub error:', error);
    res.json({ 
      issues: [], 
      pullRequests: [], 
      count: 0,
      message: '📡 Add GITHUB_TOKEN to see real data'
    });
  }
});

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// System stats endpoint
app.get('/api/system', (req, res) => {
  const os = require('os');
  res.json({
    cpu: os.loadavg()[0],
    memory: {
      total: Math.round(os.totalmem() / 1024 / 1024),
      free: Math.round(os.freemem() / 1024 / 1024)
    },
    uptime: Math.floor(os.uptime() / 3600)
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
  console.log(`📊 Test GitHub API: http://localhost:${PORT}/api/github`);
});