"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronRight, Shield, Sparkles, Play, FileText, HelpCircle } from "lucide-react";
import { api } from "@/services/api";
import { trackEvent, ANALYTICS_EVENTS, useAnalytics } from "@/services/analytics";

// --------- Config ---------

// --------- UI Helpers ---------
function Container({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`mx-auto w-full max-w-6xl px-4 ${className}`}>{children}</div>;
}

function Button({ children, onClick, type = "button", className = "", disabled = false }: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-base font-semibold shadow-sm hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`rounded-2xl border border-gray-100 p-6 shadow-sm bg-white ${className}`}>{children}</div>;
}

function SectionTitle({ k, title, subtitle }: { k: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center">
      <div className="mx-auto mb-2 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-gray-600">
        <span className="inline-flex h-2 w-2 rounded-full bg-black" /> {k}
      </div>
      <h2 className="text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-2 text-gray-600">{subtitle}</p>}
    </div>
  );
}

// --------- Comparison Popup Component ---------
function ComparisonPopup({ 
  isOpen, 
  onClose, 
  data 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  data: {cap: string; persone: string; abitazione: string} | null;
}) {
  if (!isOpen || !data) return null;

  // Generate realistic offers based on user data
  const generateOffers = () => {
    const peopleCount = parseInt(data.persone.charAt(0) || '1');
    const basePrice = peopleCount * 100; // Base price per person
    
    const providers = [
      { name: 'E.ON', color: 'green', rating: 4.5 },
      { name: 'Vattenfall', color: 'blue', rating: 4.3 },
      { name: 'EnBW', color: 'green', rating: 4.4 },
      { name: 'RWE', color: 'blue', rating: 4.2 },
      { name: 'Stadtwerke', color: 'green', rating: 4.6 },
      { name: 'Check24 Energie', color: 'blue', rating: 4.1 }
    ];

    return providers.slice(0, 5).map((provider, index) => ({
      ...provider,
      monthlyPrice: basePrice + (index * 15) + Math.floor(Math.random() * 20),
      annualSavings: 850 - (index * 100) + Math.floor(Math.random() * 100),
      badge: index === 0 ? 'Più conveniente' : index === 1 ? 'Più popolare' : null,
      bonus: index < 2 ? `€${50 + index * 25} bonus` : null
    }));
  };

  const offers = generateOffers();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4 overflow-y-auto animate-in fade-in duration-300">
      <div className="w-full max-w-5xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl max-h-[90vh] overflow-hidden border border-white/20 animate-in slide-in-from-bottom-8 duration-500">
        
        {/* Enhanced Header with Gradient and Pattern */}
        <div className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 text-white p-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-white/5 rounded-full"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-bold">OFFERTE PERSONALIZZATE</span>
              </div>
              <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-white to-white/90 bg-clip-text">
                🎯 Le migliori tariffe per te
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">👥 {data.persone}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">📍 CAP {data.cap}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                  <span className="text-sm font-medium">⚡ {data.abitazione}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110 group"
            >
              <span className="text-2xl group-hover:rotate-90 transition-transform duration-300">×</span>
            </button>
          </div>
        </div>

        {/* Enhanced Offers */}
        <div className="p-8 space-y-5 max-h-[60vh] overflow-y-auto">
          {offers.map((offer, index) => (
            <div 
              key={index}
              className={`group relative p-6 rounded-3xl transition-all duration-300 hover:shadow-2xl cursor-pointer transform hover:scale-[1.02] ${
                offer.badge 
                  ? 'bg-gradient-to-br from-green-50 via-white to-blue-50 border-2 border-green-200 shadow-lg' 
                  : 'bg-white/80 backdrop-blur-sm border-2 border-gray-200/60 hover:border-blue-300'
              }`}
            >
              {/* Badge */}
              {offer.badge && (
                <div className={`absolute -top-3 left-6 px-4 py-1.5 text-xs font-black text-white rounded-full shadow-lg animate-bounce ${
                  index === 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}>
                  {index === 0 ? '🏆 ' : '🔥 '}{offer.badge}
                </div>
              )}
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/5 via-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex-1">
                  {/* Provider Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-5 h-5 rounded-full shadow-lg ${
                      offer.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                      offer.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 
                      offer.color === 'orange' ? 'bg-gradient-to-r from-orange-400 to-red-500' : 
                      'bg-gradient-to-r from-purple-400 to-purple-600'
                    }`}></div>
                    <h3 className="text-xl font-black text-gray-900">{offer.name}</h3>
                    <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-full">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(offer.rating) ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
                        ))}
                      </div>
                      <span className="text-sm font-bold text-gray-700">{offer.rating}</span>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="text-center p-3 bg-gray-50/50 rounded-2xl">
                      <p className="text-xs text-gray-500 font-medium mb-1">💶 Costo mensile</p>
                      <p className="font-black text-lg text-gray-900">€{offer.monthlyPrice}</p>
                      <p className="text-xs text-gray-400">al mese</p>
                    </div>
                    <div className="text-center p-3 bg-green-50/50 rounded-2xl">
                      <p className="text-xs text-gray-500 font-medium mb-1">💰 Risparmio annuo</p>
                      <p className="font-black text-lg text-gray-800">€{offer.annualSavings}</p>
                      <p className="text-xs text-gray-600">vs fornitore base</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50/50 rounded-2xl">
                      <p className="text-xs text-gray-500 font-medium mb-1">🎁 Bonus</p>
                      <p className="font-black text-lg text-blue-700">{offer.bonus || 'Nessuno'}</p>
                      <p className="text-xs text-blue-500">cashback</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="ml-6">
                  <Button className="group bg-gradient-to-br from-blue-600 via-blue-500 to-green-600 !text-white px-8 py-4 rounded-2xl hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 font-black text-base">
                    <span className="flex items-center gap-2">
                      Scegli Offerta
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-r from-gray-50 via-blue-50/30 to-gray-50 p-6 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-sm font-medium text-gray-700">⚡ Prezzi aggiornati in tempo reale</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-700">🔒 100% sicuro e GDPR compliant</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm font-medium text-gray-700">✨ Completamente gratuito</p>
              </div>
            </div>
            <Button 
              onClick={onClose}
              className="group bg-white/80 backdrop-blur-sm border-2 border-gray-200 hover:border-gray-300 hover:bg-white !text-gray-700 px-6 py-3 rounded-2xl transition-all duration-300 hover:shadow-lg"
            >
              <span className="flex items-center gap-2">
                Chiudi
                <span className="group-hover:rotate-90 transition-transform duration-300">×</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --------- Quick Quiz Form Component for Hero ---------
function QuickQuizForm({ onShowComparator }: { onShowComparator: (data: {cap: string; persone: string; abitazione: string}) => void }) {
  const [cap, setCap] = useState('');
  const [persone, setPersone] = useState('');
  const [abitazione, setAbitazione] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cap || !persone || !abitazione) {
      alert('Compila tutti i campi per continuare');
      return;
    }

    setLoading(true);
    try {
      // Simulate quick calculation with loading effect
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay for effect
      
      // Show comparator popup with user data
      onShowComparator({
        cap,
        persone,
        abitazione
      });
      
      // Reset form
      setCap('');
      setPersone('');
      setAbitazione('');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Errore nel calcolo. Riprova.';
      alert(`Errore: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* CAP */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h4 className="text-xl font-black bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
            Dove abiti in Germania?
          </h4>
        </div>
        <div className="relative group">
          <input
            type="text"
            value={cap}
            onChange={(e) => setCap(e.target.value)}
            placeholder="es. 10115 (Berlino)"
            maxLength={5}
            pattern="[0-9]{5}"
            className="w-full px-6 py-4 bg-white border-2 border-blue-200/60 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 focus:shadow-lg transition-all duration-300 text-center font-bold text-xl tracking-wider group-hover:border-green-300"
            onKeyDown={(e) => {
              if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'Tab' && e.key !== 'Enter') {
                e.preventDefault();
              }
            }}
          />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>
      </div>

      {/* Persone */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h4 className="text-xl font-black bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
            Quante persone vivono in casa?
          </h4>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {[
            { value: "1 persona", icon: "1️⃣" },
            { value: "2 persone", icon: "2️⃣" },
            { value: "3 persone", icon: "3️⃣" },
            { value: "4 persone", icon: "4️⃣" },
            { value: "5+ persone", icon: "5️⃣" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPersone(option.value)}
              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                persone === option.value 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-green-50 text-blue-700 shadow-lg transform scale-105' 
                  : 'border-gray-200/60 hover:border-blue-300 text-gray-600 bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-green-50/50'
              }`}
            >
              <div className="text-3xl transition-transform group-hover:scale-110">{option.icon}</div>
              {persone === option.value && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo servizio */}
      <div className="mb-6">
        <div className="text-center mb-4">
          <h4 className="text-xl font-black bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
            Di cosa hai bisogno?
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "Solo Luce", icon: "💡", label: "Solo Luce", gradient: "from-blue-400 to-blue-600" },
            { value: "Solo Gas", icon: "🔥", label: "Solo Gas", gradient: "from-green-500 to-green-600" },
            { value: "Luce + Gas (entrambi)", icon: "💡🔥", label: "Luce + Gas", gradient: "from-blue-600 to-green-600" }
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAbitazione(option.value)}
              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                abitazione === option.value 
                  ? `border-transparent bg-gradient-to-br ${option.gradient} text-white shadow-xl transform scale-105` 
                  : 'border-gray-200/60 hover:border-blue-300 text-gray-600 bg-white hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-green-50/50'
              }`}
            >
              <div className="text-3xl mb-2 transition-transform group-hover:scale-110">{option.icon}</div>
              <div className={`text-xs font-bold text-center ${
                abitazione === option.value ? 'text-white' : ''
              }`}>{option.label}</div>
              {abitazione === option.value && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Submit Button */}
      <div className="mt-6">
        <Button 
          type="submit"
          disabled={loading}
          className="group relative w-full bg-gradient-to-r from-blue-600 via-blue-500 to-green-600 !text-white py-4 text-lg font-black rounded-2xl shadow-2xl hover:shadow-green-500/25 transform hover:scale-[1.02] transition-all duration-500 border-0 disabled:opacity-50 overflow-hidden"
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Button Content */}
          <span className="relative z-10">
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span className="animate-pulse text-sm sm:text-base">Calcolo in corso...</span>
              </span>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <span className="text-sm sm:text-lg md:text-xl font-black text-center leading-tight">Scopri subito quanto puoi risparmiare</span>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all group-hover:scale-110">
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )}
          </span>
        </Button>
        
        <div className="text-center mt-3">
          <p className="text-sm font-medium bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            Calcolo istantaneo • 100% gratuito e sicuro
          </p>
        </div>
      </div>
    </form>
  );
}

// --------- Simple Working Quiz ---------
function QuizWizard({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  // Block body scroll when modal is open and handle ESC key
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      alert("Inserisci una email valida");
      return;
    }
    
    setLoading(true);
    try {
      // Create user
      const userResponse = await api.createUser({ email, name: email.split('@')[0] });
      setUserId(userResponse.user.id);
      
      // Start quiz session
      const sessionResponse = await api.startQuizSession(userResponse.user.id);
      setSessionId(sessionResponse.sessionId);
      
      console.log("User created:", userResponse.user.id);
      console.log("Session started:", sessionResponse.sessionId);
      
      setStep(1);
    } catch (error) {
      console.error("Error starting quiz:", error);
      alert("Errore nel salvare i dati. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    console.log("Answer selected:", answer, "Current step:", step);
    setLoading(true);
    
    try {
      // Save answer to backend
      const answerKey = step === 1 ? 'zip' : step === 2 ? 'household_size' : 'service_type';
      await api.saveQuizAnswer({
        sessionId,
        step,
        key: answerKey,
        value: answer
      });
      
      // Update local answers
      setAnswers(prev => ({ ...prev, [answerKey]: answer }));
      
      // Validate postal code if step 1
      if (step === 1) {
        // Basic validation first
        if (!/^\d{5}$/.test(answer)) {
          alert('Inserisci un CAP valido di 5 cifre (es. 10115).');
          setLoading(false);
          return;
        }
        
        try {
          const response = await fetch(`https://openplzapi.org/de/Localities?postalCode=${answer}`, {
            headers: {
              'accept': 'application/json'
            },
            mode: 'cors'
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.length > 0) {
              // Valid German postal code
              console.log(`Valid postal code: ${answer} - ${data[0].name}`);
              setStep(2);
              setLoading(false);
              return;
            } else {
              alert('CAP non trovato nel database tedesco. Inserisci un CAP tedesco valido (es. 10115).');
              setLoading(false);
              return;
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          console.error('Postal code validation error:', error);
          // Fallback: allow any 5-digit code if API fails
          console.log('API failed, allowing postal code:', answer);
          setStep(2);
          setLoading(false);
          return;
        }
      }
      
      // Regular flow for other steps
      if (step < 3) {
        setStep(step + 1);
      } else {
        // Final step - compute offers
        const peopleCount = parseInt(answers.household_size?.charAt(0) || '1');
        const annualKwh = peopleCount * 3500; // Estimate based on household size
        
        const offerResponse = await api.computeOffers({
          zip: answers.zip,
          annual_kwh: annualKwh,
          tariff_preference: answers.service_type
        });
        
        console.log("Offers computed:", offerResponse);
        setStep(4); // Show offers
      }
      
    } catch (error) {
      console.error("Error saving answer:", error);
      alert("Errore nel salvare la risposta. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const resetQuiz = () => {
    console.log("Resetting quiz");
    setStep(0);
    setEmail("");
    setLoading(false);
    setSessionId("");
    setUserId("");
    setAnswers({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="w-full max-w-3xl min-h-[600px] max-h-none sm:max-h-[90vh] rounded-3xl bg-white shadow-2xl my-2 sm:my-0 flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 p-4 sm:p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="text-white">
              <h3 className="text-2xl font-bold">Quiz Smart</h3>
              <p className="text-blue-100 mt-1">Ottieni la tua offerta personalizzata</p>
            </div>
            <button onClick={onClose} aria-label="Chiudi" className="rounded-full p-2 bg-white/20 hover:bg-white/30 !text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col justify-center">

        {/* Step 0: signup */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Sparkles className="h-4 w-4" />
                Veloce e sicuro
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Inizia il tuo percorso</h4>
              <p className="text-gray-600">Bastano 60 secondi per ottenere la tua offerta personalizzata</p>
            </div>
            <form onSubmit={handleStart} className="space-y-6">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="La tua email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-2xl border-2 border-gray-200 px-6 py-4 text-lg outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-blue-600 to-green-600 !text-white hover:from-blue-700 hover:to-green-700 w-full py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all group" type="submit" disabled={loading}>
                {loading ? "Caricamento..." : "Inizia il Quiz"}
                <Play className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-gray-600" />
                <span>Sicuro</span>
              </div>
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                <span>GDPR</span>
              </div>
            </div>
          </div>
        )}

        {/* Steps 1-3: Questions */}
        {step >= 1 && step <= 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Domanda {step} di 3
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">
                {step === 1 && "Qual è il tuo codice postale (CAP)?"}
                {step === 2 && "Quante persone vivono in casa?"}
                {step === 3 && "Di cosa hai bisogno?"}
              </h4>
            </div>
            <div className="grid gap-3 min-h-[200px] content-center" style={{
              gridTemplateColumns: step === 2 ? 'repeat(auto-fit, minmax(200px, 1fr))' : 
                                  step === 3 ? 'repeat(auto-fit, minmax(250px, 1fr))' : 
                                  '1fr'
            }}>
              {step === 1 && (
                <div className="col-span-full">
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                    if (input.value.length === 5) {
                      handleAnswer(input.value);
                    }
                  }} className="space-y-4">
                    <input
                      type="text"
                      placeholder="es. 10115 (Berlino)"
                      maxLength={5}
                      pattern="[0-9]{5}"
                      className="w-full rounded-2xl border-2 border-gray-200 px-6 py-4 text-lg outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-center"
                      onKeyDown={(e) => {
                        // Allow only numbers
                        if (!/[0-9]/.test(e.key) && e.key !== 'Enter' && e.key !== 'Backspace' && e.key !== 'Delete') {
                          e.preventDefault();
                        }
                      }}
                      autoFocus
                      id="postal-code"
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-green-600 to-blue-600 !text-white hover:from-green-700 hover:to-blue-700 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
                      disabled={loading}
                    >
                      {loading ? "Validazione in corso..." : "Continua"}
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </form>
                  <p className="text-sm text-gray-500 mt-2 text-center">Inserisci un CAP tedesco a 5 cifre</p>
                  <div className="text-center mt-3">
                    <div className="inline-flex items-center gap-2 text-xs text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Validazione automatica con database tedesco</span>
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && [
                { label: "1 persona", icon: "1️⃣", value: "1 persona" },
                { label: "2 persone", icon: "2️⃣", value: "2 persone" },
                { label: "3 persone", icon: "3️⃣", value: "3 persone" },
                { label: "4 persone", icon: "4️⃣", value: "4 persone" },
                { label: "5+ persone", icon: "5️⃣", value: "5+ persone" }
              ].map(opt => (
                <Button key={opt.value} className="group bg-white border border-gray-200 hover:border-green-400 hover:bg-green-50 p-4 h-auto text-center transition-all hover:scale-102 hover:shadow-md rounded-xl" onClick={() => handleAnswer(opt.value)} disabled={loading}>
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl">{opt.icon}</div>
                    <span className="text-gray-800 font-medium text-sm">{opt.label}</span>
                  </div>
                </Button>
              ))}
              {step === 3 && [
                { label: "Solo Luce", icon: "💡", value: "Solo Luce", color: "from-yellow-400 to-orange-400" },
                { label: "Solo Gas", icon: "🔥", value: "Solo Gas", color: "from-blue-400 to-blue-500" },
                { label: "Luce + Gas", icon: "", value: "Luce + Gas (entrambi)", color: "from-green-400 to-green-500", isCombo: true }
              ].map(opt => (
                <Button key={opt.value} className={`group bg-gradient-to-br ${opt.color} border-2 border-white/20 hover:border-white/40 hover:shadow-xl p-8 h-auto text-center transition-all hover:scale-105 !text-white`} onClick={() => handleAnswer(opt.value)} disabled={loading}>
                  <div className="flex flex-col items-center justify-center gap-4">
                    {opt.isCombo ? (
                      <div className="flex items-center justify-center gap-2 text-4xl group-hover:scale-110 transition-transform drop-shadow-sm w-20 h-16">
                        <span>💡</span>
                        <span className="text-2xl font-black">+</span>
                        <span>🔥</span>
                      </div>
                    ) : (
                      <div className="text-5xl group-hover:scale-110 transition-transform drop-shadow-sm flex items-center justify-center w-16 h-16">{opt.icon}</div>
                    )}
                    <span className="font-bold text-sm drop-shadow-sm">{opt.label}</span>
                  </div>
                </Button>
              ))}
            </div>
            {loading && (
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                <span className="ml-3 text-gray-600">Elaborazione in corso...</span>
              </div>
            )}
          </div>
        )}

        {/* Offer Comparator */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Check className="h-4 w-4" />
                Offerte personalizzate
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Le migliori offerte per te</h4>
              <p className="text-gray-600">Confronta le tariffe più convenienti basate sui tuoi consumi</p>
            </div>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {[
                { 
                  provider: "Vattenfall", 
                  plan: "Natur Strom", 
                  price: "€42.50", 
                  savings: "€180", 
                  type: "100% Green", 
                  features: ["Energia rinnovabile", "Prezzo fisso 12 mesi", "Nessuna cauzione"],
                  badge: "Più popolare",
                  color: "green"
                },
                { 
                  provider: "E.ON", 
                  plan: "Öko Energy", 
                  price: "€39.90", 
                  savings: "€220", 
                  type: "Eco-friendly", 
                  features: ["Energia verde", "Bonus benvenuto €50", "Cancellazione libera"],
                  badge: "Miglior prezzo",
                  color: "blue"
                },
                { 
                  provider: "Stadtwerke", 
                  plan: "Basic Plus", 
                  price: "€45.20", 
                  savings: "€150", 
                  type: "Standard", 
                  features: ["Fornitore locale", "Servizio clienti 24/7", "Fatturazione mensile"],
                  color: "blue"
                },
                { 
                  provider: "Yello Strom", 
                  plan: "Klima Care", 
                  price: "€41.80", 
                  savings: "€190", 
                  type: "Climate+", 
                  features: ["Compensazione CO2", "App mobile", "Smart meter incluso"],
                  color: "orange"
                },
                { 
                  provider: "EnBW", 
                  plan: "Regional Green", 
                  price: "€43.60", 
                  savings: "€170", 
                  type: "Regional", 
                  features: ["Produzione locale", "Prezzo garantito 24 mesi", "Supporto digitale"],
                  color: "teal"
                }
              ].map((offer, index) => (
                <div key={index} className="relative">
                  {offer.badge && (
                    <div className={`absolute -top-2 left-4 z-10 px-3 py-1 text-xs font-bold text-white rounded-full ${
                      offer.color === 'green' ? 'bg-green-500' : 
                      offer.color === 'blue' ? 'bg-blue-500' : 'bg-orange-500'
                    }`}>
                      {offer.badge}
                    </div>
                  )}
                  <div className={`p-4 border-2 rounded-2xl cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                    offer.badge ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-gray-300'
                  }`} 
                  onClick={() => window.open(`https://example.com/contract/${offer.provider.toLowerCase()}`, '_blank')}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${
                            offer.color === 'green' ? 'bg-green-500' : 
                            offer.color === 'blue' ? 'bg-blue-500' : 
                            offer.color === 'blue' ? 'bg-blue-500' : 
                            offer.color === 'orange' ? 'bg-orange-500' : 
                            'bg-teal-500'
                          }`}></div>
                          <h5 className="font-bold text-gray-900">{offer.provider}</h5>
                          <span className="text-sm text-gray-500">{offer.plan}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            offer.color === 'green' ? 'bg-green-100 text-gray-800' : 
                            offer.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                            offer.color === 'blue' ? 'bg-blue-100 text-blue-700' : 
                            offer.color === 'orange' ? 'bg-orange-100 text-orange-700' : 
                            'bg-teal-100 text-teal-700'
                          }`}>{offer.type}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-2xl font-black text-gray-900">{offer.price}/mese</div>
                            <div className="text-sm text-gray-600 font-semibold">Risparmi {offer.savings}/anno</div>
                          </div>
                          <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                              {offer.features.map((feature, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <Check className="h-3 w-3 text-gray-600" />
                                  <span>{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
                          Scegli
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center pt-4 border-t">
              <Button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-6 text-sm font-semibold rounded-xl" onClick={resetQuiz}>
                Rifai il Quiz
              </Button>
            </div>
          </div>
        )}

        </div>
      </div>
    </div>
  );
}

// --------- MAIN PAGE ---------
export default function Landing() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [comparatorOpen, setComparatorOpen] = useState(false);
  const [comparatorData, setComparatorData] = useState<{cap: string; persone: string; abitazione: string} | null>(null);
  
  const { trackEvent: track } = useAnalytics();

  // Track page visit on component mount
  useEffect(() => {
    track(ANALYTICS_EVENTS.PAGE_VISIT, {
      source: document.referrer ? 'referral' : 'direct',
      userAgent: navigator.userAgent
    });
  }, []);

  // Helper function to handle quiz start with tracking
  const handleQuizStart = (context: string = 'unknown') => {
    track(ANALYTICS_EVENTS.QUIZ_START_CLICK, {
      context,
      timestamp: new Date().toISOString()
    });
    setQuizOpen(true);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const fullName = (formData.get('nome') as string) || '';
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    const data = {
      firstName: firstName,
      lastName: lastName || 'N/A', // Fallback se non c'è cognome
      email: formData.get('email') as string,
      phone: formData.get('telefono') as string,
      city: 'Non specificato',
      notes: formData.get('messaggio') as string,
      source: 'website-form'
    };

    // Track form submission attempt
    track(ANALYTICS_EVENTS.FORM_SUBMIT, {
      formType: 'contact',
      source: 'website-form',
      email: data.email,
      hasPhone: !!data.phone,
      hasNotes: !!data.notes
    });

    try {
      console.log('Sending data:', data);
      
      // Use local API route to avoid CORS issues
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const result = await response.json();
      console.log('Contact form submitted successfully:', result);
      
      // Track successful lead conversion
      track(ANALYTICS_EVENTS.LEAD_CONVERSION, {
        formType: 'contact',
        source: 'website-form',
        leadId: result.lead_id,
        email: data.email,
        conversionTime: new Date().toISOString()
      });
      
      alert('Grazie! Ti contatteremo presto per la tua consulenza gratuita. Il tuo lead è stato registrato con successo!');
      form.reset();
    } catch (error) {
      console.error('Full error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Errore di connessione';
      console.error('Error message:', errorMessage);
      alert(`Errore: ${errorMessage}`);
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const features = [
    { 
      title: "Analisi Completa del Mercato", 
      desc: "Il nostro sistema confronta in tempo reale oltre 150 fornitori energetici tedeschi, analizzando tariffe base, sconti, bonus benvenuto e condizioni contrattuali. Includiamo sia fornitori tradizionali che nuovi operatori green per offrirti sempre la migliore opportunità di risparmio disponibile sul mercato.", 
      icon: Sparkles,
      highlight: "Fino a €850/anno",
      details: ["150+ fornitori monitorati", "Aggiornamenti tariffe in tempo reale", "Analisi bonus e promozioni", "Confronto energia verde e tradizionale"]
    },
    { 
      title: "Gestione Completa del Cambio", 
      desc: "Non dovrai mai preoccuparti della burocrazia. Il nostro team si occupa della disdetta del vecchio contratto rispettando i tempi di preavviso, gestisce tutta la documentazione necessaria, coordina l'attivazione del nuovo fornitore e monitora l'intero processo fino al completamento. Riceverai aggiornamenti costanti via email e SMS.", 
      icon: Check,
      highlight: "100% Gratuito",
      details: ["Disdetta automatica contratto precedente", "Gestione documenti e comunicazioni", "Coordinamento attivazione nuovo fornitore", "Assistenza dedicata durante il cambio"]
    },
    { 
      title: "Protezione Totale del Prezzo", 
      desc: "Ti garantiamo il prezzo concordato per 24 mesi senza variazioni unilaterali. In caso di aumento delle tariffe di mercato, il tuo prezzo rimane fisso. Se invece i prezzi dovessero scendere, ti offriamo la possibilità di rinegoziare per ottenere condizioni ancora più vantaggiose. Monitoriamo costantemente il mercato per te.", 
      icon: FileText,
      highlight: "Prezzo bloccato 24 mesi",
      details: ["Garanzia prezzo fisso 24 mesi", "Protezione da aumenti di mercato", "Rinegoziazione in caso di ribassi", "Monitoraggio mercato continuo"]
    },
  ];

  const faqs = [
    { q: "Quanto dura il processo di cambio fornitore?", a: "Il cambio fornitore dura 3-6 settimane. Dal 2025, grazie alla nuova legge tedesca, il cambio tecnico sarà completato entro 24 ore lavorative." },
    { q: "La corrente si interrompe durante il cambio?", a: "Mai. La fornitura elettrica è garantita per legge in Germania. Non sono necessarie modifiche al contatore o alle linee elettriche." },
    { q: "Che garanzie ho sul prezzo?", a: "Offriamo garanzia prezzo fino a 24 mesi. Se trovi lo stesso contratto più economico altrove, rimborsiamo la differenza (max €100 per 24 mesi)." },
    { q: "Chi si occupa della disdetta del vecchio contratto?", a: "Ce ne occupiamo noi gratuitamente. Il nostro servizio di disdetta esclusivo gestisce tutta la burocrazia, garantendo che il vecchio contratto venga cancellato nei tempi giusti." },
    { q: "Che succede se cambi idea?", a: "Hai 14 giorni per recedere dal nuovo contratto senza penali. Inoltre, garantiamo una disdetta legalmente valida del vecchio contratto." },
    { q: "Come fate a garantire il prezzo più basso?", a: "Il nostro sistema monitora oltre 150 fornitori in tempo reale, analizzando non solo il prezzo base ma anche bonus benvenuto, sconti e tutte le condizioni contrattuali." },
  ];

  return (
    <div className="min-h-screen text-gray-900">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-white backdrop-blur-md border-b border-gray-100/50 shadow-sm">
        <Container className="flex h-16 items-center justify-between">
          <a href="#" className="flex items-center gap-2 hover:scale-105 transition-transform -ml-2.5">
            <img src="/logo.png" alt="Switchfy" className="h-12 w-auto md:h-14" />
          </a>
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#come-funziona" className="text-gray-700 hover:text-gray-700 font-medium transition-colors relative group">
              Come funziona
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 group-hover:w-full transition-all"></span>
            </a>
            <a href="#faq" className="text-gray-700 hover:text-gray-700 font-medium transition-colors relative group">
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 group-hover:w-full transition-all"></span>
            </a>
            <a href="#legal" className="text-gray-700 hover:text-gray-700 font-medium transition-colors relative group">
              Privacy & Impressum
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 group-hover:w-full transition-all"></span>
            </a>
            <Button className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-6 py-2.5 font-semibold shadow-md hover:shadow-lg transform hover:scale-105 transition-all" onClick={() => handleQuizStart('header')}>
              Inizia il quiz
            </Button>
          </nav>
          <Button className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-4 py-2 font-semibold shadow-md md:hidden" onClick={() => setQuizOpen(true)}>
            Quiz
          </Button>
        </Container>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden py-8 md:py-12 min-h-screen flex items-center">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay
            muted 
            loop 
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            <source src="/mulini.mp4" type="video/mp4" />
          </video>
          {/* Subtle dark overlay only for text readability */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        <Container className="relative z-10 grid items-center gap-6 md:gap-8 md:grid-cols-2 w-full">
          <div className="space-y-4 md:space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md px-4 py-2 text-sm font-medium text-blue-700 shadow-lg border border-white/30">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-full animate-pulse"></div>
              Digitale • Veloce • Trasparente
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-4 leading-tight">
                <span className="text-white drop-shadow-2xl">
                  Taglia la tua 
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-200 via-green-200 to-blue-200 bg-clip-text text-transparent drop-shadow-2xl">
                  bolletta
                </span>
                <br />
                <span className="text-white/90 drop-shadow-2xl text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                  in 60 secondi
                </span>
              </h1>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-1 w-20 bg-gradient-to-r bg-blue-500 rounded-full"></div>
                <div className="h-1 w-8 bg-white/50 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-lg md:text-xl text-white/95 drop-shadow-lg leading-relaxed mb-4 md:mb-6 max-w-3xl">
              <strong className="text-white">Stop alle bollette che succhiano il portafoglio.</strong><br />
              Rispondi a poche domande, ricevi la tua offerta personalizzata e firma online senza stress.
            </h2>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm md:text-lg text-white/95 mb-4 md:mb-6">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-300" />
                <span className="font-semibold">Gratis</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="font-semibold">Nessun impegno</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-300" />
                <span className="font-semibold">Conformità GDPR Germania</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button className="group bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all rounded-2xl border border-white/20" onClick={() => handleQuizStart('hero_main')}>
                <span className="flex items-center gap-2">
                  Inizia il Quiz
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </span>
              </Button>
              <Button className="bg-white/10 backdrop-blur border-2 border-white/30 hover:bg-white/20 hover:border-white/40 !text-white px-4 sm:px-8 py-3 sm:py-5 text-base sm:text-lg font-semibold rounded-2xl transition-all" onClick={() => document.getElementById("come-funziona")?.scrollIntoView({ behavior: 'smooth' })}>
                <span className="flex items-center gap-2">
                  Come funziona
                  <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                </span>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-green-400/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-400/30">
                <Check className="h-4 w-4 text-green-300" />
                <span className="text-white/90 font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-blue-400/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
                <Shield className="h-4 w-4 text-blue-300" />
                <span className="text-white/90 font-medium">100% Sicuro</span>
              </div>
            </div>
          </div>
          <div className="relative">
            {/* Enhanced Quiz Card */}
            <div className="relative group">
              {/* Animated Background Glow - Brand Colors */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-green-400 to-blue-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-all duration-700 animate-pulse"></div>
              
              {/* Main Card */}
              <div className="relative bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 overflow-hidden">
                {/* Animated Background Pattern - Brand Colors */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/90 via-green-50/70 to-blue-100/50"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-300/20 to-transparent rounded-full"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-300/20 to-transparent rounded-full"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-5 md:p-7">
                  {/* Enhanced Header with Marketing Copy */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100/80 to-blue-100/80 backdrop-blur-sm border border-green-300/30 px-4 py-2 rounded-full mb-5 shadow-sm">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        RISPARMIO GARANTITO
                      </span>
                    </div>
                  </div>

                  {/* Enhanced Quiz Form */}
                  <QuickQuizForm onShowComparator={(data) => {
                    setComparatorData(data);
                    setComparatorOpen(true);
                  }} />
                  
                  {/* Benefits at bottom */}
                  <div className="mt-4 pt-3 border-t border-gray-200/30">
                    <p className="text-center text-xs font-medium leading-relaxed text-gray-600">
                      <span className="text-gray-600">✓ Fino a €850 all'anno</span> • <span className="text-gray-700">✓ Cambio automatico</span> • <span className="text-gray-600">✓ Zero burocrazia</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Come funziona */}
      <section id="come-funziona" className="py-16 md:py-20">
        <Container>
          <SectionTitle k="Come funziona" title="⚡ Dal quiz alla firma: zero burocrazia, solo risparmio" subtitle="Il modo più semplice per tagliare le bollette luce e gas in Germania" />
          
          {/* Enhanced Stats Section */}
          <div className="grid gap-6 md:grid-cols-4 mb-16">
            <Card className="text-center border-0 bg-white backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <span className="text-white font-black text-2xl ">€</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">€850</div>
                <p className="text-sm text-gray-800 font-bold mb-1">Risparmio Medio Annuo</p>
                <p className="text-xs text-gray-700 font-semibold">vs. fornitore di base</p>
                <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full w-4/5 transition-all duration-1000 group-hover:w-full"></div>
                </div>
              </div>
            </Card>

            <Card className="text-center border-0 bg-white backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <Sparkles className="h-8 w-8 text-white " />
                </div>
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">150+</div>
                <p className="text-sm text-gray-800 font-bold mb-1">Fornitori Analizzati</p>
                <p className="text-xs text-gray-600 font-semibold">aggiornamenti in tempo reale</p>
                <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-full"></div>
                </div>
              </div>
            </Card>

            <Card className="text-center border-0 bg-white backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <span className="text-white font-black text-lg ">60s</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">Veloce</div>
                <p className="text-sm text-gray-800 font-bold mb-1">Quiz Completo</p>
                <p className="text-xs text-gray-700 font-semibold">risultato istantaneo</p>
                <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full w-3/5 transition-all duration-1000 group-hover:w-full"></div>
                </div>
              </div>
            </Card>

            <Card className="text-center border-0 bg-white backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group relative overflow-hidden">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 relative overflow-hidden">
                  <Check className="h-8 w-8 text-white " />
                </div>
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">0€</div>
                <p className="text-sm text-gray-800 font-bold mb-1">Servizio Gratuito</p>
                <p className="text-xs text-gray-600 font-semibold">nessun costo nascosto</p>
                <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-blue-500 rounded-full w-full"></div>
                </div>
              </div>
            </Card>
          </div>

          {/* Why Choose Us Section */}
          <Card className="border-0 bg-white backdrop-blur-sm p-6 mb-12 shadow-lg">
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/50 to-green-100/50 px-3 py-1.5 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Perché Switchfy
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">I nostri vantaggi</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="h-3 w-3 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Esperti del mercato energetico tedesco</p>
                      <p className="text-gray-600 text-xs">Il nostro team conosce ogni fornitore, tariffa e regolamentazione</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Sparkles className="h-3 w-3 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Algoritmo proprietario di confronto</p>
                      <p className="text-gray-600 text-xs">Analizziamo non solo il prezzo base ma anche bonus, sconti e condizioni</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <Shield className="h-3 w-3 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Assistenza dedicata in italiano</p>
                      <p className="text-gray-600 text-xs">Supporto personalizzato per la comunità italiana in Germania</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="/famiglia-seduta-sul-prato.jpg" 
                    alt="Happy family saving on energy bills" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-semibold">500+ Famiglie Soddisfatte</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Unisciti a migliaia di clienti felici</h3>
                    <p className="text-sm text-white/90">Famiglie italiane in Germania risparmiano €650 l'anno</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Main Features */}
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {features.map((f, i) => (
              <Card key={i} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-white backdrop-blur-sm p-5 shadow-lg relative">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-100/50 to-green-100/50">
                      <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                        {f.highlight}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <div className="h-0.5 w-12 rounded-full mb-3 bg-gradient-to-r from-blue-600 to-green-600"></div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.desc}</p>
                
                {/* Detailed Features List */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-900 mb-2">Include:</p>
                  <ul className="space-y-1.5">
                    {f.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                        <div className="w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <Check className="h-2 w-2 text-gray-700" />
                        </div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs font-medium bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Step {i + 1}</span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-700 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>

          {/* Process Steps - Enhanced Professional Version */}
          <div className="relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 rounded-3xl"></div>
            
            <Card className="border-0 bg-white backdrop-blur-sm p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/50 to-green-100/50 px-4 py-2 rounded-full mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    🚀 Processo Semplificato
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Risparmia in <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">3 semplici passi</span>
                </h3>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Dal quiz alle bollette più leggere: il nostro processo è pensato per essere veloce, sicuro e completamente automatizzato
                </p>
              </div>

              {/* Main Process Steps */}
              <div className="grid gap-8 md:gap-12 md:grid-cols-3 mb-8">
                {/* Step 1 */}
                <div className="relative group">
                  <div className="text-center">
                    {/* Step Number Badge */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-black text-xl">1</span>
                        </div>
                      </div>
                      {/* Connection line for desktop */}
                      <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-blue-300 to-green-300"></div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="bg-white backdrop-blur-sm p-6 rounded-2xl border border-blue-50/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Rispondi a 5 domande</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Ti chiediamo solo l'essenziale: quanto spendi per luce e gas, che tipo di contratti hai, e stop.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-700 font-semibold">
                        <Sparkles className="h-4 w-4" />
                        <span>Solo l'essenziale</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative group">
                  <div className="text-center">
                    {/* Step Number Badge */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-black text-xl">2</span>
                        </div>
                      </div>
                      {/* Connection line for desktop */}
                      <div className="hidden md:block absolute top-10 -right-6 w-12 h-0.5 bg-gradient-to-r from-green-300 to-blue-300"></div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="bg-white backdrop-blur-sm p-6 rounded-2xl border border-green-50/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Ricevi l'offerta su misura</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Algoritmo + partner affidabili → offerta costruita sul tuo consumo, non su statistiche generiche.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-semibold">
                        <Check className="h-4 w-4" />
                        <span>Su misura per te</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative group">
                  <div className="text-center">
                    {/* Step Number Badge */}
                    <div className="relative mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                          <span className="text-white font-black text-xl">3</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Step Content */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-100/50 shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <h4 className="text-xl font-bold text-gray-900 mb-3">Firma digitale</h4>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        Dimentica fax, raccomandate e call center. Con Switchfy firmi online e sei operativo in pochi minuti.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-700 font-semibold">
                        <Shield className="h-4 w-4" />
                        <span>100% digitale</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-gradient-to-r from-blue-50/80 via-green-50/60 to-blue-50/80 p-8 rounded-2xl border border-blue-100/30 mb-8">
                <h4 className="text-center text-lg font-bold text-gray-900 mb-6">Perché scegliere il nostro processo?</h4>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2">Sicurezza Garantita</h5>
                    <p className="text-sm text-gray-600">Crittografia bancaria, dati protetti secondo GDPR, zero rischi</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Check className="h-6 w-6 text-white" />
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2">Fornitura Continua</h5>
                    <p className="text-sm text-gray-600">La corrente non si interrompe mai durante il cambio, garantito per legge</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h5 className="font-bold text-gray-900 mb-2">Trasparenza Totale</h5>
                    <p className="text-sm text-gray-600">Ogni costo è chiaramente indicato, nessuna sorpresa in bolletta</p>
                  </div>
                </div>
              </div>

              {/* Final CTA */}
              <div className="text-center">
                <Button className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-12 py-5 text-xl font-black shadow-2xl hover:shadow-3xl transform hover:scale-[1.05] transition-all rounded-2xl border-2 border-white/20 group" onClick={() => setQuizOpen(true)}>
                  <span className="flex items-center gap-3">
                    INIZIA ORA IL TUO RISPARMIO
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </span>
                </Button>
                <div className="mt-6 flex flex-wrap justify-center items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-gray-600" />
                    </div>
                    <span>Gratuito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Shield className="h-2.5 w-2.5 text-gray-700" />
                    </div>
                    <span>Senza impegno</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Sparkles className="h-2.5 w-2.5 text-gray-600" />
                    </div>
                    <span>5.000+ clienti soddisfatti</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Garanzie Section - New */}
          <div className="mt-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/50 to-green-100/50 px-3 py-1.5 rounded-full mb-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Le Nostre Garanzie
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sicurezza e trasparenza</h3>
              <p className="text-gray-600 text-sm">In ogni aspetto del servizio</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column - Garanzie Principali */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Garanzie di Sicurezza</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Fornitura Garantita per Legge</p>
                      <p className="text-gray-600 text-xs">La corrente non si interrompe mai durante il cambio fornitore. È garantito dalla legge tedesca.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Disdetta Garantita Legalmente</p>
                      <p className="text-gray-600 text-xs">Garantiamo una disdetta legalmente valida del vecchio contratto, senza rischi per te.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Diritto di Recesso 14 Giorni</p>
                      <p className="text-gray-600 text-xs">Puoi cambiare idea entro 14 giorni senza penali o costi aggiuntivi.</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Right Column - Garanzie Prezzo */}
              <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Garanzie di Prezzo</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Garanzia Prezzo Fisso 24 Mesi</p>
                      <p className="text-gray-600 text-xs">Il prezzo concordato rimane bloccato per 24 mesi, protetto da aumenti di mercato.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Rimborso Differenza Prezzo</p>
                      <p className="text-gray-600 text-xs">Se trovi lo stesso contratto più economico, rimborsiamo la differenza (max €100 per 24 mesi).</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                      <Check className="h-2.5 w-2.5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Condizioni Contrattuali Chiare</p>
                      <p className="text-gray-600 text-xs">Max 12 mesi di durata, max 6 settimane preavviso disdetta, rinnovo automatico max 12 mesi.</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Timeline 2025 Innovation */}
            <Card className="mt-8 border-0 bg-gradient-to-r from-blue-50/80 via-green-50/60 to-blue-50/80 p-8 shadow-lg">
              <div className="text-center mb-6">
                <h4 className="text-2xl font-bold text-blue-700 mb-2">🚀 Novità 2025: Cambio Fornitore in 24 Ore</h4>
                <p className="text-gray-700">Dal 6 giugno 2025, nuova legge tedesca per cambio fornitore ultra-rapido</p>
              </div>
              <div className="grid gap-6 md:grid-cols-3 text-center">
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-gray-600 mb-2">Prima</div>
                  <p className="text-gray-700 text-sm">3-6 settimane per il cambio tecnico</p>
                </div>
                <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl border-2 border-blue-300 shadow-lg">
                  <div className="text-2xl font-bold text-gray-700 mb-2">Dal 2025</div>
                  <p className="text-gray-800 text-sm font-semibold">24 ore lavorative massimo!</p>
                </div>
                <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-sm">
                  <div className="text-2xl font-bold text-gray-600 mb-2">Risultato</div>
                  <p className="text-gray-700 text-sm">Più velocità e trasparenza</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Quiz Teaser - Interactive CRO Section */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Main Quiz Teaser Card */}
            <Card className="border-0 bg-white/90 backdrop-blur-sm shadow-2xl p-8 md:p-12 relative z-10 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-green-50/30 to-blue-50/50"></div>
              
              <div className="relative z-10 grid lg:grid-cols-5 gap-8 items-center">
                <div className="lg:col-span-3 text-center lg:text-left">
                  {/* Header */}
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/50 to-green-100/50 px-4 py-2 rounded-full mb-6">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                      ⚡ Quiz Veloce - Inizia Subito
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                    Quanto spendi al mese per luce e gas?
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Scegli la tua fascia di spesa energetica e inizia subito il percorso di risparmio
                  </p>

                  {/* Interactive Quiz Buttons */}
                  <div className="grid gap-4 md:grid-cols-3 mb-8">
                  <Button 
                    className="group bg-white border-3 border-blue-200 hover:border-blue-500 hover:bg-blue-50 p-6 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => setQuizOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-700 mb-2">&lt; €50</div>
                      <p className="text-sm text-gray-700 font-medium">Consumo Basso</p>
                      <div className="w-full h-1 bg-blue-200 rounded-full mt-3">
                        <div className="w-1/3 h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    className="group bg-white border-3 border-green-200 hover:border-green-500 hover:bg-green-50 p-6 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg relative"
                    onClick={() => setQuizOpen(true)}
                  >
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-400 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      PIÙ COMUNE
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-600 mb-2">€50-100</div>
                      <p className="text-sm text-gray-700 font-medium">Consumo Medio</p>
                      <div className="w-full h-1 bg-green-200 rounded-full mt-3">
                        <div className="w-2/3 h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </Button>

                  <Button 
                    className="group bg-white border-3 border-blue-200 hover:border-blue-500 hover:bg-blue-50 p-6 h-auto transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    onClick={() => setQuizOpen(true)}
                  >
                    <div className="text-center">
                      <div className="text-2xl font-black text-gray-700 mb-2">&gt; €100</div>
                      <p className="text-sm text-gray-700 font-medium">Consumo Alto</p>
                      <div className="w-full h-1 bg-blue-200 rounded-full mt-3">
                        <div className="w-full h-full bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></div>
                      </div>
                    </div>
                  </Button>
                </div>

                {/* Trust Elements */}
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-gray-600" />
                    <span>100% Gratuito</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span>Senza Impegno</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gray-600" />
                    <span>60 Secondi</span>
                  </div>
                </div>

                  {/* Main CTA */}
                  <Button 
                  className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-8 py-4 text-lg font-bold shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-all duration-300 rounded-2xl border-0"
                  onClick={() => setQuizOpen(true)}
                >
                  <span className="flex items-center gap-3">
                    Scopri il Tuo Risparmio Ora
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </span>
                </Button>

                  {/* Bottom Social Proof */}
                  <div className="mt-6 flex items-center justify-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gradient-to-r bg-blue-500 rounded-full mr-1 flex items-center justify-center">
                        <span className="text-white text-xs">★</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700">5.000+ clienti soddisfatti</span>
                </div>
                </div>
                
                {/* Right side - Image */}
                <div className="lg:col-span-2">
                  <div className="relative">
                    <img 
                      src="/primo-piano-donna-che-usa-il-telecomando.jpg" 
                      alt="Woman using remote control" 
                      className="w-auto h-auto max-w-full max-h-full rounded-xl shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Lead Generation Card */}
      <section className="py-12 md:py-16">
        <Container>
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-5 items-stretch">
              {/* Left side - Image */}
              <div className="lg:col-span-2 relative h-64 lg:h-full min-h-[400px]">
                <img 
                  src="/ale.png" 
                  alt="Alessandra - Energy Consultant" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              
              {/* Right side - Contact Form */}
              <div className="lg:col-span-3 p-6 lg:p-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/50 to-green-100/50 px-3 py-1.5 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                    Consulenza Personalizzata
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Parliamo di persona del tuo contratto
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hai domande specifiche o vuoi una consulenza personalizzata? Alessandra, la nostra energy consultant, 
                  ti aiuterà a trovare la soluzione perfetta per le tue esigenze di luce e gas.
                </p>

                {/* Contact Form */}
                <form className="space-y-4" onSubmit={handleContactSubmit}>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <input
                        type="text"
                        name="nome"
                        placeholder="Il tuo nome"
                        required
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        name="email"
                        placeholder="La tua email"
                        required
                        className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      name="telefono"
                      placeholder="Il tuo telefono (opzionale)"
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      name="messaggio"
                      placeholder="Raccontaci brevemente le tue esigenze energetiche..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none text-sm"
                    ></textarea>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isSubmittingContact}
                    className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-6 py-4 text-base font-semibold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmittingContact ? 'Invio in corso...' : 'Richiedi Consulenza Gratuita'}
                      <ChevronRight className={`h-4 w-4 ${isSubmittingContact ? 'animate-spin' : ''}`} />
                    </span>
                  </Button>
                </form>

                <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-gradient-to-br from-blue-50/80 to-green-50/80 rounded-xl border border-blue-100/50">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Check className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Consulenza gratuita</span>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-50/80 to-green-50/80 rounded-xl border border-blue-100/50">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Sparkles className="h-3 w-3 text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Analisi personalizzata</span>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-blue-50/80 to-green-50/80 rounded-xl border border-blue-100/50">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="h-3 w-3 text-gray-700" />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">Supporto completo</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gradient-to-r from-blue-50/80 to-green-50/80 rounded-xl border border-blue-100/50">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-3 h-3 bg-gradient-to-r bg-blue-500 rounded-full mr-1 flex items-center justify-center">
                          <span className="text-white text-xs">★</span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      "Grazie ad Alessandra ho risparmiato €600 l'anno!" - <strong>Maria R.</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Container>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-blue-50/20 to-green-50/20">
        <Container>
          <div className="text-center mb-12">
            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm text-gray-600">
              <span className="inline-flex h-2 w-2 rounded-full bg-black" /> Il nostro team
            </div>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Esperti di energia al tuo servizio
            </h2>
            <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
              Professionisti specializzati nel mercato energetico tedesco, pronti ad aiutarti a risparmiare
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
            {/* Alessandra Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
              {/* Photo Section - Takes up entire top half */}
              <div className="h-64 flex items-center justify-center p-4 bg-gradient-to-br from-blue-50/20 to-white">
                <div className="w-60 h-60 relative">
                  <img 
                    src="/ale.png" 
                    alt="Alessandra - Energy Consultant" 
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                    style={{objectPosition: 'center -20px'}}
                  />
                </div>
              </div>
              {/* Content Section - Bottom half */}
              <div className="p-6 text-center flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Alessandra</h3>
                <p className="text-sm text-gray-700 font-semibold mb-3">Energy Consultant</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Esperta del mercato energetico tedesco con oltre 5 anni di esperienza. 
                  Ha aiutato migliaia di famiglie italiane a trovare le migliori tariffe energia.
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gradient-to-r bg-blue-500 rounded-full">
                        <span className="text-white text-xs flex items-center justify-center">★</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">4.9/5 recensioni</span>
                </div>
              </div>
            </Card>

            {/* Calogero Card */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
              {/* Photo Section - Takes up entire top half */}
              <div className="h-64 flex items-center justify-center p-4 bg-gradient-to-br from-green-50/20 to-white">
                <div className="w-60 h-60 relative">
                  <img 
                    src="/calogero.png" 
                    alt="Calogero - Founder & CEO" 
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl"
                    style={{objectPosition: '-60px center'}}
                  />
                </div>
              </div>
              {/* Content Section - Bottom half */}
              <div className="p-6 text-center flex flex-col justify-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Calogero</h3>
                <p className="text-sm text-gray-700 font-semibold mb-3">Founder & CEO</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Fondatore di Switchfy, vive in Germania da anni e conosce perfettamente 
                  le sfide degli italiani nel mercato energetico tedesco. La sua missione: semplificare il risparmio.
                </p>
                <div className="mt-4 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-gradient-to-r bg-blue-500 rounded-full">
                        <span className="text-white text-xs flex items-center justify-center">★</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm text-gray-700 font-medium">500+ clienti aiutati</span>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Testimonianze */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100/50 to-green-100/50 px-3 py-1.5 rounded-full mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                Testimonianze
              </span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Cosa dicono i nostri clienti</h2>
            <p className="text-gray-600">Oltre 5.000 famiglie hanno già risparmiato con Switchfy</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mb-8">
            {/* Testimonianza 1 */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-6 group hover:shadow-xl transition-all duration-300 relative">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "Grazie ad Alessandra e al team di Switchfy ho finalmente capito come funziona il mercato energetico tedesco. 
                Mi hanno seguito passo passo e ora risparmio €850 l'anno sulla bolletta!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MR</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Maria Rossi</p>
                  <p className="text-sm text-gray-600">Famiglia di 4 persone · Monaco</p>
                </div>
              </div>
            </Card>

            {/* Testimonianza 2 */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-6 group hover:shadow-xl transition-all duration-300 relative">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "Il servizio è incredibile! Non ho dovuto preoccuparmi di nulla, hanno gestito tutto loro. 
                Risparmio oltre €600 l'anno e ho energia 100% verde. Consigliatissimo!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LC</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Luca Conti</p>
                  <p className="text-sm text-gray-600">Single · Berlino</p>
                </div>
              </div>
            </Card>

            {/* Testimonianza 3 */}
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-6 group hover:shadow-xl transition-all duration-300 relative">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "Avevo paura di cambiare fornitore, ma con Switchfy è stato semplicissimo. 
                Il supporto in italiano è fantastico e ora pago il 40% in meno. Grazie!"
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AF</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Anna Ferrari</p>
                  <p className="text-sm text-gray-600">Coppia · Francoforte</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Row */}
          <div className="grid gap-6 md:grid-cols-4 mb-8">
            <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-green-50/80 backdrop-blur-sm p-4 text-center shadow-lg">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">5.000+</div>
              <p className="text-sm text-gray-700 font-medium">Clienti soddisfatti</p>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-green-50/80 backdrop-blur-sm p-4 text-center shadow-lg">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">€650</div>
              <p className="text-sm text-gray-700 font-medium">Risparmio medio annuo</p>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-green-50/80 backdrop-blur-sm p-4 text-center shadow-lg">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">4.8/5</div>
              <p className="text-sm text-gray-700 font-medium">Rating medio</p>
            </Card>
            <Card className="border-0 bg-gradient-to-br from-blue-50/80 to-green-50/80 backdrop-blur-sm p-4 text-center shadow-lg">
              <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">98%</div>
              <p className="text-sm text-gray-700 font-medium">Raccomandano Switchfy</p>
            </Card>
          </div>

          {/* More Testimonials Row */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-0 bg-white/60 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                "Servizio eccezionale, risparmio €400 l'anno!"
              </p>
              <p className="text-xs font-semibold text-gray-900">Marco B. - Amburgo</p>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                "Zero stress, tutto gestito perfettamente!"
              </p>
              <p className="text-xs font-semibold text-gray-900">Sofia M. - Colonia</p>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                "Finalmente energia verde a prezzo basso!"
              </p>
              <p className="text-xs font-semibold text-gray-900">Giuseppe R. - Stoccarda</p>
            </Card>

            <Card className="border-0 bg-white/60 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-3 h-3 bg-gradient-to-r bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">★</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-700 mb-3 leading-relaxed">
                "Supporto in italiano fantastico!"
              </p>
              <p className="text-xs font-semibold text-gray-900">Elena T. - Düsseldorf</p>
            </Card>
          </div>

          {/* Strong CTA dopo testimonials */}
          <div className="mt-12 text-center">
            <Card className="border-0 bg-gradient-to-br from-blue-100/80 via-green-100/60 to-blue-100/80 backdrop-blur-sm shadow-2xl p-8 md:p-12 max-w-6xl mx-auto relative z-10 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-green-50/30"></div>
              
              <div className="relative z-10 grid lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-6">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    🔥 Unisciti a 5.000+ clienti soddisfatti
                  </span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                  Sei pronto a risparmiare <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">€650 l'anno?</span>
                </h2>
                <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Più di 5.000 famiglie italiane in Germania stanno già risparmiando centinaia di euro ogni anno. 
                  <strong className="text-gray-600"> Il tuo quiz ti aspetta.</strong>
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
                  <Button 
                    className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-10 py-5 text-xl font-black shadow-2xl hover:shadow-3xl transform hover:scale-[1.05] transition-all rounded-2xl border-2 border-white/20"
                    onClick={() => setQuizOpen(true)}
                  >
                    <span className="flex items-center gap-3">
                      <span className="!text-white">INIZIA IL QUIZ ORA</span>
                      <div className="w-7 h-7 bg-white/30 rounded-full flex items-center justify-center">
                        <ChevronRight className="h-5 w-5" />
                      </div>
                    </span>
                  </Button>
                </div>

                {/* Social proof numeri */}
                <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto text-center">
                  <div>
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">€650</div>
                    <p className="text-xs text-gray-600 font-medium">Risparmio medio</p>
                  </div>
                  <div>
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">60sec</div>
                    <p className="text-xs text-gray-600 font-medium">Tempo quiz</p>
                  </div>
                  <div>
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">5.000+</div>
                    <p className="text-xs text-gray-600 font-medium">Clienti felici</p>
                  </div>
                </div>
                </div>
                
                {/* Right side - Image */}
                <div className="lg:col-span-1">
                  <div className="relative">
                    <img 
                      src="/donna-di-smiley.jpg" 
                      alt="Happy woman smiling" 
                      className="w-full h-80 lg:h-96 object-cover rounded-2xl shadow-xl"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 md:py-16">
        <Container>
          <SectionTitle k="FAQ" title="Domande frequenti" subtitle="Tutto quello che devi sapere" />
          <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
            {faqs.map((f, i) => (
              <Card key={i} className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm p-5 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xs">{i + 1}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">{f.q}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{f.a}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* Legal */}
      <section id="legal" className="py-12 md:py-16">
        <Container>
          <SectionTitle k="GDPR DE" title="Privacy & Impressum" subtitle="Conformità europea e trasparenza totale" />
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Privacy Policy</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">
                Raccogliamo dati minimi per fornire il servizio. Puoi richiedere accesso, rettifica o cancellazione
                scrivendo a privacy@switchfy.de. Base legale: art. 6(1)(b) GDPR (esecuzione del contratto).
              </p>
              <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200/50">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-gray-600" />
                  </div>
                  <p className="text-xs text-gray-800 font-medium">Conforme GDPR 2024</p>
                </div>
              </div>
            </Card>
            <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Impressum</h3>
              </div>
              <div className="text-gray-600 leading-relaxed space-y-2 text-sm">
                <p><strong className="text-gray-900">Switchfy GmbH</strong></p>
                <p>Musterstraße 1, 51145 Köln</p>
                <p>HRB 123456 · USt-IdNr: DE123456789</p>
                <p>Geschäftsführer: Calogero Massaro</p>
                <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200/50">
                  <p className="text-xs font-medium bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">Email: hallo@switchfy.de</p>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/gas.jpg" 
            alt="Energy future background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <Container className="relative z-10">
          <div className="text-center text-white relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <span className="text-sm font-bold">
                ⚡ Ultima possibilità di risparmiare
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Sei pronto a risparmiare?<br />
              <span className="text-white">Il tuo quiz ti aspetta.</span>
            </h2>

            <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
              Non perdere l'opportunità di unirti a migliaia di famiglie che risparmiano ogni anno. 
              <strong>Il quiz richiede solo 60 secondi.</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button 
                className="bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 !text-white hover:from-blue-700 hover:via-blue-600 hover:to-green-600 px-12 py-6 text-2xl font-black shadow-2xl hover:shadow-3xl transform hover:scale-[1.05] transition-all rounded-2xl border-0"
                onClick={() => setQuizOpen(true)}
              >
                <span className="flex items-center gap-4">
                  🚀 <span className="!text-white">INIZIA IL QUIZ ORA</span>
                  <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </span>
              </Button>
            </div>

            {/* Social proof finale */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/90">
              <div className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-300" />
                <span className="font-medium">100% Gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-300" />
                <span className="font-medium">Senza Impegno</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-300" />
                <span className="font-medium">60 Secondi</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-green-400 rounded-full mr-1 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">★</span>
                    </div>
                  ))}
                </div>
                <span className="font-medium">5.000+ Clienti Felici</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <Container>
          <div className="grid gap-6 md:grid-cols-4 relative">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="Switchfy" className="h-8 w-auto" />
              </div>
              <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                La piattaforma digitale che semplifica energia e assicurazioni. 
                Zero burocrazia, massima trasparenza.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 rounded-xl flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-green-600 rounded-xl flex items-center justify-center transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Prodotto</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#come-funziona" className="hover:text-white transition-colors text-sm">Come funziona</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors text-sm">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Prezzi</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-base mb-3">Legale</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#legal" className="hover:text-white transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#legal" className="hover:text-white transition-colors text-sm">Impressum</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Termini di servizio</a></li>
                <li><a href="#" className="hover:text-white transition-colors text-sm">Contatti</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Switchfy GmbH. Tutti i diritti riservati.</p>
            <div className="flex items-center gap-4 mt-3 md:mt-0">
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <Shield className="h-2.5 w-2.5 text-gray-600" />
                </div>
                <span className="text-xs">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-blue-500" />
                </div>
                <span className="text-xs">Made in Germany</span>
              </div>
            </div>
          </div>
        </Container>
      </footer>

      {quizOpen && <QuizWizard onClose={() => setQuizOpen(false)} />}
      
      <ComparisonPopup 
        isOpen={comparatorOpen}
        onClose={() => setComparatorOpen(false)}
        data={comparatorData}
      />
    </div>
  );
}