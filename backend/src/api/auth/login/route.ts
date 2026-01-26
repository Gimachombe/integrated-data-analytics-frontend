import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Mock user database - Replace with actual database in production
const users = [
  {
    id: '1',
    email: 'admin@databizpro.com',
    password: '$2a$10$X8z5V5q5Q5q5Q5q5Q5q5Q5', // hashed password for 'password123'
    name: 'Admin User',
    role: 'admin',
    company: 'DataBiz Pro',
    avatar: null,
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'user@databizpro.com',
    password: '$2a$10$X8z5V5q5Q5q5Q5q5Q5q5Q5',
    name: 'Demo User',
    role: 'user',
    company: 'Demo Corp',
    avatar: null,
    createdAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const user = users.find(u => u.email === email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Verify password (in production, use bcrypt.compare)
    // For demo, we'll use a simple check. In production, hash the password properly
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // For demo purposes, also accept 'password123' without hashing
    const demoPasswordValid = password === 'password123';

    if (!isPasswordValid && !demoPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key-change-in-production',
      { expiresIn: '7d' }
    );

    // Set cookie
    (await cookies()).set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
