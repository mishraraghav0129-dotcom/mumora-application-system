import React from 'react';
import { useApp } from '../context/AppContext';
import { NATIONAL_VACCINATION_SCHEDULE } from '../data/vaccines';
import { CheckCircle2, Circle, AlertCircle, Syringe, Calendar, Building2 } from 'lucide-react';

export const VaccinationSchedule: React.FC = () => {
  const { language, activeBaby, vaccines, toggleVaccineStatus } = useApp();

  const babyVaccines = vaccines.filter(v => v.babyId === activeBaby.id);
  const completedCount = babyVaccines.filter(v => v.isGiven).length;
  const totalCount = babyVaccines.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Syringe className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {language === 'hi' ? 'राष्ट्रीय टीकाकरण तालिका (India UIP & IAP)' : 'India National Pediatric Vaccine Card'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? `जन्म तिथि (${activeBaby.birthDate}) के आधार पर स्वचालित देय तिथियां (Due Dates)`
              : `Dynamic timeline calibrated to birth date (${activeBaby.birthDate}) under GoI Universal Immunization guidelines`}
          </p>
        </div>

        {/* Completion Progress Bar */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {language === 'hi' ? 'टीकाकरण पूर्णता' : 'Protection Completed'}
            </span>
            <span className="text-xs font-mono font-bold tabular-nums text-slate-900">
              {completedCount} / {totalCount} ({percent}%)
            </span>
          </div>
          <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-600 rounded-full transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Vaccine Card Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider">
              <th className="py-2.5 px-3">{language === 'hi' ? 'स्थिति' : 'Status'}</th>
              <th className="py-2.5 px-3">{language === 'hi' ? 'टीका / वैक्सीन' : 'Vaccine Name'}</th>
              <th className="py-2.5 px-3">{language === 'hi' ? 'अनुशंसित आयु' : 'Target Age'}</th>
              <th className="py-2.5 px-3">{language === 'hi' ? 'नियत तारीख (Due Date)' : 'Due Date'}</th>
              <th className="py-2.5 px-3">{language === 'hi' ? 'रोकथाम' : 'Protection Against'}</th>
              <th className="py-2.5 px-3 text-right">{language === 'hi' ? 'क्रिया' : 'Action'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {babyVaccines.map(v => {
              const scheduleItem = NATIONAL_VACCINATION_SCHEDULE.find(item => item.key === v.vaccineKey);
              const isOverdue = !v.isGiven && new Date() > new Date(v.dueDate);

              return (
                <tr
                  key={v.id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    v.isGiven ? 'bg-emerald-50/20' : isOverdue ? 'bg-amber-50/30' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    {v.isGiven ? (
                      <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="hidden sm:inline">{language === 'hi' ? 'लग चुका' : 'Given'}</span>
                      </span>
                    ) : isOverdue ? (
                      <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        <span className="hidden sm:inline">{language === 'hi' ? 'लंबित' : 'Overdue'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Circle className="w-4 h-4" />
                        <span className="hidden sm:inline">{language === 'hi' ? 'आगामी' : 'Upcoming'}</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">
                      {language === 'hi' && scheduleItem ? scheduleItem.nameHi : v.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {v.clinic ? `Clinic: ${v.clinic}` : scheduleItem?.isMandatoryNationalUIP ? 'GoI UIP National' : 'IAP Recommended'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {language === 'hi' && scheduleItem ? scheduleItem.targetAgeHi : v.targetAge}
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-800">
                    {v.dueDate}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">
                    {language === 'hi' && scheduleItem ? scheduleItem.diseasesPreventedHi : scheduleItem?.diseasesPrevented || '-'}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {!v.isGiven && (
                        <button
                          onClick={() => {
                            const formattedDate = v.dueDate.replace(/-/g, '');
                            const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Mumora//Vaccine//EN\nBEGIN:VEVENT\nSUMMARY:Vaccine Due: ${v.name} for ${activeBaby.name}\nDESCRIPTION:Recommended immunization (${v.targetAge}) under WHO / UIP guidelines.\nDTSTART;VALUE=DATE:${formattedDate}\nDTEND;VALUE=DATE:${formattedDate}\nSTATUS:CONFIRMED\nBEGIN:VALARM\nTRIGGER:-P2D\nACTION:DISPLAY\nDESCRIPTION:Vaccine Reminder: ${v.name}\nEND:VALARM\nEND:VEVENT\nEND:VCALENDAR`;
                            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
                            const url = URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `${v.name.replace(/\s+/g, '_')}_Reminder.ics`);
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                          title="Sync reminder to phone calendar (.ics)"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleVaccineStatus(v.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                          v.isGiven
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                      >
                        {v.isGiven ? (language === 'hi' ? 'पूर्ण' : 'Completed') : (language === 'hi' ? 'दर्ज करें' : 'Mark Given')}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
        <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
        <span>
          {language === 'hi'
            ? 'भारत सरकार के सार्वभौमिक टीकाकरण कार्यक्रम (UIP) के टीके सभी सरकारी प्राथमिक स्वास्थ्य केंद्रों (PHC) और आंगनवाड़ी में निःशुल्क उपलब्ध हैं।'
            : 'All mandatory UIP vaccines are provided free of cost across Government PHCs, Sub-Centers, and Anganwadis across India.'}
        </span>
      </div>
    </div>
  );
};
