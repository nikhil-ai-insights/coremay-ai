import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Clock, 
  User, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  Filter,
  Layers,
  FileText
} from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { AuditLogAction } from '../../types';
import { useToast } from '../ui/Toast';

export const MerchantAuditLogs: React.FC = () => {
  const { auditLogs } = useOrders();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActionType, setSelectedActionType] = useState<string>('All');

  const filteredLogs = auditLogs.filter((log) => {
    if (selectedActionType !== 'All' && log.actionType !== selectedActionType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.description.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q) ||
        (log.userName && log.userName.toLowerCase().includes(q)) ||
        (log.userEmail && log.userEmail.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      showToast('No logs to export', 'info');
      return;
    }

    const headers = ['ID', 'Timestamp', 'Action Type', 'User Name', 'User Email', 'Description'];
    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.timestamp).toISOString(),
      l.actionType,
      l.userName || 'Anonymous',
      l.userEmail || 'N/A',
      `"${l.description.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `coremay_audit_trail_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported audit logs to CSV successfully', 'success');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161616] p-6 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2 text-gray-500 text-xs font-mono uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
            Compliance & Financial Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
            Audit Trail & Event Log
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Immutable chronicle of merchant actions, AI recommendations, cart additions, and payment confirmations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-[#0F0F0F] hover:bg-[#1A1A1A] border border-white/10 text-white font-mono text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:border-amber-500/30"
        >
          <Download className="w-4 h-4 text-amber-500" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#161616] border border-white/5">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, users, keywords..."
            className="w-full pl-10 pr-4 py-2 bg-[#0F0F0F] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/60"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['All', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'AI_RECOMMENDATION', 'UPSELL_OFFERED', 'CART_ADD', 'STATUS_CHANGE'].map((act) => (
            <button
              key={act}
              onClick={() => setSelectedActionType(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedActionType === act
                  ? 'bg-amber-500 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="rounded-2xl bg-[#161616] border border-white/5 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0F0F0F] text-gray-500 uppercase text-[10px] font-mono border-b border-white/5">
                <th className="py-4 px-6 font-semibold">Timestamp</th>
                <th className="py-4 px-4 font-semibold">Event Type</th>
                <th className="py-4 px-4 font-semibold">Actor / User</th>
                <th className="py-4 px-6 font-semibold">Description & Context</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-16 text-center text-gray-400 font-mono text-xs">
                    <ShieldCheck className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                    No audit trail logs recorded yet. System and user transactions will appear here.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isPayment = log.actionType.includes('PAYMENT');
                  const isAI = log.actionType.includes('AI') || log.actionType.includes('UPSELL') || log.actionType.includes('CROSS');

                  return (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors">
                      
                      <td className="py-4 px-6 font-mono text-[11px] text-gray-400 whitespace-nowrap">
                        {new Date(log.timestamp).toLocaleString('en-IN', {
                          month: 'short',
                          day: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                          isPayment 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : isAI
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-white/5 text-gray-300 border border-white/10'
                        }`}>
                          {log.actionType.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-semibold text-white truncate max-w-[140px]">{log.userName || 'Shopper'}</p>
                        <p className="text-[10px] text-gray-500 font-mono truncate max-w-[140px]">{log.userEmail || 'guest@store'}</p>
                      </td>

                      <td className="py-4 px-6">
                        <p className="text-gray-200 text-xs leading-relaxed">{log.description}</p>
                        {log.metadata && Object.keys(log.metadata).length > 0 && (
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            Meta: {JSON.stringify(log.metadata)}
                          </p>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
