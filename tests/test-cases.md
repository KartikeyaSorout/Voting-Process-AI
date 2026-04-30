# ElectIQ — Comprehensive Test Cases

## TC-01: Application Loading
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 1.1 | Loader displays on startup | Open the app URL | Loading screen with ballot box animation and progress bar appears | ⬜ |
| 1.2 | Loader hides after ~2 seconds | Wait for loader | Loader fades out, home section becomes visible | ⬜ |
| 1.3 | Deep link navigation | Open URL with `#timeline` | Timeline section loads directly after loader | ⬜ |
| 1.4 | PWA manifest loads | Check DevTools > Application | Manifest detected with correct name, icons, start_url | ⬜ |
| 1.5 | Service Worker registers | Check DevTools > Application > SW | Service Worker is registered and active | ⬜ |

## TC-02: Navigation
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 2.1 | Desktop nav buttons | Click each nav button (Home, Timeline, Guide, Quiz, Chat) | Correct section displays, button shows active state | ⬜ |
| 2.2 | Mobile hamburger menu | Resize to mobile, tap hamburger | Mobile nav slides open with all 5 sections | ⬜ |
| 2.3 | Mobile nav closes on select | Tap a section in mobile nav | Nav closes, section loads | ⬜ |
| 2.4 | URL hash updates | Navigate to Timeline | URL changes to `#timeline` | ⬜ |
| 2.5 | Keyboard shortcuts | Press Alt+1 through Alt+5 | Navigates to corresponding section, toast confirms | ⬜ |
| 2.6 | Feature cards navigate | Click "AI Assistant" feature card on home | Navigates to chat section | ⬜ |
| 2.7 | Screen reader announcement | Navigate with keyboard | "Navigated to [section]" announced by screen reader | ⬜ |

## TC-03: Theme Toggle
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 3.1 | Toggle to dark mode | Click sun icon | Background, cards, text switch to dark colors; icon becomes 🌙 | ⬜ |
| 3.2 | Toggle back to light | Click moon icon | Theme reverts to light mode; icon becomes ☀️ | ⬜ |
| 3.3 | Theme persists across reload | Set dark mode, reload page | Dark mode is retained | ⬜ |
| 3.4 | System preference detection | Set OS to dark mode, open fresh (no saved pref) | App starts in dark mode | ⬜ |

## TC-04: Election Timeline
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 4.1 | All phases visible by default | Navigate to Timeline | All 7 timeline events are visible | ⬜ |
| 4.2 | Filter: Pre-Election | Click "Pre-Election" filter | Only events 1–4 visible (Announcement, Registration, Nomination, Campaign) | ⬜ |
| 4.3 | Filter: Election | Click "Election" filter | Only event 5 (Voting Day) visible with highlighted card | ⬜ |
| 4.4 | Filter: Post-Election | Click "Post-Election" filter | Only events 6–7 visible (Counting, Government Formation) | ⬜ |
| 4.5 | Filter: All Phases | Click "All Phases" | All 7 events visible again | ⬜ |
| 4.6 | Expandable details | Click "Key Facts" summary | Details section expands with bullet points | ⬜ |
| 4.7 | Hover animation | Hover over timeline card | Card slides right, shadow appears | ⬜ |
| 4.8 | Active dot pulse | Check Voting Day dot | Active dot has pulse animation | ⬜ |

## TC-05: Voter Guide
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 5.1 | Default tab is Register | Navigate to Guide | Register tab is active, registration steps shown | ⬜ |
| 5.2 | Switch to Prepare tab | Click "🎒 Prepare" | Prepare grid with 4 cards (booth, IDs, candidates, hours) | ⬜ |
| 5.3 | Switch to Vote tab | Click "🗳️ Vote" | 6 voting steps shown (Arrive → Done) | ⬜ |
| 5.4 | Switch to Results tab | Click "📊 Results" | 4 result explainer blocks shown | ⬜ |
| 5.5 | Switch to EVM tab | Click "⚙️ EVM & Tech" | EVM diagram and 3 fact cards shown | ⬜ |
| 5.6 | Arrow key tab navigation | Focus on tab, press ArrowRight | Next tab activates and displays its panel | ⬜ |
| 5.7 | External link opens | Click "Search on ECI →" in Prepare tab | ECI website opens in new tab | ⬜ |

## TC-06: Civic Quiz
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 6.1 | Start screen shows | Navigate to Quiz | Start screen with description and "Start Quiz" button | ⬜ |
| 6.2 | Quiz starts | Click "Start Quiz" | First question appears with 4 options, progress bar at 0% | ⬜ |
| 6.3 | Correct answer | Select correct option | Option turns green, "✅ Correct!" feedback with explanation | ⬜ |
| 6.4 | Wrong answer | Select wrong option | Selected turns red, correct turns green, "❌ Wrong." feedback | ⬜ |
| 6.5 | Next button appears | Answer any question | "Next →" button appears and receives focus | ⬜ |
| 6.6 | Progress bar updates | Answer 5 questions | Progress bar shows 50% | ⬜ |
| 6.7 | Score updates live | Answer correctly | Score counter increments | ⬜ |
| 6.8 | Results screen | Complete all 10 questions | Badge, score, percentage, and message displayed | ⬜ |
| 6.9 | Perfect score badge | Score 10/10 | 🏆 badge with "Perfect Score!" message | ⬜ |
| 6.10 | Share score | Click "Share Score" | Web Share API or clipboard copy with toast confirmation | ⬜ |
| 6.11 | Retake quiz | Click "Retake Quiz" | Returns to start screen | ⬜ |
| 6.12 | Questions randomized | Start quiz twice | Question order differs between attempts | ⬜ |
| 6.13 | Options disabled after answer | Select an option | All 4 options become disabled (no double-click) | ⬜ |

## TC-07: AI Chat
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 7.1 | Welcome message | Navigate to Chat | Bot welcome message with ElectIQ introduction | ⬜ |
| 7.2 | Send a message | Type "How to register?" and press Enter | User message appears, typing indicator shows, bot responds | ⬜ |
| 7.3 | Quick question buttons | Click "How does EVM work?" | Question fills input and sends automatically | ⬜ |
| 7.4 | Character counter | Type in chat input | Counter shows character count (e.g., "45/500") | ⬜ |
| 7.5 | Send button disabled when empty | Clear input | Send button is greyed out | ⬜ |
| 7.6 | Rate limiting | Send 2 messages rapidly | Second message shows "Please wait" toast | ⬜ |
| 7.7 | Fallback: registration query | Ask about registration (API offline) | Fallback response about Form 6, NVSP portal | ⬜ |
| 7.8 | Fallback: EVM query | Ask about EVM (API offline) | Fallback response about Control Unit, Ballot Unit | ⬜ |
| 7.9 | Fallback: NOTA query | Ask about NOTA (API offline) | Fallback response about None Of The Above | ⬜ |
| 7.10 | Clear chat | Click "Clear" button | Chat emptied, fresh welcome message appears | ⬜ |
| 7.11 | Message animation | Send a message | Messages fade in with upward animation | ⬜ |
| 7.12 | Auto-resize textarea | Type multiple lines | Textarea grows (up to 120px max) | ⬜ |
| 7.13 | XSS prevention | Send `<script>alert('xss')</script>` | Script is escaped and displayed as text, not executed | ⬜ |
| 7.14 | Shift+Enter for newline | Press Shift+Enter | New line added without sending | ⬜ |

## TC-08: Authentication
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 8.1 | Sign in button visible | Open app (not signed in) | "Sign In" button in header | ⬜ |
| 8.2 | Google sign-in popup | Click "Sign In" | Google account selection popup appears | ⬜ |
| 8.3 | Successful sign-in | Complete Google auth | Profile photo + first name in header, welcome toast | ⬜ |
| 8.4 | Profile modal | Click profile button (signed in) | Modal with photo, name, email, sign out button | ⬜ |
| 8.5 | Sign out | Click "Sign Out" in modal | Reverts to "Sign In" button, confirmation toast | ⬜ |
| 8.6 | Modal close on Escape | Open modal, press Escape | Modal closes, focus returns to auth button | ⬜ |
| 8.7 | Modal close on overlay click | Click dark overlay | Modal closes | ⬜ |
| 8.8 | Focus trap in modal | Tab through modal | Focus cycles within modal elements only | ⬜ |
| 8.9 | Auth state persists | Sign in, reload page | User remains signed in | ⬜ |
| 8.10 | Quiz shows logged-in user | Sign in, go to Quiz | "Logged in as [Name]" text appears | ⬜ |

## TC-09: Firestore Integration
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 9.1 | User doc created on first sign-in | Sign in for first time | Document created in `users` collection | ⬜ |
| 9.2 | Quiz score saved | Complete quiz (signed in) | Score saved in `quizScores` collection | ⬜ |
| 9.3 | High score updated | Beat previous best | `quizBest` field updated, toast shown | ⬜ |
| 9.4 | Chat session saved | Send message (signed in) | Session created in `chatSessions` | ⬜ |
| 9.5 | Chat history loads | Sign in, check sidebar | Previous sessions listed in sidebar | ⬜ |
| 9.6 | Load past session | Click a history item | Previous messages loaded in chat | ⬜ |
| 9.7 | Offline persistence | Go offline, reload | Cached data still accessible | ⬜ |

## TC-10: News Feed
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 10.1 | News loads on home | Visit home section | 6 news cards with tags, titles, summaries, dates | ⬜ |
| 10.2 | News card click | Click a news card | External link opens in new tab | ⬜ |
| 10.3 | News card keyboard | Focus card, press Enter | External link opens | ⬜ |
| 10.4 | Lazy loading | Check network tab | News only loads when home section is visible | ⬜ |

## TC-11: Accessibility
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 11.1 | Skip link | Press Tab on page load | "Skip to main content" link appears | ⬜ |
| 11.2 | Focus visible | Tab through all interactive elements | Orange focus outline visible on each | ⬜ |
| 11.3 | ARIA labels | Inspect with accessibility tree | All buttons/links/regions have descriptive labels | ⬜ |
| 11.4 | Color contrast | Run Lighthouse accessibility | All text meets 4.5:1 contrast ratio | ⬜ |
| 11.5 | Reduced motion | Enable "Reduce motion" in OS | All animations disabled | ⬜ |
| 11.6 | Screen reader navigation | Use NVDA/VoiceOver | Sections announced, live regions update | ⬜ |
| 11.7 | Keyboard-only quiz | Complete quiz using only keyboard | All options selectable, next button focusable | ⬜ |

## TC-12: Responsive Design
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 12.1 | Desktop (1440px) | View at 1440px | Full layout with sidebar, hero visual | ⬜ |
| 12.2 | Tablet (1024px) | View at 1024px | Hero visual hidden, chat sidebar hidden | ⬜ |
| 12.3 | Mobile (768px) | View at 768px | Hamburger menu appears, desktop nav hidden | ⬜ |
| 12.4 | Small mobile (480px) | View at 480px | Hero title smaller, stats wrap, auth text hidden | ⬜ |

## TC-13: Security
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 13.1 | CSP header present | Check response headers | Content-Security-Policy meta tag in HTML | ⬜ |
| 13.2 | X-Frame-Options | Check Firebase hosting response | SAMEORIGIN header present | ⬜ |
| 13.3 | Input sanitization | Enter HTML tags in chat | Tags are escaped and rendered as text | ⬜ |
| 13.4 | Firestore rules | Try to read another user's data | Access denied by security rules | ⬜ |
| 13.5 | Rate limit enforcement | Rapid-fire chat messages | Rate limit toast appears after first message | ⬜ |

## TC-14: Performance
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 14.1 | Lighthouse performance | Run Lighthouse | Score ≥ 80 for Performance | ⬜ |
| 14.2 | Lighthouse accessibility | Run Lighthouse | Score ≥ 90 for Accessibility | ⬜ |
| 14.3 | Lighthouse SEO | Run Lighthouse | Score ≥ 90 for SEO | ⬜ |
| 14.4 | Lighthouse best practices | Run Lighthouse | Score ≥ 80 for Best Practices | ⬜ |
| 14.5 | Service Worker caching | Load app, go offline, reload | App loads from cache offline | ⬜ |

## TC-15: Cross-Browser
| # | Test Case | Steps | Expected Result | Status |
|---|-----------|-------|-----------------|--------|
| 15.1 | Chrome | Test all features | Full functionality | ⬜ |
| 15.2 | Firefox | Test all features | Full functionality | ⬜ |
| 15.3 | Safari | Test all features | Full functionality (no Web Share on desktop) | ⬜ |
| 15.4 | Edge | Test all features | Full functionality | ⬜ |
