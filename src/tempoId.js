import { webcrypto as nodeCrypto } from 'crypto';

const crypto = globalThis.crypto || nodeCrypto;

if (!crypto || typeof crypto.getRandomValues !== 'function') {
  throw new Error('Web Crypto API is not available.');
}

// Predefined alphabets
const Alphabet = {
  numbers: '0123456789',
  hexadecimalLowercase: '0123456789abcdef',
  hexadecimalUppercase: '0123456789ABCDEF',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  get alphanumeric() {
    return this.numbers + this.lowercase + this.uppercase;
  },
  get url() {
    return this.alphanumeric + '_-';
  },
  get base64() {
    return this.alphanumeric + '+/';
  },
  noDoppelganger: '346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz',
};

const defaultAlphabet = Alphabet.alphanumeric;

/**
 * Generates a new TempoId with a time part and a random part.
 * The total length of the ID will be the sum of timeLength
 * and randomLength. Both default to 8 for timeLength and 13 for randomLength.
 *
 * @param {Object} [options={}] - The options for generating the TempoId.
 * @param {number} [options.timeLength=8] - Length of the time part.
 * @param {number} [options.randomLength=13] - Length of the random part.
 * @param {number} [options.time] - Custom time value in milliseconds.
 * @param {Date} [options.startTime] - Custom start time.
 * @param {boolean} [options.padLeft=true] - Whether to pad the time part on the left.
 * @param {string} [options.alphabet] - Custom alphabet to use.
 * @returns {string} - The generated TempoId.
 */
function tempoId(options = {}) {
  let {
    timeLength = 8,
    randomLength = 13,
    time,
    startTime,
    padLeft = true,
    alphabet = defaultAlphabet,
  } = options;

  // Generate the random part
  const randomPart = generateRandomString(randomLength, alphabet);

  // Generate the time part
  const timePart = generateTime({
    timeLength,
    time,
    startTime,
    padLeft,
    alphabet,
  });

  return timePart + randomPart;
}

function generateRandomString(length, alphabet) {
  const characters = alphabet;
  const alphabetSize = characters.length;
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = getRandomInt(alphabetSize);
    randomString += characters[randomIndex];
  }

  return randomString;
}

function getRandomInt(max) {
  if (max <= 0) {
    throw new Error('max must be positive');
  }

  const maxUint32 = 0xffffffff;
  const limit = Math.floor(maxUint32 / max) * max;
  let rand;

  do {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    rand = buffer[0];
  } while (rand >= limit);

  return rand % max;
}

function generateTime({ timeLength, time, startTime, padLeft = true, alphabet }) {
  if (timeLength === 0) {
    return '';
  }

  if (time === undefined) {
    time = Date.now() - (startTime ? startTime.getTime() : 0);
  }

  const maxValue = getMaxValueOfFixedLength(timeLength, alphabet);
  time = time % (maxValue + 1);

  const millisEncoded = encodeNumber(time, alphabet);

  if (padLeft) {
    const paddingChar = alphabet[0];
    return millisEncoded.padStart(timeLength, paddingChar);
  } else {
    return millisEncoded;
  }
}

function getMaxValueOfFixedLength(length, alphabet) {
  const base = alphabet.length;
  return Math.pow(base, length) - 1;
}

function encodeNumber(number, alphabet) {
  const base = alphabet.length;
  if (number === 0) {
    return alphabet[0];
  }

  let encoded = '';
  while (number > 0) {
    const remainder = number % base;
    encoded = alphabet[remainder] + encoded;
    number = Math.floor(number / base);
  }
  return encoded;
}

export { tempoId, Alphabet };
