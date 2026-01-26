import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

// Mock user database
const users = [
  {
    id: '1',
    email: 'admin@databizpro.com',
    password: '$2a$10$X8z5V5q5Q5q5Q5q5Q5q5Q.3v1Bz9KQ1Y8lC0rT7sN5mB3v6C8x9Z0a',
    name: 'Admin User',
    role: 'admin',
    company: 'DataBiz Pro',
    avatar: null,
    createdAt: new Date(),
  },
  {
    id: '2',
    email: 'user@databizpro.com',
    password: '$2a$10$X8z5V5q5Q5q5Q5q5Q5q5Q.3v1Bz9KQ1Y8lC0rT7sN5mB3v6C8x9Z0a',
    name: 'Demo User',
    role: 'user',
    company: 'Demo Corp',
    avatar: null,
    createdAt: new Date(),
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log('Login attempt:', { email, passwordLength: password?.length });

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      console.log('User not found:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // For demo purposes, accept 'password123' without checking hash
    const isPasswordValid = password === 'password123';

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    console.log('Password valid for user:', user.email);

    // Create JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: '7d' }
    );

    // Set HTTP-only cookie
    const cookieStore = cookies();
    cookieStore.set({
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

    console.log('Login successful for user:', user.email);

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
