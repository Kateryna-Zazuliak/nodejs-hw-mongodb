import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import handlebars from 'handlebars';
import { UsersCollection } from '../db/models/user.js';
import { SessionsCollection } from '../db/models/session.js';
import { createSession } from '../utils/createSession.js';
import { sendEmail } from '../utils/sendMail.js';
import { RESET_PASSWORD_TEMPLATE, SMTP } from '../constants/index.js';

export const findUserByEmail = (email) => UsersCollection.findOne({ email });

export const createUser = async (userData) => {
  const encryptedPassword = await bcrypt.hash(userData.password, 10);
  return UsersCollection.create({
    ...userData,
    password: encryptedPassword,
  });
};

export const createActiveSession = async (userId) => {
  await SessionsCollection.deleteOne({ userId });
  const session = createSession();
  return SessionsCollection.create({ ...session, userId });
};

export const findSessionByToken = (token) =>
  SessionsCollection.findOne({ accessToken: token });

export const findUserById = (userId) => UsersCollection.findById(userId);

export const logoutUser = (sessionId, refreshToken) =>
  SessionsCollection.findOneAndDelete({ _id: sessionId, refreshToken });

export const refreshSession = async (sessionId, refreshToken) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }
  const isExpiredToken = new Date() > session.refreshTokenValidUntil;
  if (isExpiredToken) {
    throw createHttpError(401, 'Token is expired!');
  }

  const user = await findUserById(session.userId);
  if (!user) {
    throw createHttpError(401, 'User not found.');
  }
  await SessionsCollection.findOneAndDelete({ _id: sessionId });
  const newSession = createSession();
  return await SessionsCollection.create({
    userId: user._id,
    ...newSession,
  });
};
export const requestResetPassword = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    { sub: user._id, email: user.email },
    env('JWT_SECRET'),
    { expiresIn: '5m' },
  );
  const template = handlebars.compile(RESET_PASSWORD_TEMPLATE);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });
  try {
    await sendEmail({
      from: env(SMTP.SMTP_FROM),
      to: user.email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.error(error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (password, token) => {
  try {
    const decoded = jwt.verify(token, env('JWT_SECRET'));
    const user = await UsersCollection.findOne({
      _id: decoded.sub,
      email: decoded.email,
    });
    if (!user) {
      throw createHttpError(404, 'User not found!');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await UsersCollection.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
    await SessionsCollection.deleteOne({ userId: user._id });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
    throw error;
  }
};
