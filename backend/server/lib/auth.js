const crypto = require('node:crypto');
const { promisify } = require('node:util');

const scrypt = promisify(crypto.scrypt);
const TOKEN_LIFETIME_SECONDS = 60 * 60 * 24 * 7;
const ADMIN_TOKEN_LIFETIME_SECONDS = 60 * 60 * 8;

function getTokenSecret() {
  const secret = process.env.AUTH_TOKEN_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('Set AUTH_TOKEN_SECRET in the backend environment to a stable random value of at least 32 characters.');
  }
  return secret;
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derivedKey = await scrypt(password, salt, 64);
  return `${salt.toString('hex')}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') return false;
  const [saltHex, keyHex] = storedHash.split(':');
  if (
    !/^[a-f0-9]{32}$/i.test(saltHex || '') ||
    !/^[a-f0-9]{128}$/i.test(keyHex || '')
  ) {
    return false;
  }

  const expectedKey = Buffer.from(keyHex, 'hex');
  const actualKey = await scrypt(password, Buffer.from(saltHex, 'hex'), expectedKey.length);
  return expectedKey.length === actualKey.length && crypto.timingSafeEqual(expectedKey, actualKey);
}

function createAuthToken(userId) {
  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: userId,
    iat: now,
    exp: now + TOKEN_LIFETIME_SECONDS,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', getTokenSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function createAdminToken({ id, email, name }) {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('ADMIN_TOKEN_SECRET must contain at least 32 characters.');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(JSON.stringify({
    sub: id || email,
    id: id || null,
    email,
    name,
    role: 'admin',
    iat: now,
    exp: now + ADMIN_TOKEN_LIFETIME_SECONDS,
  })).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

function getAdminFromToken(token) {
  try {
    const secret = process.env.ADMIN_TOKEN_SECRET;
    if (!secret || Buffer.byteLength(secret) < 32) return null;

    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;

    const expected = crypto.createHmac('sha256', secret).update(payload).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (
      decoded.role !== 'admin' ||
      typeof decoded.sub !== 'string' ||
      typeof decoded.name !== 'string' ||
      !Number.isFinite(decoded.exp) ||
      decoded.exp <= Math.floor(Date.now() / 1000)
    ) return null;

    return {
      id: typeof decoded.id === 'string' ? decoded.id : null,
      email: typeof decoded.email === 'string' ? decoded.email : decoded.sub,
      name: decoded.name,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

function getAuthUserId(token) {
  try {
    const [payload, signature, extra] = token.split('.');
    if (!payload || !signature || extra) return null;

    const expected = crypto.createHmac('sha256', getTokenSecret()).update(payload).digest();
    const actual = Buffer.from(signature, 'base64url');
    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return null;

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof decoded.sub !== 'string' || decoded.exp <= Math.floor(Date.now() / 1000)) return null;
    return decoded.sub;
  } catch {
    return null;
  }
}

module.exports = {
  createAdminToken,
  createAuthToken,
  getAdminFromToken,
  getAuthUserId,
  getTokenSecret,
  hashPassword,
  verifyPassword,
};
