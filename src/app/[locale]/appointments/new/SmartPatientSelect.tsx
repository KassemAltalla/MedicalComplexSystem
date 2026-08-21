'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { searchPatients } from '@/actions/patient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, UserPlus, Phone, CreditCard, Check } from 'lucide-react';
import NewPatientModal from './NewPatientModal';

export default function SmartPatientSelect({ 
  locale,
  value, 
  onChange 
}: { 
  locale: string,
  value: any | null, 
  onChange: (patient: any) => void 
}) {
  const t = useTranslations('Appointment');
  const [query, setQuery] = useState(value ? value.name : '');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && query === value.name) return; // Don't search if we just selected

    const search = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const data = await searchPatients(query);
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, value]);

  const handleSelect = (patient: any) => {
    setQuery(patient.name);
    onChange(patient);
    setIsOpen(false);
  };

  const handlePatientCreated = (patient: any) => {
    setQuery(patient.name);
    onChange(patient);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative flex items-center">
        <Search className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 rtl:left-3 rtl:right-auto" />
        <Input 
          placeholder={t('searchPatient')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (value && e.target.value !== value.name) {
              onChange(null); // Clear selection if typing again
            }
          }}
          onFocus={() => setIsOpen(true)}
          className="pl-3 rtl:pr-10 rtl:pl-3 h-11 bg-white dark:bg-slate-900/50 rounded-xl"
        />
        {loading && <Loader2 className="absolute left-3 rtl:right-3 rtl:left-auto w-4 h-4 animate-spin text-blue-500" />}
        {value && !loading && <Check className="absolute left-3 rtl:right-3 rtl:left-auto w-4 h-4 text-green-500" />}
      </div>

      {isOpen && (query.trim() !== '' || results.length > 0) && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden">
          <ul className="max-h-60 overflow-y-auto p-2 space-y-1">
            {results.length > 0 ? (
              results.map((patient) => (
                <li key={patient.id}>
                  <button
                    type="button"
                    onClick={() => handleSelect(patient)}
                    className="w-full text-start px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {patient.name}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1" dir="ltr"><Phone className="w-3 h-3" /> {patient.phoneNumber}</span>
                        <span className="flex items-center gap-1"><CreditCard className="w-3 h-3" /> {patient.nationalId}</span>
                      </div>
                    </div>
                  </button>
                </li>
              ))
            ) : query.trim() !== '' && !loading ? (
              <li className="px-3 py-4 text-center text-sm text-slate-500">
                {locale === 'ar' ? 'لا توجد نتائج مطابقة.' : 'No matching results.'}
              </li>
            ) : null}
          </ul>
          
          <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 gap-2 h-10"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
            >
              <UserPlus className="w-4 h-4" />
              <span>{t('newPatient')}</span>
            </Button>
          </div>
        </div>
      )}

      <NewPatientModal 
        locale={locale} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onPatientCreated={handlePatientCreated} 
      />
    </div>
  );
}
