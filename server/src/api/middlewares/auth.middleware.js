import jwt from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import axios from 'axios';

const jwksUrl = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`;
let jwksCache = null;

const getJwks = async () => {
  if (jwksCache) {
    return jwksCache;
  }
  const response = await axios.get(jwksUrl);
  jwksCache = response.data.keys;
  return jwksCache;
};

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken) {
      return res.status(401).send('Invalid token.');
    }
    const kid = decodedToken.header.kid;
    const tokenPayload = decodedToken.payload;

    const jwks = await getJwks();
    const jwk = jwks.find((key) => key.kid === kid);
    if (!jwk) {
      return res.status(401).send('Invalid token.');
    }
    const pem = jwkToPem(jwk);

    const verifiedPayload = jwt.verify(token, pem, { algorithms: ['RS256'] });

    req.userData = {
      id: verifiedPayload.sub,
      email: verifiedPayload.email,
      role: verifiedPayload['custom:role'],
    };

    next();
  } catch (error) {
    res.status(401).send('Invalid token.');
  }
};

export default auth;