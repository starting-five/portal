// middleware/auth.js
// Express middleware to extract Supabase user claims from JWT and attach user info to req.user

const { jwtVerify, createRemoteJWKSet } = require('jose');

// Create JWKS from Supabase's well-known endpoint
const PROJECT_JWKS = createRemoteJWKSet(
  new URL(`${process.env.SUPABASE_PROJECT_URL}/auth/v1/.well-known/jwks.json`)
);

async function getClaims(token) {
  try {
    console.time('JWT-Verification');
    // Verify JWT using JWKS - supports ES256, RS256, etc.
    const { payload } = await jwtVerify(token, PROJECT_JWKS);
    console.timeEnd('JWT-Verification');
    return payload;
  } catch (err) {
    console.timeEnd('JWT-Verification');
    console.error('JWT verification error:', err);
    return null;
  }
}

// Express middleware to extract user from Authorization header
async function requireUser(req, res, next) {
  console.time('Auth-Middleware-Total');
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.timeEnd('Auth-Middleware-Total');
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.replace('Bearer ', '');
  const claims = await getClaims(token);
  if (!claims || !claims.sub) {
    console.timeEnd('Auth-Middleware-Total');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  // Attach user info to request
  req.user = {
    id: claims.sub, // Supabase user UUID
    email: claims.email,
    role: claims.role || (claims.app_metadata && claims.app_metadata.role),
    ...claims
  };
  console.timeEnd('Auth-Middleware-Total');
  next();
}

module.exports = { requireUser };
