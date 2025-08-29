import { NextRequest, NextResponse } from 'next/server';
import { leadsAPI } from '@/lib/database';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Contact form received:', body);
    
    const validatedData = contactFormSchema.parse(body);
    
    // Dividi il nome completo in nome e cognome
    const nameParts = validatedData.name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || 'Unknown';
    
    // Verifica se lead esiste già
    const existingLead = leadsAPI.getByEmail(validatedData.email);
    if (existingLead) {
      // Aggiorna lead esistente
      const updatedLead = leadsAPI.update(existingLead.id, {
        phone: validatedData.phone || existingLead.phone,
        zip_code: validatedData.city || existingLead.zip_code,
        notes: validatedData.notes ? 
          `${existingLead.notes || ''}\n\nNuova richiesta: ${new Date().toLocaleString()}\n${validatedData.notes}` : 
          existingLead.notes,
        status: 'new',  // Reset to new for fresh inquiry
        source: validatedData.source || existingLead.source
      });
      
      console.log('Lead aggiornato:', updatedLead?.id);
      
      return NextResponse.json({
        message: 'Grazie per il tuo interesse! Ti contatteremo presto.',
        lead_id: existingLead.id,
        status: 'updated'
      });
    }
    
    // Crea nuovo lead
    const lead = leadsAPI.create({
      firstName,
      lastName,
      email: validatedData.email,
      phone: validatedData.phone,
      zipCode: validatedData.city,
      source: validatedData.source || 'contact-form',
      notes: validatedData.notes
    });
    
    console.log('Nuovo lead creato:', lead.id);
    
    return NextResponse.json({
      message: 'Grazie per il tuo interesse! Ti contatteremo presto.',
      lead_id: lead.id,
      status: 'created'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Errore contact form:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation Error',
        message: 'Dati del form non validi',
        details: error.errors
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Errore interno. Riprova più tardi.'
    }, { status: 500 });
  }
}