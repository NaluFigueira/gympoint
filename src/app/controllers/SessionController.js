import jwt from 'jsonwebtoken';

import * as Yup from 'yup';
import auth from '../../config/auth';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res
        .status(401)
        .json({ error: 'Email and password are required!' });

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.checkPassword(password)))
      return res.status(401).json({ error: 'Invalid email and password' });

    const { id, name } = user;

    return res.json({
      id,
      email,
      name,
      token: jwt.sign({ id }, auth.secret, {
        expiresIn: auth.expires,
      }),
    });
  }
}

export default new SessionController();
