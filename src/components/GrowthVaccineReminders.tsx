import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VaccineRecord, Language } from '../types';
import {
  Bell,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Smartphone,
  ShieldCheck,
  Plus,
  X
} from 'lucide-react';

interface GrowthVaccineRemindersProps {
  language: Language;
}

export const GrowthVaccineReminders: React.FC<GrowthVaccineRemindersProps> = ({ language }) => {
  const { activeBaby, vaccines } = useApp();

  const [notificationEnabled, setNotificationEnabled] = useState<boolean>(true);
  const [reminderTiming, setReminderTiming] = useState<'3_days' | '1_day' | 'day_of'>('3_days');
  const [customReminders, setCustomReminders] = useState<{ id: string; title: string; date: string; time: string; type: 'growth' | 'vaccine' | 'pediatrician' }[]>([
    {
      id: 'cr_1',
      title: `${activeBaby.name}'s 4-Month Routine Growth & Length Checkup`,
      date: '2026-11-15',
      time: '10:00 AM',
      type: 'growth',
    },
    {
      id: 'cr_2',
      title: `Influenza (Flu) Dose 1 & Typhoid Vaccine`,
      date: '2027-01-15',
      time: '11:30 AM',
      type: 'vaccine',
    },
  ]);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newType, setNewType] = useState<'growth' | 'vaccine' | 'pediatrician'>('growth');

  // Find next upcoming vaccine that is not yet given
  const pendingVaccines = vaccines.filter(v => !v.isGiven);
  const nextVaccine = pendingVaccines[0];

  // Helper to generate and download an .ics iCalendar file for native phone calendar reminders
  const downloadIcsCalendar = (title: string, dateStr: string, description: string) => {
    const formattedDate = dateStr.replace(/-/g, '');
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Mumora//Pediatric Health Tracker//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description} - Registered for ${activeBaby.name} (${activeBaby.pediatricianName})
DTSTART;VALUE=DATE:${formattedDate}
DTEND;VALUE=DATE:${formattedDate}
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-P1D
ACTION:DISPLAY
DESCRIPTION:Reminder: ${title}
END:VALARM
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;

    setCustomReminders(prev => [
      ...prev,
      {
        id: `rem_${Date.now()}`,
        title: newTitle,
        date: newDate,
        time: newTime,
        type: newType,
      },
    ]);
    setShowAddModal(false);
    setNewTitle('');
    setNewDate('');
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bell className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {language === 'hi' ? 'शिशु विकास एवं टीकाकरण रिमाइंडर' : 'Baby Growth & Vaccine Reminders'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'टीकाकरण की तारीखों और मासिक शारीरिक माप के लिए समय पर अलर्ट सेट करें'
              : 'Configurable alerts and 1-tap phone calendar sync for WHO growth checkups and immunizations'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'नया रिमाइंडर जोड़ें' : 'Set New Reminder'}</span>
        </button>
      </div>

      {/* Next Imminent Vaccine Card */}
      {nextVaccine && (
        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                {language === 'hi' ? 'अगला देय टीका' : 'Next Due Vaccine'}
              </span>
              <span className="text-xs text-slate-500">Target: {nextVaccine.targetAge}</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">{nextVaccine.name}</h3>
            <p className="text-xs text-slate-600 font-mono tabular-nums">
              Due Date: <strong className="text-rose-700">{nextVaccine.dueDate}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                downloadIcsCalendar(
                  `Vaccine Due: ${nextVaccine.name}`,
                  nextVaccine.dueDate,
                  `Pediatric Immunization for ${activeBaby.name}. Target Age: ${nextVaccine.targetAge}`
                )
              }
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'कैलेंडर में जोड़ें (.ics)' : 'Sync to Calendar'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Reminder Schedules */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {language === 'hi' ? 'सक्रिय स्वास्थ्य रिमाइंडर' : 'Active Scheduled Health Reminders'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {customReminders.map(rem => (
            <div
              key={rem.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="font-bold text-slate-900 block leading-snug">{rem.title}</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono tabular-nums">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{rem.date}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{rem.time}</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => downloadIcsCalendar(rem.title, rem.date, rem.title)}
                className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shrink-0"
                title="Download Calendar Reminder (.ics)"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Notification Preferences Strip */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <Smartphone className="w-4 h-4 text-slate-500 shrink-0" />
          <div>
            <span className="font-bold text-slate-800 block">
              {language === 'hi' ? 'स्मार्ट नोटिफिकेशन सेटिंग्स' : 'Smart Notification Preferences'}
            </span>
            <span className="text-[11px] text-slate-500">
              {language === 'hi' ? 'टीकाकरण से 3 दिन पहले और सुबह 8 बजे अलर्ट भेजें' : 'Receive reminder 3 days prior and morning of pediatric appointment'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={reminderTiming}
            onChange={e => setReminderTiming(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
          >
            <option value="3_days">3 Days Before</option>
            <option value="1_day">1 Day Before</option>
            <option value="day_of">Morning of Visit</option>
          </select>

          <button
            onClick={() => setNotificationEnabled(!notificationEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              notificationEnabled
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {notificationEnabled ? 'Enabled' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Add Custom Reminder Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                {language === 'hi' ? 'नया रिमाइंडर निर्धारित करें' : 'Set Pediatric Reminder'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomReminder} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'hi' ? 'रिमाइंडर का शीर्षक' : 'Reminder Title'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 4-Month Weight Check / Rotavirus Booster"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {language === 'hi' ? 'दिनांक (Date)' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    {language === 'hi' ? 'समय (Time)' : 'Time'}
                  </label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'hi' ? 'प्रकार (Type)' : 'Category'}
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="growth">Monthly Growth Measurement</option>
                  <option value="vaccine">Pediatric Vaccination</option>
                  <option value="pediatrician">Doctor Consultation</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  Save & Set Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
