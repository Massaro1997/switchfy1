import { NextRequest, NextResponse } from 'next/server';
import { leadsAPI } from '@/lib/database';
import { z } from 'zod';

const createLeadSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  zipCode: z.string().optional(),
  annualConsumption: z.number().optional(),
  currentProvider: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createLeadSchema.parse(body);
    
    // Verifica se lead esiste già
    const existingLead = leadsAPI.getByEmail(validatedData.email);
    if (existingLead) {
      return NextResponse.json({
        error: 'Lead already exists',
        message: 'Un lead con questa email esiste già'
      }, { status: 409 });
    }
    
    const lead = leadsAPI.create(validatedData);
    
    return NextResponse.json({
      success: true,
      lead_id: lead.id,
      message: 'Lead creato con successo'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Errore creazione lead:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation Error',
        message: 'Dati non validi',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Errore interno del server'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const leads = leadsAPI.getAll();
    const stats = leadsAPI.getStats();
    
    return NextResponse.json({
      leads,
      stats,
      total: leads.length
    });
    
  } catch (error) {
    console.error('Errore recupero leads:', error);
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Errore recupero leads'
    }, { status: 500 });
  }
}