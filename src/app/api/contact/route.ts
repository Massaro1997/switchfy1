import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxying request to backend:', body);
    
    const response = await fetch('https://ff82d478-d7da-4a3a-96ea-83d4d70f559c-00-3kgl6pxwclsqg.janeway.replit.dev/api/leads/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'switchfy_dev_key_12345',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      return NextResponse.json(
        { error: `Backend error: ${errorText}` },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('Backend success:', result);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}