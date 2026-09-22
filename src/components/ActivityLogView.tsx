import React, { useState, useMemo } from 'react';
import { ActivityLog, LogAction } from '../types/archive';
import { 
  History, 
  Search, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';

interface ActivityLogViewProps {
  logs: ActivityLog[];
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = useMemo(() => {
    return logs.filter(l => {
      const q = searchQuery.toLowerCase();
      const matchQuery = 
        !searchQuery ||
        l.detail.toLowerCase().includes(q) ||
        l.nomorArsip.toLowerCase().includes(q) ||
        l.idRecord.toLowerCase().includes(q) ||
        l.user.toLowerCase().includes(q);

      const matchAction = filterAction === 'ALL' || l.action === filterAction;
      return matchQuery && matchAction;
    });
  }, [logs, searchQuery, filterAction]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-emerald-400" />
            <h1 className="text-lg font-extrabold text-white font-['Outfit',sans-serif]">
              Sheet: 03_LOG_AKTIVITAS
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-300 font-semibold border border-slate-700">
              {filteredLogs.length} Entri Tercatat
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Jejak audit terstandarisasi 6 kolom (Timestamp | User | Action | ID_Record | Nomor_Arsip | Detail)
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 flex items-center space-x-1.5 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Trail Terverifikasi</span>
          </span>
        </div>
      </div>

      {/* Toolbar Search & Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari aktivitas, ID Record, User, atau Nomor Arsip..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Action (CREATE, VERIFY, dll)</option>
            <option value="CREATE">CREATE</option>
            <option value="VERIFY">VERIFY</option>
            <option value="UPDATE">UPDATE</option>
            <option value="CANCEL">CANCEL</option>
            <option value="RETRY">RETRY</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-950 text-slate-300 uppercase font-semibold border-b border-slate-700">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">ID Record</th>
                <th className="px-4 py-3">Nomor Arsip</th>
                <th className="px-4 py-3">Detail Aktivitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    <AlertCircle className="w-6 h-6 mx-auto mb-1 text-slate-500" />
                    <span>Tidak ada log yang sesuai kriteria pencarian.</span>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  let actionBadge = 'bg-slate-800 text-slate-300 border border-slate-700';
                  if (log.action === 'CREATE') actionBadge = 'bg-blue-950 text-blue-300 border border-blue-700/50';
                  else if (log.action === 'VERIFY') actionBadge = 'bg-emerald-950 text-emerald-300 border border-emerald-700/50';
                  else if (log.action === 'UPDATE') actionBadge = 'bg-amber-950 text-amber-300 border border-amber-700/50';
                  else if (log.action === 'CANCEL') actionBadge = 'bg-rose-950 text-rose-300 border border-rose-700/50';
                  else if (log.action === 'RETRY') actionBadge = 'bg-purple-950 text-purple-300 border border-purple-700/50';
                  else if (log.action === 'ERROR') actionBadge = 'bg-red-950 text-red-300 border border-red-700/50';

                  return (
                    <tr key={log.id} className="hover:bg-slate-750/70 transition">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-slate-400">
                        {log.timestamp}
                      </td>
                      <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        {log.user}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${actionBadge}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                        {log.idRecord}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {log.nomorArsip}
                      </td>
                      <td className="px-4 py-3 text-slate-300 max-w-md">
                        {log.detail}
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
