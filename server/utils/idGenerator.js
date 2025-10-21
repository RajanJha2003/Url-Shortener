// utils/idGenerator.js

// Base62 characters: 0-9, a-z, A-Z
const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Convert a numeric ID to Base62 string
function base62Encode(num) {
  let encoded = '';
  while (num > 0) {
    const remainder = num % 62;
    encoded = chars[remainder] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded || '0';
}

// Generate distributed unique ID using timestamp + randomness
function generateUniqueId() {
  const timestamp = Date.now(); // milliseconds
  const random = Math.floor(Math.random() * 1000); // add some randomness
  const id = (timestamp * 1000) + random; // combine
  return id;
}

// Main short ID generator function
function generateShortId() {
  const uniqueId = generateUniqueId();
  return base62Encode(uniqueId);
}

export default generateShortId;