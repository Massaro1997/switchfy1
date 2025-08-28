const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ff82d478-d7da-4a3a-96ea-83d4d70f559c-00-3kgl6pxwclsqg.janeway.replit.dev';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

const apiHeaders = {
  'Content-Type': 'application/json',
  ...(API_KEY && { 'X-API-Key': API_KEY }),
};

export const api = {
  // Crea un utente
  createUser: async (userData: { 
    email: string; 
    name?: string; 
    phone?: string; 
    city?: string; 
    notes?: string; 
    source?: string; 
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/users`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create user');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Inizia una sessione quiz
  startQuizSession: async (userId?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/start`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify({ userId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to start quiz');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error starting quiz:', error);
      throw error;
    }
  },

  // Salva una risposta del quiz
  saveQuizAnswer: async (answerData: {
    sessionId: string;
    step: number;
    key: string;
    value: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quiz/answer`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(answerData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save answer');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving quiz answer:', error);
      throw error;
    }
  },

  // Calcola le offerte energia
  computeOffers: async (criteria: {
    zip: string;
    annual_kwh: number;
    tariff_preference?: string;
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/offer/compute`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(criteria),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get offers');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error computing offers:', error);
      throw error;
    }
  },

  // Genera un contratto
  generateContract: async (contractData: {
    offer_id: string;
    customer: {
      email: string;
      first_name: string;
      last_name: string;
      street: string;
      city: string;
      zip: string;
      phone?: string;
    };
  }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contract/generate`, {
        method: 'POST',
        headers: apiHeaders,
        body: JSON.stringify(contractData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to generate contract');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  },

  // Ottieni stato del contratto
  getContractStatus: async (contractId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/contract/${contractId}/status`, {
        method: 'GET',
        headers: apiHeaders,
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to get contract status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting contract status:', error);
      throw error;
    }
  },

  // Submit contact form
  submitContactForm: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    city?: string;
    notes?: string;
    source?: string;
  }) => {
    try {
      console.log('Making request to:', `${API_BASE_URL}/api/leads/contact-form`);
      console.log('With headers:', { 'Content-Type': 'application/json', 'X-API-Key': API_KEY });
      console.log('With data:', contactData);
      
      const response = await fetch(`${API_BASE_URL}/api/leads/contact-form`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': API_KEY || '',
        },
        body: JSON.stringify(contactData),
        mode: 'cors',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to submit contact form');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  }
};