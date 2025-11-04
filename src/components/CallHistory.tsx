import { Loader2, Phone, Clock, CheckCircle, XCircle, PlayCircle } from 'lucide-react';
import { CallLog } from '../lib/supabase';

interface CallHistoryProps {
  calls: CallLog[];
  loading: boolean;
}

export default function CallHistory({ calls, loading }: CallHistoryProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed':
      case 'busy':
      case 'no-answer':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
      case 'busy':
      case 'no-answer':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (calls.length === 0) {
    return (
      <div className="text-center py-16">
        <Phone className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-slate-600 mb-2">No calls yet</h3>
        <p className="text-slate-500">Make your first call to see the history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-slate-800">Recent Calls</h2>
        <span className="text-sm text-slate-500">{calls.length} total calls</span>
      </div>

      <div className="space-y-3">
        {calls.map((call) => (
          <div
            key={call.id}
            className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Phone className="w-5 h-5 text-slate-400" />
                  <span className="font-mono text-lg font-medium text-slate-800">
                    {call.to_phone_number}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDate(call.created_at)}
                  </div>
                  {call.duration && (
                    <div className="flex items-center gap-1">
                      <span>Duration:</span>
                      <span className="font-medium">{formatDuration(call.duration)}</span>
                    </div>
                  )}
                </div>

                <div className="mt-2 text-xs text-slate-500 font-mono">
                  SID: {call.call_sid}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(
                    call.status
                  )}`}
                >
                  {getStatusIcon(call.status)}
                  {call.status}
                </div>

                {call.recording_url && (
                  <a
                    href={call.recording_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <PlayCircle className="w-4 h-4" />
                    Recording
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
