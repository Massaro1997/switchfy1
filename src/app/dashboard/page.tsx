'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

// Dashboard principale con tutte le funzionalità
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Energy Switch Dashboard</h1>
          <p className="mt-2 text-gray-600">Gestisci leads, clienti, contratti e analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'leads', name: 'Leads', icon: '👥' },
              { id: 'clients', name: 'Clienti', icon: '🏢' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'financial', name: 'Finanze', icon: '💰' },
              { id: 'marketing', name: 'Marketing', icon: '📢' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewSection />}
          {activeTab === 'leads' && <LeadsSection />}
          {activeTab === 'clients' && <ClientsSection />}
          {activeTab === 'analytics' && <AnalyticsSection />}
          {activeTab === 'financial' && <FinancialSection />}
          {activeTab === 'marketing' && <MarketingSection />}
        </div>
      </div>
    </div>
  );
}

// Sezioni individuali
function OverviewSection() {
  const [stats, setStats] = useState({
    leads: 0,
    conversions: 0,
    revenue: 0,
    clients: 0
  });

  useEffect(() => {
    // Carica stats reali
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setStats(prev => ({
          ...prev,
          leads: data.total || 0
        }));
      })
      .catch(err => console.error('Error loading stats:', err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">👥</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Leads Totali</p>
            <p className="text-2xl font-bold text-gray-900">{stats.leads}</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">✅</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Conversioni</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-lg">💰</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Revenue Mensile</p>
            <p className="text-2xl font-bold text-gray-900">€-</p>
          </div>
        </div>
      </Card>
      
      <Card className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-lg">🏢</span>
            </div>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Clienti Attivi</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function LeadsSection() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leads')
      .then(res => res.json())
      .then(data => {
        setLeads(data.leads || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading leads:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Gestione Leads</h3>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {leads.length} totali
        </span>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Caricamento leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Nessun lead ancora presente</p>
          <p className="text-sm text-gray-400 mt-2">
            I leads appariranno qui quando qualcuno compila il form
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fonte
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leads.map((lead: any) => (
                <tr key={lead.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {lead.first_name} {lead.last_name}
                    </div>
                    {lead.phone && (
                      <div className="text-sm text-gray-500">{lead.phone}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{lead.email}</div>
                    {lead.zip_code && (
                      <div className="text-sm text-gray-500">{lead.zip_code}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                      lead.status === 'new' 
                        ? 'bg-green-100 text-green-800'
                        : lead.status === 'contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {lead.source || 'website'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(lead.created_at).toLocaleDateString('it-IT')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

function ClientsSection() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestione Clienti</h3>
      <div className="text-center py-12">
        <p className="text-gray-500">Sistema di gestione clienti in sviluppo...</p>
        <p className="text-sm text-gray-400 mt-2">
          Qui potrai gestire tutti i clienti convertiti e i loro contratti
        </p>
      </div>
    </Card>
  );
}

function AnalyticsSection() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
      <div className="text-center py-12">
        <p className="text-gray-500">Dashboard analytics in sviluppo...</p>
        <p className="text-sm text-gray-400 mt-2">
          Qui potrai vedere statistiche, funnel di conversione e metriche
        </p>
      </div>
    </Card>
  );
}

function FinancialSection() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Gestione Finanziaria</h3>
      <div className="text-center py-12">
        <p className="text-gray-500">Dashboard finanziaria in sviluppo...</p>
        <p className="text-sm text-gray-400 mt-2">
          Qui potrai gestire revenue, spese e budget
        </p>
      </div>
    </Card>
  );
}

function MarketingSection() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Marketing</h3>
      <div className="text-center py-12">
        <p className="text-gray-500">Dashboard marketing in sviluppo...</p>
        <p className="text-sm text-gray-400 mt-2">
          Qui potrai gestire campagne, tracking pixel e email templates
        </p>
      </div>
    </Card>
  );
}