import jwt from 'jsonwebtoken';

import { promisify } from 'util';
import auth from '../../config/auth';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ error: 'Unathorized user!' });

  const [, token] = authorization.split(' ');

  try {
    const { id } = await promisify(jwt.verify)(token, auth.secret);
    req.userId = id;
    return next();
  } catch (error) {
    return res.status(401).json({ erro: 'Invalid Token!' });
  }
};
