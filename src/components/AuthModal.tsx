import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { X, User as UserIcon, Lock, Mail, Phone, MapPin, Building, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import { RoleType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (role: RoleType) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const { login, registerKisan, registerConsumer, users } = useAuth();
  const { language } = useLanguage();
  
  const [mode, setMode] = useState<'login' | 'register_choice' | 'register_kisan' | 'register_consumer'>('login');
  
  // Login fields
  const [identifier, setIdentifier] = useState('');
  const [loginPass, setLoginPass] = useState('');
  
  // Registration fields
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('12345');
  const [confirmPass, setConfirmPass] = useState('12345');
  const [location, setLocation] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  
  // Document fields for Kisan verification
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!identifier || !loginPass) {
      setError(language === 'hi' ? 'कृपया सभी फ़ील्ड भरें' : language === 'mr' ? 'कृपया सर्व माहिती भरा' : 'Please fill all fields');
      return;
    }
    
    const user = login(identifier, loginPass);
    if (user) {
      onLoginSuccess(user.role === 'farmer' ? 'farmer' : 'consumer');
      onClose();
    } else {
      setError(language === 'hi' ? 'अमान्य क्रेडेंशियल्स' : language === 'mr' ? 'अवैध लॉगिन माहिती' : 'Invalid credentials');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'aadhaar' | 'pan') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError(language === 'hi' ? `${type === 'aadhaar' ? 'आधार' : 'पैन'} कार्ड 5MB से कम होना चाहिए` : language === 'mr' ? `${type === 'aadhaar' ? 'आधार' : 'पॅन'} कार्ड 5MB पेक्षा कमी असावे` : `${type === 'aadhaar' ? 'Aadhaar' : 'PAN'} Card must be less than 5MB`);
      return;
    }
    const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
       setError(language === 'hi' ? 'अमान्य फ़ाइल प्रकार। कृपया JPG, PNG या PDF का उपयोग करें।' : language === 'mr' ? 'अवैध फाइल प्रकार. कृपया JPG, PNG किंवा PDF वापरा.' : `Invalid file type for ${type === 'aadhaar' ? 'Aadhaar' : 'PAN'}. Use JPG, PNG, or PDF.`);
       return;
    }

    setError('');
    if (type === 'aadhaar') setAadhaarFile(file);
    else setPanFile(file);
  };

  const handleRegisterKisan = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!name || !mobile || !pass || !confirmPass || !location || !state || !district) {
      setError(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : language === 'mr' ? 'कृपया सर्व आवश्यक माहिती भरा' : 'Please fill all required fields');
      return;
    }
    
    if (pass !== confirmPass) {
      setError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : language === 'mr' ? 'पासवर्ड जुळत नाहीत' : 'Passwords do not match');
      return;
    }

    if (!aadhaarFile || !panFile) {
      setError(language === 'hi' ? 'किसान सत्यापन के लिए आधार कार्ड और पैन कार्ड दोनों अनिवार्य हैं।' : language === 'mr' ? 'शेतकरी पडताळणीसाठी आधार कार्ड आणि पॅन कार्ड दोन्ही अनिवार्य आहेत.' : 'Both Aadhaar Card and PAN Card are mandatory for Kisan Verification.');
      return;
    }
    
    try {
      const user = registerKisan({ 
        name, mobile, email, password: pass, location, state, district,
        isVerified: true,
        documents: {
          aadhaar: { name: aadhaarFile.name, size: aadhaarFile.size, type: aadhaarFile.type },
          pan: { name: panFile.name, size: panFile.size, type: panFile.type }
        }
      });
      setSuccessMessage(language === 'hi' ? 'किसान पंजीकरण एवं सत्यापन सफलतापूर्वक सबमिट किया गया।' : language === 'mr' ? 'शेतकरी नोंदणी आणि पडताळणी यशस्वीरीत्या सादर केली.' : 'Kisan Registration & Verification Submitted Successfully.');
      setTimeout(() => {
        onLoginSuccess('farmer');
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || (language === 'hi' ? 'पंजीकरण विफल रहा' : language === 'mr' ? 'नोंदणी अयशस्वी' : 'Registration failed'));
    }
  };

  const handleRegisterConsumer = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !mobile || !email || !pass || !confirmPass || !location) {
      setError(language === 'hi' ? 'कृपया सभी आवश्यक फ़ील्ड भरें' : language === 'mr' ? 'कृपया सर्व आवश्यक माहिती भरा' : 'Please fill all required fields');
      return;
    }
    
    if (pass !== confirmPass) {
      setError(language === 'hi' ? 'पासवर्ड मेल नहीं खाते' : language === 'mr' ? 'पासवर्ड जुळत नाहीत' : 'Passwords do not match');
      return;
    }
    
    try {
      const user = registerConsumer({ name, mobile, email, password: pass, location });
      onLoginSuccess('consumer');
      onClose();
    } catch (err: any) {
      setError(err.message || (language === 'hi' ? 'पंजीकरण विफल रहा' : language === 'mr' ? 'नोंदणी अयशस्वी' : 'Registration failed'));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-emerald-700 p-6 text-white shrink-0 relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-display font-bold">
            {mode === 'login' && (language === 'hi' ? 'पुनः स्वागत है' : language === 'mr' ? 'पुन्हा स्वागत आहे' : 'Welcome Back')}
            {mode === 'register_choice' && (language === 'hi' ? 'खाता बनाएं' : language === 'mr' ? 'खाते तयार करा' : 'Create an Account')}
            {mode === 'register_kisan' && (language === 'hi' ? 'किसान पंजीकरण' : language === 'mr' ? 'शेतकरी नोंदणी' : 'Farmer Registration')}
            {mode === 'register_consumer' && (language === 'hi' ? 'उपभोक्ता पंजीकरण' : language === 'mr' ? 'ग्राहक नोंदणी' : 'Consumer Registration')}
          </h2>
          <p className="text-emerald-100 text-sm mt-1">
            {mode === 'login' && (language === 'hi' ? 'अपने KisanDirect डैशबोर्ड तक पहुँचने के लिए लॉगिन करें' : language === 'mr' ? 'आपल्या KisanDirect डॅशबोर्डवर प्रवेश करण्यासाठी लॉगिन करा' : 'Login to access your KisanDirect dashboard')}
            {mode === 'register_choice' && (language === 'hi' ? 'प्रत्यक्ष बाज़ार में शामिल होने के लिए अपनी भूमिका चुनें' : language === 'mr' ? 'थेट बाजारात सामील होण्यासाठी आपली भूमिका निवडा' : 'Select your role to join the direct marketplace')}
            {mode === 'register_kisan' && (language === 'hi' ? 'सीधे बेचने के लिए एक किसान के रूप में जुड़ें' : language === 'mr' ? 'थेट विक्रीसाठी शेतकरी म्हणून सामील व्हा' : 'Join as a farmer to sell directly')}
            {mode === 'register_consumer' && (language === 'hi' ? 'किसानों से सीधे ताजा उपज खरीदने के लिए जुड़ें' : language === 'mr' ? 'शेतकऱ्यांकडून थेट ताजी उत्पादने खरेदी करण्यासाठी सामील व्हा' : 'Join to buy fresh produce directly from farmers')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-sm font-medium">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              {successMessage}
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'मोबाइल नंबर या ईमेल' : language === 'mr' ? 'मोबाईल नंबर किंवा ईमेल' : 'Mobile Number or Email'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm"
                    placeholder={language === 'hi' ? 'मोबाइल या ईमेल दर्ज करें' : language === 'mr' ? 'मोबाईल किंवा ईमेल टाका' : 'Enter mobile or email'}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'पासवर्ड' : language === 'mr' ? 'पासवर्ड' : 'Password'}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPass}
                    onChange={(e) => setLoginPass(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm"
                    placeholder={language === 'hi' ? 'पासवर्ड दर्ज करें' : language === 'mr' ? 'पासवर्ड टाका' : 'Enter password'}
                  />
                </div>
              </div>
              <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer">
                {language === 'hi' ? 'सुरक्षित लॉगिन' : language === 'mr' ? 'सुरक्षित लॉगिन' : 'Secure Login'}
              </button>
              
              {users.filter(u => u.role === 'farmer').length > 0 && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs font-bold text-slate-500 mb-2 uppercase">
                    {language === 'hi' ? 'मौजूदा किसान चुनें' : language === 'mr' ? 'विद्यमान शेतकरी निवडा' : 'Remember existing kisan'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {users.filter(u => u.role === 'farmer').map(user => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          const loggedInUser = login(user.mobile, user.password);
                          if (loggedInUser) {
                            onLoginSuccess(loggedInUser.role);
                            onClose();
                          } else {
                            setIdentifier(user.mobile);
                            setLoginPass(user.password);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex flex-col items-start transition-colors text-left cursor-pointer"
                      >
                        <span className="truncate max-w-[120px]">{user.name}</span>
                        <span className="text-[10px] font-normal opacity-70 truncate max-w-[120px]">ID: {user.mobile}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="text-center mt-4">
                <span className="text-slate-500 text-sm">
                  {language === 'hi' ? 'खाता नहीं है? ' : language === 'mr' ? 'खाते नाही का? ' : "Don't have an account? "}
                </span>
                <button type="button" onClick={() => { setError(''); setMode('register_choice'); }} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                  {language === 'hi' ? 'यहाँ पंजीकरण करें' : language === 'mr' ? 'येथे नोंदणी करा' : 'Register here'}
                </button>
              </div>
            </form>
          )}

          {mode === 'register_choice' && (
            <div className="space-y-4">
              <button
                onClick={() => { setError(''); setMode('register_kisan'); }}
                className="w-full p-4 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-2xl flex items-center gap-4 transition-all group text-left cursor-pointer"
              >
                <div className="w-12 h-12 bg-amber-100 group-hover:bg-amber-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">👨‍🌾</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {language === 'hi' ? 'किसान / कृषक' : language === 'mr' ? 'शेतकरी / उत्पादक' : 'Kisan / Farmer'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'अपनी उपज सीधे उपभोक्ताओं को बेचें और ₹10,000 जॉइनिंग बोनस पाएं।' : language === 'mr' ? 'आपली उत्पादने थेट ग्राहकांना विका आणि ₹10,000 जॉइनिंग बोनस मिळवा.' : 'Sell your produce directly to consumers & get ₹10,000 joining bonus.'}
                  </p>
                </div>
              </button>
              
              <button
                onClick={() => { setError(''); setMode('register_consumer'); }}
                className="w-full p-4 border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 rounded-2xl flex items-center gap-4 transition-all group text-left cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-2xl">🛒</span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">
                    {language === 'hi' ? 'उपभोक्ता / खरीदार' : language === 'mr' ? 'ग्राहक / खरेदीदार' : 'Consumer / Buyer'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {language === 'hi' ? 'स्थानीय किसानों से बेहतर कीमतों पर सीधे ताजा उपज खरीदें।' : language === 'mr' ? 'स्थानिक शेतकऱ्यांकडून चांगल्या दरात थेट ताजी उत्पादने खरेदी करा.' : 'Buy fresh produce directly from local farmers at better prices.'}
                  </p>
                </div>
              </button>
              
              <div className="text-center mt-4 pt-4 border-t border-slate-100">
                <span className="text-slate-500 text-sm">
                  {language === 'hi' ? 'पहले से खाता है? ' : language === 'mr' ? 'आधीच खाते आहे? ' : 'Already have an account? '}
                </span>
                <button type="button" onClick={() => { setError(''); setMode('login'); }} className="text-emerald-600 font-bold hover:underline cursor-pointer">
                  {language === 'hi' ? 'यहाँ लॉगिन करें' : language === 'mr' ? 'येथे लॉगिन करा' : 'Login here'}
                </button>
              </div>
            </div>
          )}

          {mode === 'register_kisan' && (
            <form onSubmit={handleRegisterKisan} className="space-y-4">
              {/* Form fields for Kisan */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'पूरा नाम *' : language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}
                  </label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Name" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'मोबाइल *' : language === 'mr' ? 'मोबाईल *' : 'Mobile *'}
                  </label>
                  <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="10-digit mobile" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'ईमेल (वैकल्पिक)' : language === 'mr' ? 'ईमेल (पर्यायी)' : 'Email (Optional)'}
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Email address" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'पासवर्ड *' : language === 'mr' ? 'पासवर्ड *' : 'Password *'}
                  </label>
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Password" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'पासवर्ड की पुष्टि करें *' : language === 'mr' ? 'पासवर्डची पुष्टी करा *' : 'Confirm Password *'}
                  </label>
                  <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Confirm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'गाँव/कस्बा स्थान *' : language === 'mr' ? 'गाव/शहर स्थान *' : 'Village/Town Location *'}
                </label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Your farm location" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'ज़िला *' : language === 'mr' ? 'जिल्हा *' : 'District *'}
                  </label>
                  <input type="text" value={district} onChange={e => setDistrict(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="District" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'राज्य *' : language === 'mr' ? 'राज्य *' : 'State *'}
                  </label>
                  <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="State" />
                </div>
              </div>

              {/* Document Verification Section */}
              <div className="pt-2">
                <h4 className="text-sm font-bold text-slate-800 mb-2 border-b border-slate-100 pb-2">
                  {language === 'hi' ? 'दस्तावेज़ सत्यापन (अनिवार्य)' : language === 'mr' ? 'कागदपत्र पडताळणी (अनिवार्य)' : 'Document Verification (Mandatory)'}
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'hi' ? 'आधार कार्ड * (JPG, PNG, PDF)' : language === 'mr' ? 'आधार कार्ड * (JPG, PNG, PDF)' : 'Aadhaar Card * (JPG, PNG, PDF)'}
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png,.pdf" 
                        onChange={(e) => handleFileChange(e, 'aadhaar')}
                        className="hidden" 
                        id="aadhaar-upload" 
                      />
                      <label 
                        htmlFor="aadhaar-upload" 
                        className={`flex items-center justify-between w-full px-3 py-2 border rounded-xl cursor-pointer transition-colors text-sm ${aadhaarFile ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span className="truncate max-w-[200px]">{aadhaarFile ? aadhaarFile.name : (language === 'hi' ? 'आधार कार्ड अपलोड करें' : language === 'mr' ? 'आधार कार्ड अपलोड करा' : 'Upload Aadhaar Card')}</span>
                        {aadhaarFile ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Upload className="w-4 h-4 text-slate-400 shrink-0" />}
                      </label>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'hi' ? 'पैन कार्ड * (JPG, PNG, PDF)' : language === 'mr' ? 'पॅन कार्ड * (JPG, PNG, PDF)' : 'PAN Card * (JPG, PNG, PDF)'}
                    </label>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept=".jpg,.jpeg,.png,.pdf" 
                        onChange={(e) => handleFileChange(e, 'pan')}
                        className="hidden" 
                        id="pan-upload" 
                      />
                      <label 
                        htmlFor="pan-upload" 
                        className={`flex items-center justify-between w-full px-3 py-2 border rounded-xl cursor-pointer transition-colors text-sm ${panFile ? 'border-emerald-500 bg-emerald-50 text-emerald-800' : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-600'}`}
                      >
                        <span className="truncate max-w-[200px]">{panFile ? panFile.name : (language === 'hi' ? 'पैन कार्ड अपलोड करें' : language === 'mr' ? 'पॅन कार्ड अपलोड करा' : 'Upload PAN Card')}</span>
                        {panFile ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <Upload className="w-4 h-4 text-slate-400 shrink-0" />}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex gap-3 mt-4">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                <p className="text-xs text-emerald-800">
                  <strong>{language === 'hi' ? 'विशेष ऑफर:' : language === 'mr' ? 'विशेष ऑफर:' : 'Special Offer:'}</strong> {language === 'hi' ? 'आज ही किसान के रूप में पंजीकरण करें और अपने किसान वॉलेट में तुरंत ₹10,000 जॉइनिंग बोनस प्राप्त करें!' : language === 'mr' ? 'आजच शेतकरी म्हणून नोंदणी करा आणि आपल्या किसान वॉलेटमध्ये त्वरित ₹10,000 जॉइनिंग बोनस मिळवा!' : 'Register as a Farmer today and get a ₹10,000 joining bonus credited instantly to your Kisan Wallet!'}
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setMode('register_choice')} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">
                  {language === 'hi' ? 'पीछे' : language === 'mr' ? 'मागे' : 'Back'}
                </button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer">
                  {language === 'hi' ? 'किसान के रूप में पंजीकरण करें' : language === 'mr' ? 'शेतकरी म्हणून नोंदणी करा' : 'Register as Kisan'}
                </button>
              </div>
            </form>
          )}

          {mode === 'register_consumer' && (
            <form onSubmit={handleRegisterConsumer} className="space-y-4">
              {/* Form fields for Consumer */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'पूरा नाम *' : language === 'mr' ? 'पूर्ण नाव *' : 'Full Name *'}
                </label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Name" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'मोबाइल *' : language === 'mr' ? 'मोबाईल *' : 'Mobile *'}
                  </label>
                  <input type="tel" value={mobile} onChange={e => setMobile(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="10-digit mobile" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'ईमेल *' : language === 'mr' ? 'ईमेल *' : 'Email *'}
                  </label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Email address" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'पासवर्ड *' : language === 'mr' ? 'पासवर्ड *' : 'Password *'}
                  </label>
                  <input type="password" value={pass} onChange={e => setPass(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Password" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'hi' ? 'पासवर्ड की पुष्टि करें *' : language === 'mr' ? 'पासवर्डची पुष्टी करा *' : 'Confirm Password *'}
                  </label>
                  <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Confirm" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {language === 'hi' ? 'डिलीवरी स्थान *' : language === 'mr' ? 'डिलिव्हरी स्थान *' : 'Delivery Location *'}
                </label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-emerald-600 text-sm" placeholder="Your city/area" />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setMode('register_choice')} className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer">
                  {language === 'hi' ? 'पीछे' : language === 'mr' ? 'मागे' : 'Back'}
                </button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors cursor-pointer">
                  {language === 'hi' ? 'उपभोक्ता के रूप में पंजीकरण करें' : language === 'mr' ? 'ग्राहक म्हणून नोंदणी करा' : 'Register as Consumer'}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
