// Predefined alphabets
const Alphabet = {
  numbers: '0123456789',
  hexadecimalLowercase: '0123456789abcdef',
  hexadecimalUppercase: '0123456789ABCDEF',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  get alphanumeric() {
    return this.numbers + 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
  },
  get url() {
    return this.alphanumeric + '-_';
  },
  get base64() {
    return this.alphanumeric + '+/';
  },
  noDoppelganger: '346789AaBbCcDdEeFfGgHhiJjKkLMmNnPpQqRrTtUVWwXxYyz',
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

const POOL_SIZE_MULTIPLIER = 64

// Uint8Array filled with random values
let pool

// Points to the next value to read in the pool
let poolCursor

function getRandomBytes(size) {
  if (!pool || pool.byteLength < size) {
    pool = new Uint8Array(size * POOL_SIZE_MULTIPLIER)
    crypto.getRandomValues(pool)
    poolCursor = 0
  } else if (poolCursor + size > pool.byteLength) {
    crypto.getRandomValues(pool)
    poolCursor = 0
  }

  const bytes = pool.subarray(poolCursor, poolCursor + size)
  poolCursor += size
  return bytes
}

function generateRandomString(length, alphabet) {
  const characters = alphabet;
  const alphabetSize = characters.length;
  let randomString = '';

  let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
  let randomBytes;
  let randomIndex;

  for (let i = 0; i < length; i++) {
    let character;
    do {
      if (!randomBytes || randomIndex >= randomBytes.length) {
        randomBytes = getRandomBytes(length * 2);
        randomIndex = 0;
      }
      character = randomBytes[randomIndex] & mask;
      randomIndex += 1;
    } while (character >= alphabetSize);

    randomString += characters[character];
  }

  return randomString;
}

function generateTime({ timeLength, time, startTime, padLeft = true, alphabet }) {
  if (!timeLength) {
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
