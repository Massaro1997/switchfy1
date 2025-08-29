import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const computeOfferSchema = z.object({
  zip: z.string().min(5),
  annual_kwh: z.number().min(0),
  tariff_preference: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = computeOfferSchema.parse(body);
    
    console.log('Calcolo offerte per:', validatedData);
    
    // Mock offers - in futuro sostituire con chiamata reale API
    const mockOffers = [
      {
        id: 'offer_1',
        supplier: 'E.ON',
        product: 'E.ON Strom Online',
        price_month: Math.round((validatedData.annual_kwh * 0.28) / 12),
        price_year: Math.round(validatedData.annual_kwh * 0.28),
        green: true,
        contract_min_months: 12,
        savings_vs_basic: Math.round((validatedData.annual_kwh * 0.35) - (validatedData.annual_kwh * 0.28))
      },
      {
        id: 'offer_2',
        supplier: 'Vattenfall',
        product: 'Vattenfall Strom Easy',
        price_month: Math.round((validatedData.annual_kwh * 0.26) / 12),
        price_year: Math.round(validatedData.annual_kwh * 0.26),
        green: true,
        contract_min_months: 24,
        savings_vs_basic: Math.round((validatedData.annual_kwh * 0.35) - (validatedData.annual_kwh * 0.26))
      },
      {
        id: 'offer_3',
        supplier: 'EnBW',
        product: 'EnBW Strom Plus',
        price_month: Math.round((validatedData.annual_kwh * 0.24) / 12),
        price_year: Math.round(validatedData.annual_kwh * 0.24),
        green: false,
        contract_min_months: 12,
        savings_vs_basic: Math.round((validatedData.annual_kwh * 0.35) - (validatedData.annual_kwh * 0.24))
      }
    ];
    
    // Ordina per convenienza (prezzo più basso primo)
    const sortedOffers = mockOffers.sort((a, b) => a.price_year - b.price_year);
    
    return NextResponse.json({
      offers: sortedOffers,
      total_offers: sortedOffers.length,
      zip_code: validatedData.zip,
      annual_consumption: validatedData.annual_kwh
    });
    
  } catch (error) {
    console.error('Errore calcolo offerte:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: 'Validation Error',
        message: 'Dati per il calcolo non validi'
      }, { status: 400 });
    }
    
    return NextResponse.json({
      error: 'Internal Server Error',
      message: 'Errore calcolo offerte energetiche'
    }, { status: 500 });
  }
}