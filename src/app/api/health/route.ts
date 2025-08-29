import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    ok: true,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    message: 'EnergySwitch API interno funzionante!'
  });
}