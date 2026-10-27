const assert = require('node:assert/strict');
const test = require('node:test');

process.env.AUTH_TOKEN_SECRET = 'test-auth-token-secret-at-least-thirty-two-characters';
process.env.ADMIN_TOKEN_SECRET = 'test-admin-token-secret-at-least-thirty-two-characters';

const app = require('../index');
const {
  createAuthToken,
  getAuthUserId,
  hashPassword,
  verifyPassword,
} = require('../lib/auth');

const testUserId = '507f1f77bcf86cd799439011';

test('user tokens are signed and reject tampering', () => {
  const token = createAuthToken(testUserId);
  assert.equal(getAuthUserId(token), testUserId);
  assert.equal(getAuthUserId(`${token.slice(0, -1)}x`), null);
});

test('password hashes verify without storing the original password', async () => {
  const password = 'correct-horse-battery-staple';
  const hash = await hashPassword(password);
  assert.notEqual(hash, password);
  assert.equal(await verifyPassword(password, hash), true);
  assert.equal(await verifyPassword('wrong-password', hash), false);
});

test('protected routes reject requests without a token', async (t) => {
  const server = app.listen(0);
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const baseUrl = `http://127.0.0.1:${address.port}`;

  for (const [path, method] of [
    ['/api/skin-analysis', 'POST'],
    ['/api/analyses', 'GET'],
    ['/api/images', 'POST'],
    [`/api/images/${testUserId}/analyze`, 'POST'],
    [`/api/images/${testUserId}`, 'GET'],
    ['/api/admin/users', 'GET'],
  ]) {
    const response = await fetch(`${baseUrl}${path}`, { method });
    assert.equal(response.status, 401, `${method} ${path} should require authentication`);
  }
});
