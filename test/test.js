import { tempoId, Alphabet } from '../src/tempoId.js';

// Test the default tempoId function
const id = tempoId();
console.log('Generated TempoId:', id);

// Test with custom options
const customId = tempoId({
  timeLength: 10,
  randomLength: 15,
  padLeft: false,
  alphabet: Alphabet.hexadecimalLowercase,
});
console.log('Custom TempoId:', customId);

const noTimeId = tempoId({
  timeLength: 0,
  randomLength: 1,
});
console.log('No time TempoId:', noTimeId);