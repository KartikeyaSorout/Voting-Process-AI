/**
 * @file Unit tests for Chat, Quiz, Auth, App, Timeline, News modules.
 * Tests code quality, security patterns, accessibility attributes, and logic.
 * @jest-environment jsdom
 */

require('./setup');
const fs = require('fs');
const path = require('path');

const readModule = (name) => fs.readFileSync(path.join(__dirname, '..', 'public', 'js', name), 'utf-8');
const readFile = (rel) => fs.readFileSync(path.join(__dirname, '..', rel), 'utf-8');

// ─── CODE QUALITY TESTS ───
describe('Code Quality — All Modules', () => {
  const modules = ['app.js', 'auth.js', 'chat.js', 'quiz.js', 'timeline.js', 'news.js', 'firebase-config.js'];

  modules.forEach((mod) => {
    const content = readModule(mod);

    test(`CQ-${mod}: uses strict mode`, () => {
      expect(content).toMatch(/['"]use strict['"]/);
    });

    test(`CQ-${mod}: has JSDoc module comment`, () => {
      expect(content).toContain('/**');
      expect(content).toContain('*/');
    });

    test(`CQ-${mod}: no var declarations`, () => {
      // Allow 'var' inside strings/comments but not as declarations
      const lines = content.split('\n').filter(l => !l.trim().startsWith('*') && !l.trim().startsWith('//') && !l.trim().startsWith("'"));
      const varDecl = lines.filter(l => /^\s*var\s+/.test(l));
      expect(varDecl).toHaveLength(0);
    });

    test(`CQ-${mod}: uses const or let consistently`, () => {
      expect(content).toMatch(/\b(const|let)\b/);
    });
  });
});

// ─── SECURITY TESTS ───
describe('Security — XSS Prevention', () => {
  const chatCode = readModule('chat.js');
  const authCode = readModule('auth.js');
  const newsCode = readModule('news.js');

  test('SEC-01: chat.js has escapeHtml function', () => {
    expect(chatCode).toContain('function escapeHtml');
  });

  test('SEC-02: auth.js has escapeHtml function', () => {
    expect(authCode).toContain('function escapeHtml');
  });

  test('SEC-03: news.js has escapeHtml function', () => {
    expect(newsCode).toContain('function escapeHtml');
  });

  test('SEC-04: chat.js has input sanitization', () => {
    expect(chatCode).toContain('function sanitizeInput');
  });

  test('SEC-05: chat.js has rate limiting', () => {
    expect(chatCode).toContain('RATE_LIMIT_MS');
  });

  test('SEC-06: chat.js has max input length', () => {
    expect(chatCode).toContain('MAX_INPUT_LENGTH');
  });

  test('SEC-07: chat.js has request timeout (AbortController)', () => {
    expect(chatCode).toContain('AbortController');
  });

  test('SEC-08: chat.js limits conversation history size', () => {
    expect(chatCode).toContain('MAX_HISTORY');
  });

  test('SEC-09: auth.js uses referrerpolicy for images', () => {
    expect(authCode).toContain('referrerpolicy');
  });

  test('SEC-10: chat.js limits Firestore message size', () => {
    expect(chatCode).toContain('substring(0, 2000)');
    expect(chatCode).toContain('substring(0, 5000)');
  });
});

describe('Security — CSP and Headers', () => {
  const html = readFile('public/index.html');

  test('SEC-11: HTML has Content-Security-Policy meta tag', () => {
    expect(html).toContain('Content-Security-Policy');
  });

  test('SEC-12: CSP restricts default-src to self', () => {
    expect(html).toContain("default-src 'self'");
  });

  test('SEC-13: CSP restricts script-src', () => {
    expect(html).toContain('script-src');
    expect(html).toContain('gstatic.com');
  });

  test('SEC-14: firebase.json has security headers', () => {
    const fbJson = readFile('firebase.json');
    expect(fbJson).toContain('X-Frame-Options');
    expect(fbJson).toContain('X-Content-Type-Options');
    expect(fbJson).toContain('X-XSS-Protection');
  });
});

describe('Security — Firestore Rules', () => {
  const rules = readFile('firestore.rules');

  test('SEC-15: Rules require authentication', () => {
    expect(rules).toContain('request.auth != null');
  });

  test('SEC-16: Rules enforce user-owned access', () => {
    expect(rules).toContain('request.auth.uid == userId');
  });

  test('SEC-17: Rules prevent deletion', () => {
    expect(rules).toContain('allow delete: if false');
  });

  test('SEC-18: Rules have field validation', () => {
    expect(rules).toContain('hasOnly');
  });

  test('SEC-19: Rules limit message size', () => {
    expect(rules).toContain('size() <= 2000');
    expect(rules).toContain('size() <= 5000');
  });

  test('SEC-20: Default deny rule exists', () => {
    expect(rules).toContain('allow read, write: if false');
  });
});

// ─── ACCESSIBILITY TESTS ───
describe('Accessibility', () => {
  const html = readFile('public/index.html');
  const css  = readFile('public/css/style.css');
  const appCode = readModule('app.js');
  const authCode = readModule('auth.js');

  test('A11Y-01: HTML has lang attribute', () => {
    expect(html).toMatch(/<html\s+lang="en"/);
  });

  test('A11Y-02: Has main landmark', () => {
    expect(html).toContain('<main');
  });

  test('A11Y-03: Has banner landmark (header role="banner")', () => {
    expect(html).toContain('role="banner"');
  });

  test('A11Y-04: Navigation has aria-label', () => {
    expect(html).toContain('aria-label="Main navigation"');
  });

  test('A11Y-05: Mobile nav has aria-hidden', () => {
    expect(html).toContain('aria-hidden="true"');
  });

  test('A11Y-06: Hamburger has aria-expanded', () => {
    expect(html).toContain('aria-expanded="false"');
  });

  test('A11Y-07: Loader has role="status"', () => {
    expect(html).toContain('role="status"');
  });

  test('A11Y-08: Chat messages has role="log"', () => {
    expect(html).toContain('role="log"');
  });

  test('A11Y-09: Quiz progress has role="progressbar"', () => {
    expect(html).toContain('role="progressbar"');
  });

  test('A11Y-10: Guide tabs have role="tablist"', () => {
    expect(html).toContain('role="tablist"');
  });

  test('A11Y-11: Guide tabs have aria-selected', () => {
    expect(html).toContain('aria-selected="true"');
  });

  test('A11Y-12: Guide tabs have aria-controls', () => {
    expect(html).toContain('aria-controls=');
  });

  test('A11Y-13: Guide panels have role="tabpanel"', () => {
    expect(html).toContain('role="tabpanel"');
  });

  test('A11Y-14: Modal has role="dialog"', () => {
    expect(html).toContain('role="dialog"');
  });

  test('A11Y-15: Modal has aria-modal="true"', () => {
    expect(html).toContain('aria-modal="true"');
  });

  test('A11Y-16: Toast has role="alert"', () => {
    expect(html).toContain('role="alert"');
  });

  test('A11Y-17: Toast has aria-live="assertive"', () => {
    expect(html).toContain('aria-live="assertive"');
  });

  test('A11Y-18: CSS has prefers-reduced-motion', () => {
    expect(css).toContain('prefers-reduced-motion');
  });

  test('A11Y-19: CSS has prefers-color-scheme', () => {
    expect(css).toContain('prefers-color-scheme');
  });

  test('A11Y-20: CSS has forced-colors (high contrast)', () => {
    expect(css).toContain('forced-colors');
  });

  test('A11Y-21: App creates skip link', () => {
    expect(appCode).toContain('skip-link');
    expect(appCode).toContain('Skip to main content');
  });

  test('A11Y-22: App creates screen reader announcer', () => {
    expect(appCode).toContain('aria-live');
    expect(appCode).toContain('aria-atomic');
  });

  test('A11Y-23: Auth has focus trap for modal', () => {
    expect(authCode).toContain('function trapFocus');
  });

  test('A11Y-24: App supports arrow-key tab navigation', () => {
    expect(appCode).toContain('ArrowRight');
    expect(appCode).toContain('ArrowLeft');
  });

  test('A11Y-25: All sections have aria-labelledby', () => {
    expect(html).toContain('aria-labelledby="home-heading"');
    expect(html).toContain('aria-labelledby="timeline-heading"');
    expect(html).toContain('aria-labelledby="guide-heading"');
    expect(html).toContain('aria-labelledby="quiz-heading"');
    expect(html).toContain('aria-labelledby="chat-heading"');
  });
});

// ─── EFFICIENCY TESTS ───
describe('Efficiency & Performance', () => {
  const swCode = readFile('public/sw.js');
  const css    = readFile('public/css/style.css');
  const chatCode = readModule('chat.js');
  const newsCode = readModule('news.js');

  test('EFF-01: Service Worker has cache versioning', () => {
    expect(swCode).toContain('CACHE_NAME');
  });

  test('EFF-02: Service Worker has cache size limit', () => {
    expect(swCode).toContain('MAX_DYNAMIC_CACHE_SIZE');
    expect(swCode).toContain('trimCache');
  });

  test('EFF-03: Service Worker separates static and dynamic caches', () => {
    expect(swCode).toContain('DYNAMIC_CACHE');
  });

  test('EFF-04: CSS has will-change for animations', () => {
    expect(css).toContain('will-change');
  });

  test('EFF-05: Chat uses requestAnimationFrame for scrolling', () => {
    expect(chatCode).toContain('requestAnimationFrame');
  });

  test('EFF-06: News uses IntersectionObserver for lazy loading', () => {
    expect(newsCode).toContain('IntersectionObserver');
  });

  test('EFF-07: Chat has API request timeout', () => {
    expect(chatCode).toContain('AbortController');
    expect(chatCode).toContain('15000');
  });

  test('EFF-08: Service Worker caches static assets list', () => {
    expect(swCode).toContain('STATIC_ASSETS');
  });

  test('EFF-09: Service Worker uses skipWaiting', () => {
    expect(swCode).toContain('self.skipWaiting()');
  });

  test('EFF-10: CSS has print styles', () => {
    expect(css).toContain('@media print');
  });
});

// ─── GOOGLE SERVICES TESTS ───
describe('Google Services Integration', () => {
  const html = readFile('public/index.html');
  const fbJson = readFile('firebase.json');
  const fbrc = readFile('.firebaserc');

  test('GS-01: Uses Firebase v10+ compat SDKs', () => {
    expect(html).toContain('firebase-app-compat.js');
    expect(html).toContain('firebase-auth-compat.js');
    expect(html).toContain('firebase-firestore-compat.js');
    expect(html).toContain('firebase-analytics-compat.js');
  });

  test('GS-02: firebase.json has hosting config', () => {
    const config = JSON.parse(fbJson);
    expect(config.hosting).toBeDefined();
    expect(config.hosting.public).toBe('public');
  });

  test('GS-03: firebase.json has SPA rewrite', () => {
    const config = JSON.parse(fbJson);
    const rewrites = config.hosting.rewrites;
    expect(rewrites).toBeDefined();
    const spaRewrite = rewrites.find(r => r.source === '**');
    expect(spaRewrite.destination).toBe('/index.html');
  });

  test('GS-04: firebase.json has Firestore rules path', () => {
    const config = JSON.parse(fbJson);
    expect(config.firestore).toBeDefined();
    expect(config.firestore.rules).toBe('firestore.rules');
  });

  test('GS-05: firebase.json has Firestore indexes path', () => {
    const config = JSON.parse(fbJson);
    expect(config.firestore.indexes).toBe('firestore.indexes.json');
  });

  test('GS-06: .firebaserc has correct project ID', () => {
    const rc = JSON.parse(fbrc);
    expect(rc.projects.default).toBe('election-assistant-936d2');
  });

  test('GS-07: firebase.json has caching headers', () => {
    expect(fbJson).toContain('Cache-Control');
    expect(fbJson).toContain('max-age');
  });

  test('GS-08: Firestore indexes exist', () => {
    const indexes = JSON.parse(readFile('firestore.indexes.json'));
    expect(indexes.indexes).toBeDefined();
    expect(indexes.indexes.length).toBeGreaterThan(0);
  });
});

// ─── PROBLEM STATEMENT ALIGNMENT TESTS ───
describe('Problem Statement Alignment', () => {
  const html = readFile('public/index.html');
  const chatCode = readModule('chat.js');
  const quizCode = readModule('quiz.js');

  test('PSA-01: Has AI chat assistant section', () => {
    expect(html).toContain('section-chat');
    expect(html).toContain('Ask the Election AI');
  });

  test('PSA-02: Has election timeline section', () => {
    expect(html).toContain('section-timeline');
    expect(html).toContain('Indian Election Timeline');
  });

  test('PSA-03: Has voter guide with multiple tabs', () => {
    expect(html).toContain('section-guide');
    expect(html).toContain('Complete Voter Guide');
    expect(html).toContain('tab-register');
    expect(html).toContain('tab-prepare');
    expect(html).toContain('tab-vote');
    expect(html).toContain('tab-understand');
    expect(html).toContain('tab-evm');
  });

  test('PSA-04: Has civic quiz with 10 questions', () => {
    expect(quizCode).toContain('TOTAL_QUESTIONS');
    expect(quizCode).toContain('ALL_QUESTIONS');
    const questionCount = (quizCode.match(/{ q: "/g) || []).length;
    expect(questionCount).toBe(10);
  });

  test('PSA-05: Has multilingual support (Hindi)', () => {
    expect(chatCode).toContain('Hindi');
    expect(chatCode).toContain('English');
  });

  test('PSA-06: Has voter registration info', () => {
    expect(html).toContain('Form 6');
    expect(html).toContain('NVSP');
  });

  test('PSA-07: Has EVM and VVPAT explanation', () => {
    expect(html).toContain('Electronic Voting Machine');
    expect(html).toContain('VVPAT');
    expect(html).toContain('Control Unit');
    expect(html).toContain('Ballot Unit');
  });

  test('PSA-08: Has government formation info', () => {
    expect(html).toContain('Government Formation');
    expect(html).toContain('272');
  });

  test('PSA-09: Has FPTP explanation', () => {
    expect(html).toContain('First Past the Post');
  });

  test('PSA-10: Chat has fallback responses for offline', () => {
    expect(chatCode).toContain('getFallbackResponse');
    // Count fallback response categories
    const fallbackCount = (chatCode.match(/keys: \[/g) || []).length;
    expect(fallbackCount).toBeGreaterThanOrEqual(9);
  });

  test('PSA-11: Has news feed for election updates', () => {
    expect(html).toContain('Election News Feed');
    expect(html).toContain('newsFeed');
  });

  test('PSA-12: Has dark mode support', () => {
    expect(html).toContain('themeToggle');
  });

  test('PSA-13: Is a PWA', () => {
    expect(html).toContain('manifest');
    const manifest = JSON.parse(readFile('public/manifest.json'));
    expect(manifest.name).toBeDefined();
    expect(manifest.start_url).toBeDefined();
  });

  test('PSA-14: Has Google Authentication', () => {
    const authCode = readModule('auth.js');
    expect(authCode).toContain('GoogleAuthProvider');
    expect(authCode).toContain('signInWithPopup');
  });

  test('PSA-15: Quiz has scoring and badges', () => {
    expect(quizCode).toContain('badge');
    expect(quizCode).toContain('🏆');
    expect(quizCode).toContain('🥇');
    expect(quizCode).toContain('🥈');
  });
});

// ─── HTML STRUCTURE & SEO TESTS ───
describe('HTML Structure & SEO', () => {
  const html = readFile('public/index.html');

  test('SEO-01: Has descriptive title tag', () => {
    expect(html).toMatch(/<title>[^<]{30,}<\/title>/);
  });

  test('SEO-02: Has meta description', () => {
    expect(html).toContain('name="description"');
  });

  test('SEO-03: Has meta keywords', () => {
    expect(html).toContain('name="keywords"');
  });

  test('SEO-04: Has Open Graph tags', () => {
    expect(html).toContain('og:title');
    expect(html).toContain('og:description');
    expect(html).toContain('og:type');
    expect(html).toContain('og:url');
  });

  test('SEO-05: Has theme-color meta', () => {
    expect(html).toContain('name="theme-color"');
  });

  test('SEO-06: Uses semantic HTML5 elements', () => {
    expect(html).toContain('<header');
    expect(html).toContain('<main');
    expect(html).toContain('<nav');
    expect(html).toContain('<section');
    expect(html).toContain('<article');
  });

  test('SEO-07: Has single h1 per page', () => {
    const h1Count = (html.match(/<h1/g) || []).length;
    expect(h1Count).toBe(1);
  });

  test('SEO-08: Has proper heading hierarchy', () => {
    expect(html).toContain('<h1');
    expect(html).toContain('<h2');
    expect(html).toContain('<h3');
  });
});
