import React from 'react';
import { LegalForm } from '../types';
import { Filter, Calendar, DollarSign, Briefcase } from 'lucide-react';

interface Props {
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  selectedForm: string;
  setSelectedForm: (s: string) => void;
  minCapital: string;
  setMinCapital: (s: string) => void;
  dateFrom: string;
  setDateFrom: (s: string) => void;
}

export const SearchFilters: React.FC<Props> = ({
  searchTerm, setSearchTerm,
  selectedForm, setSelectedForm,
  minCapital, setMinCapital,
  dateFrom, setDateFrom
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-slate-200 animate-fadeIn relative z-20">
      <div className="flex items-center gap-2 mb-6 text-slate-800 font-bold border-b border-slate-100 pb-2">
        <Filter className="w-4 h-4 text-blue-600" />
        <h2>Advanced Search Criteria</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Legal Form */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <Briefcase className="w-3 h-3" /> Legal Form
          </label>
          <select
            value={selectedForm}
            onChange={(e) => setSelectedForm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-shadow hover:bg-slate-100"
          >
            <option value="">All Legal Forms</option>
            {Object.values(LegalForm).map((form) => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
        </div>

        {/* Min Capital */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
            <DollarSign className="w-3 h-3" /> Minimum Capital (SLE)
          </label>
          <input
            type="number"
            placeholder="e.g. 10000"
            value={minCapital}
            onChange={(e) => setMinCapital(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-shadow"
          />
        </div>

        {/* Registration Date */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
             <Calendar className="w-3 h-3" /> Registered After
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition-shadow text-slate-600"
          />
        </div>
      </div>
    </div>
  );
};