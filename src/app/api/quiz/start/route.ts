import { NextRequest, NextResponse } from 'next/server';
import { quizAPI } from '@/lib/database';
import { z } from 'zod';

const startQuizSchema = z.object({
  userId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = startQuizSchema.parse(body);
    
    const session = quizAPI.startSession(validatedData.userId);
    
    console.log('Quiz session avviata:', session.session_id);
    
    return NextResponse.json(session, { status: 201 });
    
  } catch (error) {
    console.error('Errore avvio quiz:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation Error',
        message: 'Dati non validi per l\'avvio del quiz'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Errore avvio quiz'
    }, { status: 500 });
  }
}