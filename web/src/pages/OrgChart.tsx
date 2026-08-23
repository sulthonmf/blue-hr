import React from 'react';
import { useHRStore, OrgTreeNode } from '../stores/useHRStore';
import { Network, Users, Building, ChevronDown, UserCheck } from 'lucide-react';

export const OrgChartPage: React.FC = () => {
  const { orgTree, employees } = useHRStore();

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2.5">
            <Network className="text-[#2563eb]" size={26} />
            <span>Struktur Organisasi (Org Chart Tree)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pohon hierarki visual hubungan atasan, manajer, dan tim subordinat perusahaan.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-x-auto">
        <div className="min-w-[800px] flex flex-col items-center gap-8 py-4">
          {orgTree.length === 0 ? (
            <div className="text-slate-400 text-xs">Memuat struktur organisasi...</div>
          ) : (
            orgTree.map((root) => <TreeNodeCard key={root.id} node={root} />)
          )}
        </div>
      </div>
    </div>
  );
};

const TreeNodeCard: React.FC<{ node: OrgTreeNode }> = ({ node }) => {
  return (
    <div className="flex flex-col items-center">
      {/* Node Box */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-[#2563eb] p-4 rounded-2xl shadow-sm text-center min-w-[220px] transition-all relative group">
        <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white mx-auto flex items-center justify-center font-black text-lg mb-2 shadow-md shadow-blue-500/30">
          {node.avatar ? (
            <img src={node.avatar} alt={node.name} className="w-12 h-12 rounded-full object-cover" />
          ) : (
            node.name.substring(0, 1)
          )}
        </div>
        <h4 className="text-xs font-extrabold text-slate-900 dark:text-white font-display">{node.name}</h4>
        <p className="text-[10px] font-bold text-[#2563eb] mt-0.5">{node.position}</p>
        <span className="inline-block px-2 py-0.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[9px] font-bold rounded-md mt-2">
          {node.department}
        </span>
      </div>

      {/* Subordinates Tree Branches */}
      {node.subordinates && node.subordinates.length > 0 && (
        <div className="flex flex-col items-center mt-2">
          <div className="w-0.5 h-6 bg-slate-300 dark:bg-slate-700"></div>
          <div className="flex items-start gap-6 pt-2 border-t-2 border-slate-300 dark:border-slate-700">
            {node.subordinates.map((sub) => (
              <TreeNodeCard key={sub.id} node={sub} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
