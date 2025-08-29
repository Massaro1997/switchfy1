import { NextRequest, NextResponse } from 'next/server';
import { quizAPI } from '@/lib/database';
import { z } from 'zod';

const saveAnswerSchema = z.object({
  sessionId: z.string(),
  step: z.number(),
  key: z.string(),
  value: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = saveAnswerSchema.parse(body);
    
    // Verifica che la sessione esista
    const session = quizAPI.getSession(validatedData.sessionId);
    if (!session) {
      return NextResponse.json({
        error: 'Not Found',
        message: 'Sessione quiz non trovata'
      }, { status: 404 });
    }
    
    const answer = quizAPI.saveAnswer(validatedData);
    
    console.log('Risposta quiz salvata:', answer.id);
    
    return NextResponse.json({
      id: answer.id,
      session_id: answer.sessionId,
      step: answer.step,
      key: answer.key,
      value: answer.value
    }, { status: 201 });
    
  } catch (error) {
    console.error('Errore salvataggio risposta quiz:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation Error',
        message: 'Dati risposta non validi'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Errore salvataggio risposta'
    }, { status: 500 });
  }
}