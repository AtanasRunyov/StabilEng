import { useState } from 'react';
import { Phone, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface CallFormProps {
  onCallMade: () => void;
}

export default function CallForm({ onCallMade }: CallFormProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setStatus({ type: 'error', message: 'Please enter a valid 10-digit phone number' });
      setLoading(false);
      return;
    }

    const fullNumber = `+1${cleaned}`;

    try {
      const response = await fetch('/api/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_phone_number: fullNumber }),
      });

      const data = await response.json();

      if (response.ok && data.status === 'success') {
        setStatus({ type: 'success', message: `Call initiated successfully! Call SID: ${data.call_sid}` });
        setPhoneNumber('');
        onCallMade();
      } else {
        setStatus({ type: 'error', message: data.error || 'Failed to initiate call' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
            disabled={loading}
            maxLength={14}
          />
          <p className="mt-2 text-sm text-slate-500">
            Enter a US phone number (10 digits)
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Initiating Call...
            </>
          ) : (
            <>
              <Phone className="w-5 h-5" />
              Make Call
            </>
          )}
        </button>
      </form>

      {status.type && (
        <div
          className={`mt-6 p-4 rounded-lg flex items-start gap-3 ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Enter a phone number and click "Make Call"</li>
          <li>The AI will call the number using Twilio</li>
          <li>Have a natural conversation with the AI assistant</li>
          <li>The call will be automatically recorded</li>
        </ol>
      </div>
    </div>
  );
}
