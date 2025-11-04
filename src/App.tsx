import { useState, useEffect } from 'react';
import { Phone, Database, History } from 'lucide-react';
import { supabase, CallLog } from './lib/supabase';
import CallForm from './components/CallForm';
import CallHistory from './components/CallHistory';

function App() {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'make-call' | 'history'>('make-call');

  useEffect(() => {
    fetchCalls();
    const subscription = supabase
      .channel('call_logs_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'call_logs' }, () => {
        fetchCalls();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error('Error fetching calls:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">AI Calling Agent</h1>
          </div>
          <p className="text-slate-600 text-lg">
            Real-time voice AI powered by OpenAI and Twilio
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('make-call')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'make-call'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Make Call
              </div>
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 px-6 py-4 font-medium transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <History className="w-5 h-5" />
                Call History
              </div>
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'make-call' ? (
              <CallForm onCallMade={fetchCalls} />
            ) : (
              <CallHistory calls={calls} loading={loading} />
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-slate-600">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Database className="w-4 h-4" />
            <span className="text-sm">Powered by Supabase</span>
          </div>
          <p className="text-xs text-slate-500">
            OpenAI Realtime API + Twilio Voice Integration
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
