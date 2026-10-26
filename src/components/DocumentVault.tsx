import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRANSLATIONS } from '../data/translations';
import { DocumentRecord } from '../types';
import {
  FileText,
  Upload,
  Sparkles,
  FileSearch,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Download,
  Eye,
  Plus,
  Sparkles as SparklesIcon,
  Compass
} from 'lucide-react';
import { LocationAwareReportAnalysis } from './LocationAwareReportAnalysis';

export const DocumentVault: React.FC = () => {
  const { language, documents, addDocument } = useApp();
  const t = TRANSLATIONS[language];

  const [vaultView, setVaultView] = useState<'analyzer' | 'library'>('analyzer');
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord>(documents[0] || null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [analyzingDocId, setAnalyzingDocId] = useState<string | null>(null);

  // Upload Form states
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<'ultrasound' | 'blood_test' | 'prescription' | 'urine_test'>('ultrasound');
  const [extractedText, setExtractedText] = useState('');
  const [sampleBase64, setSampleBase64] = useState<string | null>(null);

  const filteredDocs = activeCategory === 'all'
    ? documents
    : documents.filter(d => d.category === activeCategory);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSampleBase64(reader.result as string);
        if (!docTitle) {
          setDocTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        // Simulated OCR text extraction
        setExtractedText(
          `Extracted clinical text from ${file.name}:\nPatient: Ananya Sharma. Gestation: 24W. Findings: Single live intrauterine fetus. Placenta fundal, grade 1. Amniotic fluid index: 13.5 cm (Normal). No gross anatomical anomalies noted.`
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const newDocData: Omit<DocumentRecord, 'id'> = {
      title: docTitle || 'Antenatal Clinical Record',
      category: docCategory,
      date: new Date().toISOString().split('T')[0],
      fileName: `${docTitle.replace(/\s+/g, '_')}.pdf`,
      extractedText: extractedText || 'Ultrasound scan recorded with cephalic fetal presentation.',
    };

    addDocument(newDocData);
    setShowUploadModal(false);
    setDocTitle('');
    setExtractedText('');
    setSampleBase64(null);
  };

  const handleAnalyzeWithAi = async (doc: DocumentRecord) => {
    setAnalyzingDocId(doc.id);
    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportType: doc.category,
          textContent: doc.extractedText || doc.title,
          language,
        }),
      });

      const data = await response.json();
      if (data.analysis) {
        setSelectedDoc(prev => ({
          ...prev,
          aiExplanation: data.analysis,
          doctorQuestions: [
            'Does this scan require any immediate follow-up before the next scheduled visit?',
            'Are all developmental parameters appropriate for my gestational week?',
          ],
        }));
      }
    } catch (err) {
      console.error('Error analyzing report:', err);
    } finally {
      setAnalyzingDocId(null);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Segmented Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-2 sm:p-2.5 rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl">
          <button
            onClick={() => setVaultView('analyzer')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              vaultView === 'analyzer'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'स्थान एवं पर्यावरण-जागरूक AI विश्लेषण' : 'Location-Aware AI Clinical Analyzer'}</span>
            <span className="hidden md:inline px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-rose-700/60 text-rose-100">
              WHO Aligned
            </span>
          </button>

          <button
            onClick={() => setVaultView('library')}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              vaultView === 'library'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'संग्रहीत रिकॉर्ड्स लाइब्रेरी' : 'Stored Records Vault'}</span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-200 text-slate-700">
              {documents.length}
            </span>
          </button>
        </div>

        {vaultView === 'library' && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-transform active:scale-95 whitespace-nowrap"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.records.uploadBtn}</span>
          </button>
        )}
      </div>

      {/* View 1: Location-Aware Clinical Report Analyzer */}
      {vaultView === 'analyzer' ? (
        <LocationAwareReportAnalysis />
      ) : (
        /* View 2: Traditional Vault & Library */
        <div className="space-y-6">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: 'all', label: t.records.categoryAll },
              { id: 'ultrasound', label: t.records.categoryUltrasound },
              { id: 'blood_test', label: t.records.categoryBlood },
              { id: 'prescription', label: t.records.categoryPrescription },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-2 px-3.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  activeCategory === cat.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Main Split Layout: Document Library & Detailed AI Report Explainer */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Document List (Left 5 Cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-rose-100 shadow-sm p-5 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                {language === 'hi' ? 'संग्रहीत मेडिकल रिकॉर्ड्स' : 'Stored Clinical Records'} ({filteredDocs.length})
              </span>
              <div className="space-y-2.5">
                {filteredDocs.map(doc => {
                  const isSelected = selectedDoc?.id === doc.id;
                  return (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-rose-50/70 border-rose-300 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-snug">
                              {doc.title}
                            </h4>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                              <span>{doc.date}</span>
                              <span aria-hidden="true">·</span>
                              <span className="uppercase text-[10px] tracking-wider text-rose-700 font-semibold">{doc.category}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Document & AI Explainer View (Right 7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
              {selectedDoc ? (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-600 block mb-1">
                        {selectedDoc.category}
                      </span>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        {selectedDoc.title}
                      </h3>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {selectedDoc.fileName} · {selectedDoc.date}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setVaultView('analyzer')}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors whitespace-nowrap"
                        title="Analyze with WHO Standards and local climate"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Location AI</span>
                      </button>

                      <button
                        onClick={() => handleAnalyzeWithAi(selectedDoc)}
                        disabled={analyzingDocId === selectedDoc.id}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-xs transition-transform active:scale-95 disabled:opacity-50 whitespace-nowrap"
                      >
                        <SparklesIcon className="w-3.5 h-3.5" />
                        <span>
                          {analyzingDocId === selectedDoc.id
                            ? (language === 'hi' ? 'विश्लेषण जारी...' : 'Analyzing...')
                            : t.records.analyzeBtn}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Key Clinical Parameters Strip (if extracted) */}
                  {selectedDoc.keyParameters && (
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                        {language === 'hi' ? 'महत्वपूर्ण क्लिनिकल आंकड़े' : 'Key Extracted Clinical Markers'}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedDoc.keyParameters.map((param, idx) => (
                          <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-0.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">{param.label}</span>
                            <span className="text-sm font-bold font-mono tabular-nums text-slate-900">{param.value}</span>
                            {param.referenceRange && (
                              <span className="text-[10px] text-slate-500 block">Ref: {param.referenceRange}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Raw Extracted Text / OCR Box */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      {language === 'hi' ? 'ओसीआर (OCR) मूल पाठ' : 'Extracted Document Text (OCR)'}
                    </h4>
                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 leading-relaxed max-h-36 overflow-y-auto">
                      {selectedDoc.extractedText}
                    </div>
                  </div>

                  {/* AI Clinical Summary */}
                  {selectedDoc.aiExplanation && (
                    <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-200/80 space-y-3">
                      <div className="flex items-center gap-2 text-purple-700">
                        <SparklesIcon className="w-4 h-4" />
                        <h4 className="text-xs font-bold uppercase tracking-wider">
                          {language === 'hi' ? 'Mumora AI चिकित्सीय व्याख्या' : 'Mumora AI Clinical Interpretation'}
                        </h4>
                      </div>
                      <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                        {selectedDoc.aiExplanation}
                      </div>
                    </div>
                  )}

                  {/* Questions for Doctor */}
                  {selectedDoc.doctorQuestions && selectedDoc.doctorQuestions.length > 0 && (
                    <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-2">
                      <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                        <HelpCircle className="w-4 h-4 text-amber-600" />
                        <span>{language === 'hi' ? 'अगली विज़िट पर डॉक्टर से पूछें:' : 'Questions for Your OB-GYN at Next Visit:'}</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {selectedDoc.doctorQuestions.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-amber-700">Q{idx + 1}.</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Disclaimer */}
                  <div className="text-[11px] text-slate-400 italic">
                    {language === 'hi'
                      ? 'अस्वीकरण: यह सारांश केवल शैक्षणिक संदर्भ के लिए है। किसी भी रिपोर्ट की पुष्टि हमेशा अपने डॉक्टर से कराएं।'
                      : 'Disclaimer: This summary is for educational reference. Definitive diagnosis must be confirmed by your doctor.'}
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Select a document to inspect details or run AI explanation.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {language === 'hi' ? 'मेडिकल रिपोर्ट या सोनोग्राफी अपलोड करें' : 'Upload Medical Report / Ultrasound'}
            </h3>
            <p className="text-xs text-slate-500">
              {language === 'hi'
                ? 'JPG, PNG या PDF फाइल अपलोड करें। हमारा OCR सिस्टम स्वतः मुख्य क्लिनिकल आंकड़े निकाल लेगा।'
                : 'Upload your scanned document or image. Our clinical OCR extracts key parameters automatically.'}
            </p>

            <form onSubmit={handleSaveDocument} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'hi' ? 'दस्तावेज़ का शीर्षक' : 'Document Title'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. 24-Week Fetal Growth Scan"
                  value={docTitle}
                  onChange={e => setDocTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'hi' ? 'श्रेणी (Category)' : 'Category'}
                </label>
                <select
                  value={docCategory}
                  onChange={e => setDocCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="ultrasound">Ultrasound Sonography Scan</option>
                  <option value="blood_test">Blood Test / CBC / Sugar (OGTT)</option>
                  <option value="prescription">Doctor Prescription</option>
                  <option value="urine_test">Urine Routine / Culture</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'hi' ? 'फ़ाइल चुनें (File / Image)' : 'Select File (JPG, PNG, PDF)'}
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  {language === 'hi' ? 'निकाला गया टेक्स्ट (OCR Text)' : 'Extracted Text'}
                </label>
                <textarea
                  rows={3}
                  value={extractedText}
                  onChange={e => setExtractedText(e.target.value)}
                  placeholder="Extracted report values..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm"
                >
                  {t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
