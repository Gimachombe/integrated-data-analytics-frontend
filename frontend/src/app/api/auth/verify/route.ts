import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      );

      return NextResponse.json({
        valid: true,
        user: decoded,
      });
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
