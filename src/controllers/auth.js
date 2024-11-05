import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import {
  findUserByEmail,
  createActiveSession,
  createUser,
  logoutUser,
  refreshSession,
  requestResetPassword,
  resetPassword,
} from '../services/auth.js';
import { setupCookies } from '../utils/setupCookies.js';

export const registerUserController = async (req, res) => {
  const { name, email } = req.body;
  const user = await findUserByEmail(email);
  if (user) {
    throw createHttpError(409, 'User with this email is already exist!');
  }
  await createUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      name,
      email,
    },
  });
};

export async function loginUserController(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'Credentials are wrong!');
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw createHttpError(404, 'Credentials are wrong!');
  }
  const session = await createActiveSession(user._id);
  setupCookies(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
}

export const refreshSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  const session = await refreshSession(sessionId, refreshToken);
  setupCookies(res, session);
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;
  await logoutUser(sessionId, refreshToken);
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).end();
};
export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  await requestResetPassword(email);
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { password, token } = req.body;
  await resetPassword(password, token);
  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
