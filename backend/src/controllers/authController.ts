import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../models/index';
import { AuthRequest } from '../middleware/authMiddleware';

const generateTokenAndSetCookie = (res: Response, user: any) => {
  const token = jwt.sign(
    { _id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  return token;
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    generateTokenAndSetCookie(res, user);

    res.status(201).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedColleges: []
      },
      message: 'registered successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { savedColleges: true }
    });

    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    generateTokenAndSetCookie(res, user);

    res.status(200).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedColleges: user.savedColleges.map(c => c.id)
      },
      message: 'logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = (req: Request, res: Response) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'logged out successfully' });
};

export const getUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { savedColleges: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({
      user: {
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        savedColleges: user.savedColleges.map(c => c.id)
      }
    });
  } catch (error) {
    next(error);
  }
};
