/**
 * @file Unit tests for Firebase configuration module.
 * @jest-environment jsdom
 */

require('./setup');

describe('Firebase Configuration', () => {
  const fs = require('fs');
  const path = require('path');
  const configContent = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'firebase-config.js'), 'utf-8');

  test('TC-FC-01: Config file exists and is non-empty', () => {
    expect(configContent.length).toBeGreaterThan(0);
  });

  test('TC-FC-02: Contains valid API key', () => {
    expect(configContent).toContain('AIzaSyCX50gML5ePrjTmQZFUxsxAcb5vm1Zk64Y');
  });

  test('TC-FC-03: Contains correct project ID', () => {
    expect(configContent).toContain('election-assistant-936d2');
  });

  test('TC-FC-04: Contains authDomain', () => {
    expect(configContent).toContain('authDomain');
    expect(configContent).toContain('.firebaseapp.com');
  });

  test('TC-FC-05: Contains storageBucket', () => {
    expect(configContent).toContain('storageBucket');
  });

  test('TC-FC-06: Contains messagingSenderId', () => {
    expect(configContent).toContain('messagingSenderId');
    expect(configContent).toContain('1016940258966');
  });

  test('TC-FC-07: Contains real appId (not placeholder)', () => {
    expect(configContent).not.toContain('0000000000000000');
    expect(configContent).toContain('1:1016940258966:web:');
  });

  test('TC-FC-08: Contains real measurementId', () => {
    expect(configContent).toContain('G-GCP6Z5HTSK');
  });

  test('TC-FC-09: Uses strict mode', () => {
    expect(configContent).toMatch(/^'use strict'/);
  });

  test('TC-FC-10: Has JSDoc module comment', () => {
    expect(configContent).toContain('@module');
  });

  test('TC-FC-11: Initializes Firebase app', () => {
    expect(configContent).toContain('firebase.initializeApp');
  });

  test('TC-FC-12: Initializes Auth', () => {
    expect(configContent).toContain('firebase.auth()');
  });

  test('TC-FC-13: Initializes Firestore', () => {
    expect(configContent).toContain('firebase.firestore()');
  });

  test('TC-FC-14: Enables offline persistence', () => {
    expect(configContent).toContain('enablePersistence');
  });

  test('TC-FC-15: Has persistence error handling', () => {
    expect(configContent).toContain('failed-precondition');
    expect(configContent).toContain('unimplemented');
  });

  test('TC-FC-16: Initializes Analytics', () => {
    expect(configContent).toContain('firebase.analytics');
  });
});
