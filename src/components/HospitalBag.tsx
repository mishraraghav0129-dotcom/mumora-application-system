import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Circle, Plus, Luggage, User, Baby, Users, FileText } from 'lucide-react';

export const HospitalBag: React.FC = () => {
  const { language, hospitalBag, toggleHospitalBagItem, addHospitalBagItem } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'mother' | 'baby' | 'partner' | 'documents'>('all');
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<'mother' | 'baby' | 'partner' | 'documents'>('mother');
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredItems = activeCategory === 'all'
    ? hospitalBag
    : hospitalBag.filter(item => item.category === activeCategory);

  const packedCount = hospitalBag.filter(i => i.isPacked).length;
  const totalCount = hospitalBag.length;
  const percent = Math.round((packedCount / totalCount) * 100);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    addHospitalBagItem(newItemText, newItemText, newItemCategory);
    setNewItemText('');
    setShowAddForm(false);
  };

  const categoryIcons = {
    mother: <User className="w-3.5 h-3.5 text-rose-600" />,
    baby: <Baby className="w-3.5 h-3.5 text-blue-600" />,
    partner: <Users className="w-3.5 h-3.5 text-amber-600" />,
    documents: <FileText className="w-3.5 h-3.5 text-emerald-600" />,
  };

  return (
    <div className="bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Luggage className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {language === 'hi' ? 'हॉस्पिटल डिलीवरी बैग चेकलिस्ट' : 'Hospital Delivery Bag Checklist'}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {language === 'hi'
              ? 'प्रसव के लिए 36वें सप्ताह तक अपना बैग तैयार रखें'
              : 'Pack by week 36 so you are ready for labor at any moment'}
          </p>
        </div>

        {/* Progress tracker */}
        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              {language === 'hi' ? 'सामान पैक हुआ' : 'Packed Progress'}
            </span>
            <span className="text-xs font-mono font-bold tabular-nums text-slate-900">
              {packedCount} / {totalCount} ({percent}%)
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

      {/* Category Filter and Add Item Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: language === 'hi' ? 'सभी' : 'All' },
            { id: 'mother', label: language === 'hi' ? 'मां के लिए' : 'Mother' },
            { id: 'baby', label: language === 'hi' ? 'शिशु के लिए' : 'Baby' },
            { id: 'documents', label: language === 'hi' ? 'दस्तावेज' : 'Documents' },
            { id: 'partner', label: language === 'hi' ? 'साथी / पार्टनर' : 'Partner' },
          ].map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === c.id
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? 'नया सामान जोड़ें' : 'Add Item'}</span>
        </button>
      </div>

      {/* Add Custom Item Form */}
      {showAddForm && (
        <form onSubmit={handleAddItem} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                {language === 'hi' ? 'सामान का नाम' : 'Item Description'}
              </label>
              <input
                type="text"
                placeholder="e.g. Extra swaddle cloth, thermos flask..."
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                required
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                {language === 'hi' ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="mother">Mother</option>
                <option value="baby">Baby</option>
                <option value="documents">Documents</option>
                <option value="partner">Partner</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
            >
              Save Item
            </button>
          </div>
        </form>
      )}

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => toggleHospitalBagItem(item.id)}
            className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-start justify-between gap-3 ${
              item.isPacked
                ? 'bg-emerald-50/40 border-emerald-200 text-slate-600'
                : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {item.isPacked ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="space-y-0.5">
                <span className={`text-xs font-medium block leading-snug ${item.isPacked ? 'line-through text-slate-400' : ''}`}>
                  {language === 'hi' ? item.itemHi : item.item}
                </span>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 capitalize">
                  {categoryIcons[item.category]}
                  <span>{item.category}</span>
                  {item.quantity && <span>· Qty: {item.quantity}</span>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
