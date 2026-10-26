import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Apple,
  Terminal,
  ShieldCheck,
  X,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface MobileAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileAppModal: React.FC<MobileAppModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const isHi = language === 'hi';
  const [activeTab, setActiveTab] = useState<'install' | 'android' | 'ios' | 'eas'>('install');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-slate-900 leading-tight">
                {isHi ? 'मुमोरा मोबाइल ऐप (Android & iOS)' : 'Mumora Mobile App (Android & iOS)'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi
                  ? 'क्रॉस-प्लेटफ़ॉर्म प्रोडक्शन मोबाइल एप्लिकेशन'
                  : 'Production-ready cross-platform mobile application'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1.5 p-1 bg-purple-50 rounded-2xl overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setActiveTab('install')}
            className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'install'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isHi ? 'फोन में इंस्टॉल करें' : 'Install on Phone'}</span>
          </button>
          <button
            onClick={() => setActiveTab('android')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'android'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android APK/AAB</span>
          </button>
          <button
            onClick={() => setActiveTab('ios')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'ios'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>iOS App Store</span>
          </button>
          <button
            onClick={() => setActiveTab('eas')}
            className={`flex-1 min-w-[110px] py-2 px-3 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'eas'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Expo / EAS</span>
          </button>
        </div>

        {/* Tab 1: Instant Install (PWA) */}
        {activeTab === 'install' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-extrabold text-emerald-950 text-sm">
                  {isHi
                    ? 'त्वरित मोबाइल इंस्टॉलेशन सक्रिय है!'
                    : 'Instant Mobile Installation is Live!'}
                </h4>
                <p className="text-emerald-800 leading-relaxed">
                  {isHi
                    ? 'मुमोरा एक PWA (प्रोग्रेसिव वेब ऐप) के रूप में तैयार है। आप इसे सीधे अपने iPhone या Android फोन की होम स्क्रीन पर बिना ऐप स्टोर के इंस्टॉल कर सकते हैं।'
                    : 'Mumora includes a fully configured PWA manifest and service worker. You can install it right now directly to your iPhone or Android home screen with standalone native mode.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* iPhone Guide */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Apple className="w-4 h-4 text-slate-800" />
                  <span>iPhone / iPad (iOS Safari)</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 font-medium leading-relaxed">
                  <li>Open this URL in <strong>Safari</strong> on your iPhone.</li>
                  <li>Tap the <strong>Share</strong> button (box with arrow <Share2 className="w-3 h-3 inline text-purple-600" />) at the bottom.</li>
                  <li>Scroll down and tap <strong>"Add to Home Screen"</strong> (होम स्क्रीन पर जोड़ें).</li>
                  <li>Tap <strong>Add</strong>. Mumora will launch in standalone full-screen native mode!</li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                  <Smartphone className="w-4 h-4 text-purple-600" />
                  <span>Android (Chrome / Edge)</span>
                </div>
                <ol className="list-decimal pl-4 space-y-1.5 text-slate-600 font-medium leading-relaxed">
                  <li>Open this URL in <strong>Chrome</strong> on your Android phone.</li>
                  <li>Tap the <strong>three dots (⋮)</strong> in the top-right corner.</li>
                  <li>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</li>
                  <li>Confirm installation. The app will appear in your app drawer with the official Mumora icon!</li>
                </ol>
              </div>
            </div>

            {/* Download Full Mobile Codebase */}
            <div className="pt-2 flex items-center justify-between p-3.5 bg-purple-50 rounded-2xl border border-purple-100">
              <div className="space-y-0.5">
                <span className="font-extrabold text-purple-950 text-xs block">
                  {isHi ? 'मोबाइल प्रोजेक्ट कोड (.zip) डाउनलोड करें' : 'Download Complete Mobile Project (.zip)'}
                </span>
                <span className="text-[11px] text-purple-700">
                  Includes /android Gradle project, /ios Xcode workspace, and Capacitor configuration.
                </span>
              </div>
              <a
                href="/api/download-zip"
                download="mumora-mobile-app.zip"
                className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-extrabold text-xs flex items-center gap-1.5 shadow-sm shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download ZIP</span>
              </a>
            </div>
          </div>
        )}

        {/* Tab 2: Android Native APK & AAB */}
        {activeTab === 'android' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-purple-300 font-bold font-sans">
                <span>Android Build Commands (Capacitor / Gradle)</span>
                <Terminal className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400"># 1. Sync web assets with native Android project:</span>
                  <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                    npm run mobile:build
                  </p>
                </div>
                <div>
                  <span className="text-slate-400"># 2. Build Debug APK (for instant phone testing):</span>
                  <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                    cd android &amp;&amp; ./gradlew assembleDebug
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Output: android/app/build/outputs/apk/debug/app-debug.apk
                  </span>
                </div>
                <div>
                  <span className="text-slate-400"># 3. Build Release AAB (for Google Play Store upload):</span>
                  <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                    cd android &amp;&amp; ./gradlew bundleRelease
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Output: android/app/build/outputs/bundle/release/app-release.aab
                  </span>
                </div>
                <div>
                  <span className="text-slate-400"># 4. Open in Android Studio:</span>
                  <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                    npx cap open android
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1 text-slate-700">
              <span className="font-extrabold text-purple-900 block">Package Configuration:</span>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>Application ID:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-900 font-mono">com.mumora.health</code></li>
                <li><strong>Target Android SDK:</strong> 35 (Android 15) with minimum SDK 22 (Android 5.1 Lollipop)</li>
                <li><strong>Configured Permissions:</strong> Camera, Storage, Media Images, Post Notifications, Network State</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 3: iOS Native App Store */}
        {activeTab === 'ios' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-3 font-mono text-[11px]">
              <div className="flex items-center justify-between text-purple-300 font-bold font-sans">
                <span>iOS Build Workflow (Xcode / TestFlight)</span>
                <Apple className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div>
                  <span className="text-slate-400"># 1. Sync web assets with native Xcode project:</span>
                  <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                    npm run mobile:build
                  </p>
                </div>
                <div>
                  <span className="text-slate-400"># 2. Open project in Xcode on macOS:</span>
                  <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                    npx cap open ios
                  </p>
                </div>
                <div>
                  <span className="text-slate-400"># 3. Archive &amp; Upload to TestFlight:</span>
                  <p className="text-slate-300 bg-black/40 p-2 rounded-lg mt-0.5 font-sans text-xs">
                    In Xcode: Select <strong>Any iOS Device (arm64)</strong> &gt; Menu: <strong>Product &gt; Archive</strong> &gt; Click <strong>Distribute App</strong> to publish to TestFlight or Apple App Store.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl space-y-1 text-slate-700">
              <span className="font-extrabold text-purple-900 block">iOS Bundle Configuration:</span>
              <ul className="list-disc pl-4 space-y-1 text-[11px]">
                <li><strong>Bundle Identifier:</strong> <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-900 font-mono">com.mumora.health</code></li>
                <li><strong>Apple Privacy Keys Configured:</strong> <code className="text-purple-800">NSCameraUsageDescription</code>, <code className="text-purple-800">NSPhotoLibraryUsageDescription</code>, <code className="text-purple-800">NSPhotoLibraryAddUsageDescription</code></li>
                <li><strong>Background Modes:</strong> Remote Push Notifications enabled</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Expo / EAS Cloud Build */}
        {activeTab === 'eas' && (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              If you don't have Android Studio or a Mac with Xcode, you can use <strong>Expo Application Services (EAS Build)</strong> to generate your Android APK/AAB and iOS IPA in the cloud.
            </p>

            <div className="p-4 bg-slate-900 text-slate-100 rounded-2xl space-y-2 font-mono text-[11px]">
              <div>
                <span className="text-slate-400"># 1. Install EAS CLI:</span>
                <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                  npm install -g eas-cli
                </p>
              </div>
              <div>
                <span className="text-slate-400"># 2. Build Android APK directly in the cloud:</span>
                <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                  eas build -p android --profile preview
                </p>
              </div>
              <div>
                <span className="text-slate-400"># 3. Build Google Play Store AAB:</span>
                <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                  eas build -p android --profile production
                </p>
              </div>
              <div>
                <span className="text-slate-400"># 4. Build iOS IPA for TestFlight:</span>
                <p className="text-emerald-400 bg-black/40 p-2 rounded-lg mt-0.5 select-all">
                  eas build -p ios --profile production
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Both <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">app.json</code> and <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">eas.json</code> are pre-configured in the project root.
              </span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            Mumora v1.0.0 · com.mumora.health
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-extrabold text-xs shadow-xs transition-colors"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
