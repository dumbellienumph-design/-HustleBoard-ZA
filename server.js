require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Database (Transitioning from localStorage)
let gigs = [
  {
    id: "seed-0",
    type: "offer",
    title: "Reliable Garden Cleanup & Refuse Removal",
    category: "Garden",
    location: "Joburg",
    price: "450",
    whatsapp: "0821234567",
    description: "Need your garden sorted? I offer complete cleanup, mowing, and refuse removal. Pro service with 5 years experience in Sandton area.",
    isFeatured: true,
    isVerified: true,
    createdAt: Date.now()
  },
  {
    id: "seed-1",
    type: "request",
    title: "Urgent: Need a Plumber for Burst Pipe",
    category: "Other",
    location: "Pretoria",
    price: "800",
    whatsapp: "0831112222",
    description: "Emergency! Pipe burst in kitchen. Need someone ASAP to fix it. Will pay extra for immediate arrival.",
    isFeatured: true,
    isVerified: false,
    createdAt: Date.now() - 3600000
  }
];

// --- ROUTES ---

// Get all gigs (with sorting logic)
app.get('/api/gigs', (req, res) => {
  const sortedGigs = [...gigs].sort((a, b) => {
    if (a.isFeatured && !b.isFeatured) return -1;
    if (!a.isFeatured && b.isFeatured) return 1;
    return b.createdAt - a.createdAt;
  });
  res.json(sortedGigs);
});

// Post a new gig
app.post('/api/gigs', (req, res) => {
  const newGig = {
    id: Date.now().toString(36),
    createdAt: Date.now(),
    isFeatured: false, // Default: Featured costs money!
    isVerified: false,
    ...req.body
  };
  gigs.unshift(newGig);
  res.status(201).json(newGig);
});

// "Lead Lock" Logic (Draft)
app.get('/api/gigs/:id/contact', (req, res) => {
  const gig = gigs.find(g => g.id === req.id);
  if (!gig) return res.status(404).json({ message: "Gig not found" });
  
  // Future: Check if user is logged in or has paid
  // res.json({ whatsapp: gig.whatsapp });
  res.json({ message: "Lead lock active. Payment required for Pro contact." });
});

app.listen(PORT, () => {
  console.log(`🚀 HustleBoard Engine running on http://localhost:${PORT}`);
});
