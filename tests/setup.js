/**
 * @file Test setup — Mock Firebase and DOM globals for JSDOM environment.
 * @jest-environment jsdom
 */

// ── Mock Firebase ──
const mockFirestore = {
  collection: jest.fn(() => mockFirestore),
  doc: jest.fn(() => mockFirestore),
  add: jest.fn(() => Promise.resolve({ id: 'mock-id' })),
  get: jest.fn(() => Promise.resolve({ exists: false, data: () => ({}) })),
  set: jest.fn(() => Promise.resolve()),
  update: jest.fn(() => Promise.resolve()),
  where: jest.fn(() => mockFirestore),
  orderBy: jest.fn(() => mockFirestore),
  limit: jest.fn(() => mockFirestore),
  enablePersistence: jest.fn(() => Promise.resolve()),
};

const mockAuth = {
  signInWithPopup: jest.fn(() => Promise.resolve({ user: { uid: 'test-uid', displayName: 'Test User', email: 'test@test.com', photoURL: '' } })),
  signOut: jest.fn(() => Promise.resolve()),
  onAuthStateChanged: jest.fn((cb) => cb(null)),
  currentUser: null,
};

global.firebase = {
  initializeApp: jest.fn(),
  auth: jest.fn(() => mockAuth),
  firestore: jest.fn(() => mockFirestore),
  analytics: jest.fn(),
};
global.firebase.auth.GoogleAuthProvider = jest.fn(function () {
  this.setCustomParameters = jest.fn();
});
global.firebase.firestore.FieldValue = {
  serverTimestamp: jest.fn(() => new Date()),
  increment: jest.fn((n) => n),
};

global.auth = mockAuth;
global.db = mockFirestore;
global.showToast = jest.fn();

// ── Mock navigator features ──
Object.defineProperty(navigator, 'share', { value: jest.fn(() => Promise.resolve()), writable: true });
Object.defineProperty(navigator, 'clipboard', { value: { writeText: jest.fn(() => Promise.resolve()) }, writable: true });
Object.defineProperty(navigator, 'serviceWorker', { value: { register: jest.fn(() => Promise.resolve()) }, writable: true });

// ── Mock localStorage ──
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((k) => store[k] || null),
    setItem: jest.fn((k, v) => { store[k] = String(v); }),
    removeItem: jest.fn((k) => { delete store[k]; }),
    clear: jest.fn(() => { store = {}; }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// ── Mock matchMedia ──
window.matchMedia = jest.fn().mockImplementation((query) => ({
  matches: false, media: query,
  addEventListener: jest.fn(), removeEventListener: jest.fn(),
  addListener: jest.fn(), removeListener: jest.fn(),
}));

// ── Mock scrollTo ──
window.scrollTo = jest.fn();

// ── Mock performance ──
window.performance.now = jest.fn(() => 2000);

// ── Mock fetch ──
global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));

module.exports = { mockAuth, mockFirestore };
