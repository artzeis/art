/* Difficulty presets shared by the app and the check script. */
(function (root) {
  'use strict';
  const DIFFICULTIES = {
    easy: {
      label: 'Easy', size: 11, minLen: 3, maxLen: 8, target: 11, clueMode: 'easy',
      attempts: 80, timeBudget: 700, autocheck: true,
      blurb: 'Compact grid, everyday words, friendly clues'
    },
    medium: {
      label: 'Medium', size: 13, minLen: 3, maxLen: 10, target: 16, clueMode: 'mixed',
      attempts: 80, timeBudget: 900, autocheck: false,
      blurb: 'Classic size with a mix of straight and sly clues'
    },
    hard: {
      label: 'Hard', size: 15, minLen: 4, maxLen: 13, target: 22, clueMode: 'hard',
      attempts: 80, timeBudget: 1100, autocheck: false,
      blurb: 'Big grid, long words, tricky clues'
    }
  };
  root.CW = Object.assign(root.CW || {}, { DIFFICULTIES });
  if (typeof module !== 'undefined' && module.exports) module.exports = { DIFFICULTIES };
})(typeof window !== 'undefined' ? window : globalThis);
