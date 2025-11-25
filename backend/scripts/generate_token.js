#!/usr/bin/env node
/**
 * Generate a JWT API token for frontend authentication.
 * 
 * Usage:
 *   node scripts/generate_token.js [--secret SECRET] [--expires-days DAYS]
 * 
 * Example:
 *   node scripts/generate_token.js --secret "your-secret-here"
 */

const crypto = require('crypto');

function base64UrlEncode(str) {
  return Buffer.from(str).toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function createJWT(secret, expiresDays = 365) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    type: 'api_token',
    exp: now + (expiresDays * 24 * 60 * 60),
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

// Parse command line arguments
const args = process.argv.slice(2);
let secret = null;
let expiresDays = 365;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--secret' && args[i + 1]) {
    secret = args[i + 1];
    i++;
  } else if (args[i] === '--expires-days' && args[i + 1]) {
    expiresDays = parseInt(args[i + 1], 10);
    i++;
  }
}

if (!secret) {
  secret = process.env.JWT_SECRET;
}

if (!secret) {
  console.error('Error: JWT_SECRET not set!');
  console.error('Set JWT_SECRET environment variable or use --secret flag.');
  console.error('Example: export JWT_SECRET=$(openssl rand -hex 32)');
  process.exit(1);
}

try {
  const token = createJWT(secret, expiresDays);
  console.log(`\nAPI Token (expires in ${expiresDays} days):`);
  console.log(token);
  console.log('\nSet this as NEXT_PUBLIC_API_TOKEN in your frontend environment variables.\n');
} catch (error) {
  console.error(`Error generating token: ${error.message}`);
  process.exit(1);
}

