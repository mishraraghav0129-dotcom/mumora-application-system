import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  RelativeHealthRecord,
  BabyRiskCategory,
} from '../types';
import {
  ShieldCheck,
  Heart,
  Users,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  Lock,
  Download,
  Trash2,
  Plus,
  X,
  BookOpen,
  Calendar,
  Stethoscope,
  Sparkles,
} from 'lucide-react';

import { TRANSLATIONS } from '../data/translations';

export const FamilyHealthAndRiskInsights: React.FC = () => {
  const {
    language,
    maternalHistory,
    paternalHistory,
    familyPedigree,
    updateFamilyPedigree,
    addRelativeRecord,
    removeRelativeRecord,
    babyRiskAssessment,
    recomputeBabyRiskAssessment,
    consent,
    updateConsent,
    exportUserDataJson,
    deleteUserData,
    setIsOnboardingOpen,
  } = useApp();

  const isHi = language === 'hi';
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [activeTab, setActiveTab] = useState<'riskInsights' | 'maternal' | 'paternal' | 'pedigree' | 'privacy'>('riskInsights');
  const [showAddRelativeModal, setShowAddRelativeModal] = useState(false);

  // New relative form state
  const [newRelRelation, setNewRelRelation] = useState<RelativeHealthRecord['relationship']>('maternal_grandmother');
  const [newRelSide, setNewRelSide] = useState<'maternal' | 'paternal'>('maternal');
  const [newRelName, setNewRelName] = useState('');
  const [newRelCondition, setNewRelCondition] = useState('');
  const [newRelAgeOnset, setNewRelAgeOnset] = useState('');

  // Handle adding relative
  const handleAddRelative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRelCondition.trim()) return;

    addRelativeRecord({
      relationship: newRelRelation,
      relationshipSide: newRelSide,
      relativeName: newRelName.trim() || undefined,
      condition: newRelCondition.trim(),
      ageOfOnset: newRelAgeOnset ? parseInt(newRelAgeOnset, 10) : undefined,
      isCarrier: false,
      status: 'confirmed',
    });

    setNewRelCondition('');
    setNewRelName('');
    setNewRelAgeOnset('');
    setShowAddRelativeModal(false);
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'reassuring':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Standard Preventive Care & Routine Wellness</span>
          </span>
        );
      case 'monitoring':
      case 'clinical_discussion':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Discuss with Obstetrician / Pediatrician</span>
          </span>
        );
      case 'prompt_review':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
            <Stethoscope className="w-4 h-4 text-purple-600" />
            <span>Early Specialist / MFM Consultation</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Recommended Clinical Surveillance</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-purple-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t.familyHealth.title}</span>
              <span>·</span>
              <span>DPDPA 2023 Compliant</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {t.familyHealth.title}
            </h1>
            <p className="text-purple-100 text-xs sm:text-sm leading-relaxed">
              {t.familyHealth.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="px-4 py-2.5 bg-white text-purple-900 hover:bg-purple-50 rounded-xl text-xs font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-purple-700" />
              <span>{language === 'te' ? 'ఆన్‌బోర్డింగ్ సమీక్ష' : isHi ? 'ऑनबोर्डिंग प्रोफाइल समीक्षा' : 'Review Onboarding Flow'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Medical Safety Disclaimer Callout */}
      <div className="bg-amber-50 border-l-4 border-amber-500 rounded-2xl p-4.5 text-xs text-amber-900 space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Strict Medical Safety Boundary & Clinical Non-Diagnostic Rule</span>
        </div>
        <p className="leading-relaxed">
          {language === 'te'
            ? 'ముఖ్యమైనది: భవిష్యత్తులో శిశువుకు ఏ వ్యాధి వస్తుందో AI ఖచ్చితంగా ఊహించదు. ఇది కేవలం నివారణ దశలు, వైద్యుడితో చర్చించవలసిన అంశాలు మరియు సాధారణ పరీక్షలను మాత్రమే గుర్తిస్తుంది.'
            : isHi
            ? 'महत्वपूर्ण: एआई किसी बच्चे को भविष्य में कौन सी बीमारी होगी इसका पक्का अनुमान नहीं लगा सकता। यह मूल्यांकन केवल निवारक कदमों, डॉक्टर से चर्चा के बिंदुओं और नियमित जांचों की पहचान करता है।'
            : 'Crucial: AI cannot definitively predict future pediatric illness and does not invent predictive percentages. Mumora organizes observations into 4 clinical discussion tiers to empower your in-person discussions with your obstetrician and pediatrician.'}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-purple-100">
        {[
          { id: 'riskInsights', label: t.familyHealth.riskAssessment, icon: ShieldCheck },
          { id: 'maternal', label: t.familyHealth.maternalHistory, icon: Heart },
          { id: 'paternal', label: t.familyHealth.paternalHistory, icon: Users },
          { id: 'pedigree', label: t.familyHealth.pedigreeTitle, icon: FileText },
          { id: 'privacy', label: language === 'te' ? 'సమ్మతి & గోప్యత' : isHi ? 'गोपनीयता व डेटा नियंत्रण' : 'Consent & Privacy', icon: Lock },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-purple-50 hover:text-purple-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: DEDICATED CARD — YOUR BABY'S HEALTH RISK & PREVENTION INSIGHTS */}
      {activeTab === 'riskInsights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-purple-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  {isHi ? "शिशु स्वास्थ्य जोखिम व निवारक अंतर्दृष्टि" : "Your Baby's Health Risk & Prevention Insights"}
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Synthesized from consented maternal ({maternalHistory.fullName || 'Mother'}), paternal, and family history.
                </p>
              </div>

              <button
                onClick={recomputeBabyRiskAssessment}
                className="px-3.5 py-1.5 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5 w-fit"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>Re-evaluate Clinical Factors</span>
              </button>
            </div>

            {/* Identified Risk Factors categorized by Severity */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-purple-600" />
                <span>Identified Clinical Factors & Recommended Prevention Pathways</span>
              </h3>

              <div className="space-y-4">
                {babyRiskAssessment.riskFactors.map(factor => (
                  <div
                    key={factor.id}
                    className="p-5 rounded-2xl border border-purple-100 bg-gradient-to-br from-white to-purple-50/20 shadow-xs space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-extrabold text-slate-900 text-sm">
                        {factor.title}
                      </h4>
                      <div>{getSeverityBadge(factor.severity)}</div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isHi && factor.clinicalRationaleHi ? factor.clinicalRationaleHi : factor.clinicalRationale}
                    </p>

                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                      <strong className="text-slate-800">Recommended Preventive Action:</strong>
                      <p className="text-slate-700">{factor.recommendedAction}</p>
                    </div>

                    {/* Questions for Doctor */}
                    {factor.questionsForDoctor && factor.questionsForDoctor.length > 0 && (
                      <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3.5 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-purple-950 font-bold text-xs">
                          <Stethoscope className="w-3.5 h-3.5 text-purple-600" />
                          <span>Questions to Ask Your Doctor at Your Next Visit:</span>
                        </div>
                        <ul className="space-y-1 text-xs text-purple-900 pl-4 list-disc">
                          {factor.questionsForDoctor.map((q, idx) => (
                            <li key={idx}>{q}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                      <BookOpen className="w-3 h-3" />
                      <span>Evidence Standard: {factor.evidenceSource}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Screenings Table */}
            {babyRiskAssessment.recommendedScreenings.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-purple-100">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span>Recommended Diagnostic & Carrier Screening Windows</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {babyRiskAssessment.recommendedScreenings.map((screen, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900">{screen.testName}</span>
                        <span className="bg-purple-50 text-purple-800 px-2 py-0.5 rounded font-bold text-[11px]">
                          {screen.windowWeeks}
                        </span>
                      </div>
                      <p className="text-slate-600">{screen.clinicalReason}</p>
                      <p className="text-[10px] text-slate-400">Standard: {screen.guidelineStandard}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: MOTHER'S MEDICAL HISTORY */}
      {activeTab === 'maternal' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-purple-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              <span>Mother’s Pre-Existing Medical Profile & Clinical History</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Collected voluntarily to tailor antenatal screening and medication safety.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Full Name & DOB</span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {maternalHistory.fullName} ({maternalHistory.dateOfBirth})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Blood Group & Rh Status</span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {maternalHistory.bloodGroup} (Rh {maternalHistory.rhFactor})
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {maternalHistory.rhFactor === '-' ? 'Rh Negative: Anti-D immunoglobulin surveillance protocol' : 'Rh Positive: Standard antibody screen'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pre-existing Conditions & Glycemic Vulnerability
            </h3>
            <div className="flex flex-wrap gap-2">
              {maternalHistory.preExistingConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Known Drug / Environmental Allergies
            </h3>
            <div className="flex flex-wrap gap-2">
              {maternalHistory.allergies.map((all, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 text-xs font-semibold"
                >
                  {all}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Current Supplements & Routine Antenatal Medications
            </h3>
            <div className="flex flex-wrap gap-2">
              {maternalHistory.currentSupplements.map((sup, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-semibold"
                >
                  {sup}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FATHER'S MEDICAL HISTORY */}
      {activeTab === 'paternal' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-purple-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>Father’s Health History & Hemoglobinopathy Carrier Screening</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Evaluates autosomal recessive inheritance risks (e.g., Thalassemia, Sickle Cell trait) where voluntarily supplied.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Father’s Full Name</span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {paternalHistory.fullName || 'Rahul Sharma'} ({paternalHistory.dateOfBirth || '1995-11-20'})
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-500 uppercase text-[10px]">Blood Group & Rh Status</span>
              <p className="text-sm font-extrabold text-slate-900 mt-1">
                {paternalHistory.bloodGroup || 'O Positive (O+)'} (Rh {paternalHistory.rhFactor || '+'})
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-xs space-y-2">
            <span className="font-bold text-purple-950">Hemoglobinopathy / Thalassemia Carrier Status:</span>
            <p className="text-purple-900 leading-relaxed">
              {paternalHistory.geneticScreeningDetails || 'HPLC / Hemoglobin electrophoresis pending. Recommended if maternal HPLC indicates carrier status.'}
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: FAMILY PEDIGREE */}
      {activeTab === 'pedigree' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>First & Second Degree Relative Pedigree Records</span>
              </h2>
              <p className="text-xs text-slate-500">
                Biological relatives, handling "Unknown" or voluntary non-disclosure respectfully.
              </p>
            </div>

            <button
              onClick={() => setShowAddRelativeModal(true)}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 w-fit"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Relative Health Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {familyPedigree.records.map(rel => (
              <div
                key={rel.id}
                className="bg-white border border-purple-100 rounded-2xl p-4.5 shadow-xs space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {rel.relativeName || rel.relationship.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-800">
                      {rel.relationshipSide}
                    </span>
                  </div>

                  <div className="mt-2 space-y-1">
                    <p className="text-xs font-semibold text-slate-800">Reported Condition:</p>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                      {rel.condition}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{rel.ageOfOnset ? `Age of Onset: ${rel.ageOfOnset} yrs` : 'Onset age: Adult'}</span>
                  <button
                    onClick={() => removeRelativeRecord(rel.id)}
                    className="text-rose-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Relative Modal */}
          {showAddRelativeModal && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm">Add Relative Medical History</h3>
                  <button onClick={() => setShowAddRelativeModal(false)} className="p-1 rounded-lg hover:bg-slate-100">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <form onSubmit={handleAddRelative} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Relative Name (Optional)</label>
                    <input
                      type="text"
                      value={newRelName}
                      onChange={e => setNewRelName(e.target.value)}
                      placeholder="e.g. Kalyani Devi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                      <select
                        value={newRelRelation}
                        onChange={e => setNewRelRelation(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="maternal_grandmother">Maternal Grandmother</option>
                        <option value="maternal_grandfather">Maternal Grandfather</option>
                        <option value="paternal_grandmother">Paternal Grandmother</option>
                        <option value="paternal_grandfather">Paternal Grandfather</option>
                        <option value="sibling">Sibling</option>
                        <option value="aunt_uncle">Aunt / Uncle</option>
                        <option value="other_relative">Other Relative</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Family Side</label>
                      <select
                        value={newRelSide}
                        onChange={e => setNewRelSide(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      >
                        <option value="maternal">Maternal Side</option>
                        <option value="paternal">Paternal Side</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Health Condition</label>
                    <input
                      type="text"
                      value={newRelCondition}
                      onChange={e => setNewRelCondition(e.target.value)}
                      placeholder="e.g. Type 2 Diabetes, Hypertension, Asthma..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                      required
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddRelativeModal(false)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs"
                    >
                      Save Relative
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PRIVACY, CONSENT & DATA CONTROLS (DPDPA 2023) */}
      {activeTab === 'privacy' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-sm space-y-6">
          <div className="pb-4 border-b border-purple-100">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-purple-600" />
              <span>Consent & Data Sovereignty Controls (DPDPA 2023)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              You own your sensitive maternal health data. Toggle granular permissions, download your encrypted copy, or delete records.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Health Data Processing Consent</p>
                <p className="text-xs text-slate-500">Allows computing maternal risk factors and screening recommendations.</p>
              </div>
              <input
                type="checkbox"
                checked={consent.healthDataProcessing}
                onChange={e => updateConsent({ healthDataProcessing: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 text-xs sm:text-sm">Location Permission for Environmental Insights</p>
                <p className="text-xs text-slate-500">Enables retrieving local temperature, heat index, and ambient AQI data.</p>
              </div>
              <input
                type="checkbox"
                checked={consent.locationPermission}
                onChange={e => updateConsent({ locationPermission: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                const dataStr = exportUserDataJson();
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `mumora-health-profile-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-purple-700" />
              <span>Export Complete Health Profile (JSON)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all personal medical history from this device? This action is irreversible.')) {
                  deleteUserData();
                }
              }}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete All Consented Medical Records</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
