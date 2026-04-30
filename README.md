# 🗳️ ElectIQ — Your Smart Election Guide

[![Firebase Hosting](https://img.shields.io/badge/Deployed%20on-Firebase-orange?logo=firebase)](https://voting-process-ai.web.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Challenge 2**: Create an assistant that helps users understand the election process, timelines, and steps in an interactive and easy-to-follow way.

## 🌟 Overview

**ElectIQ** is an AI-powered web application that helps Indian citizens understand the election process — from voter registration to government formation. It provides an interactive, accessible, and educational experience.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chat Assistant** | Claude-powered Q&A about Indian elections (English & Hindi) |
| 📅 **Election Timeline** | Interactive, filterable timeline of the election process |
| 📖 **Voter Guide** | Step-by-step guide: registration, preparation, voting, results, EVM |
| 🎯 **Civic Quiz** | 10-question quiz with scoring, badges, and Firestore leaderboard |
| 📰 **News Feed** | Curated election news with live-fetch capability |
| 🌙 **Dark Mode** | Theme toggle with system preference detection |
| 📱 **PWA** | Installable, works offline via Service Worker |
| 🔐 **Google Auth** | Firebase Authentication with Firestore user profiles |

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Auth, Firestore, Hosting, Analytics)
- **AI**: Claude API via Cloud Function proxy (with fallback responses)
- **PWA**: Service Worker with cache-first strategy

## 📁 Project Structure

```
├── public/
│   ├── index.html          # Main SPA entry point
│   ├── css/style.css        # Design system & all styles
│   ├── js/
│   │   ├── firebase-config.js  # Firebase initialization
│   │   ├── auth.js             # Google Auth module
│   │   ├── chat.js             # AI chat with rate limiting
│   │   ├── quiz.js             # Civic quiz engine
│   │   ├── timeline.js         # Timeline filter
│   │   ├── news.js             # News feed
│   │   └── app.js              # Navigation, theme, core
│   ├── sw.js               # Service Worker
│   └── manifest.json       # PWA manifest
├── tests/
│   └── test-cases.md       # Comprehensive test cases
├── firebase.json           # Hosting & Firestore config
├── firestore.rules         # Security rules
├── firestore.indexes.json  # Composite indexes
└── README.md
```

## 🚀 Setup & Deployment

### Prerequisites
- Node.js 18+
- Firebase CLI (`npm install -g firebase-tools`)

### Local Development
```bash
# Serve locally
npx serve public
```

### Deploy to Firebase
```bash
firebase login
firebase deploy
```

## 🔒 Security Features

- **Content Security Policy (CSP)** via meta tag
- **Firestore Security Rules** with per-user access control
- **XSS Prevention** — all user input is escaped before rendering
- **Rate Limiting** — chat submissions throttled to prevent abuse
- **Input Validation** — max length enforcement on all inputs
- **Security Headers** — X-Frame-Options, X-Content-Type-Options, etc.

## ♿ Accessibility

- WCAG 2.1 AA compliant color contrast
- Full keyboard navigation with arrow key support
- Screen reader announcements for navigation
- Skip-to-content link
- `prefers-reduced-motion` support
- `prefers-color-scheme` auto dark mode
- Focus trap in modals
- ARIA labels, roles, and live regions throughout

## 📝 License

MIT © ElectIQ Team
