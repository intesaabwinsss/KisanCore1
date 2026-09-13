import React, { useState } from 'react';
import { 
  X, 
  UserCheck, 
  Tractor, 
  MapPin, 
  CreditCard, 
  LandPlot, 
  CheckCircle2, 
  ShieldCheck, 
  Building2, 
  Smartphone,
  Sparkles
} from 'lucide-react';
import { FarmerProfile } from '../types';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: FarmerProfile;
  onSaveProfile: (updated: FarmerProfile) => void;
  isNewRegistration?: boolean;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  isNewRegistration = false,
}) => {
  const [formData, setFormData] = useState<FarmerProfile>(profile);
  const [cropInput, setCropInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddCrop = () => {
    if (cropInput.trim() && !formData.primaryCrops.includes(cropInput.trim())) {
      setFormData({
        ...formData,
        primaryCrops: [...formData.primaryCrops, cropInput.trim()],
      });
      setCropInput('');
    }
  };

  const handleRemoveCrop = (cropToRemove: string) => {
    setFormData({
      ...formData,
      primaryCrops: formData.primaryCrops.filter(c => c !== cropToRemove),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      isVerified: true,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-gradient-to-br from-white/80 via-slate-50/50 to-emerald-50/40 backdrop-blur-xl hover:border-emerald-400/60 hover:shadow-[0_8px_32px_rgba(52,211,153,0.15)] hover:-translate-y-0.5 transition-all duration-500 gradient-border-organic border-0 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 gradient-border-organic border-0 shadow-2xl animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Tractor className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <h2 className="text-xl font-display font-extrabold text-slate-900">
                {isNewRegistration ? 'Farmer Digital Registration' : 'Farmer Profile & Bank Settings'}
              </h2>
              <p className="text-xs text-slate-500">
                {isNewRegistration
                  ? 'Join 48,000+ verified farmers selling directly to buyers with 0% commission'
                  : 'Manage farm identity, verified FPO membership, and instant UPI payout details'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Profile details saved and verified successfully! Your instant payout account is active.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Personal & Farm Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>1. Farmer & Farm Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Farmer Full Name (as per Bank/Aadhaar) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Rameshwar Bapu Patil"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (WhatsApp Enabled) *
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98231 45012"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Farm / Orchard Name
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                  placeholder="e.g. Shree Ganesh Krishi Farm"
                  className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Total Land Holding (in Acres) *
                </label>
                <div className="relative">
                  <LandPlot className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="number"
                    step="0.1"
                    min="0.5"
                    required
                    value={formData.landHoldingAcres}
                    onChange={(e) => setFormData({ ...formData, landHoldingAcres: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 14.5"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Farm Location */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>2. Farm Location & Region</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Village / Gram *
                </label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  placeholder="e.g. Pimpalgaon Baswant"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Taluk / Tehsil
                </label>
                <input
                  type="text"
                  value={formData.taluk}
                  onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                  placeholder="e.g. Niphad"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="e.g. Nashik"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  FPO / Cooperative Association (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.fpoName || ''}
                    onChange={(e) => setFormData({ ...formData, fpoName: e.target.value })}
                    placeholder="e.g. Sahyadri Farmers Producer Co."
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  KCC / PM-Kisan ID (for verified badge)
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={formData.kccNumber || ''}
                    onChange={(e) => setFormData({ ...formData, kccNumber: e.target.value })}
                    placeholder="e.g. KCC-MH-NSK-8891024"
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Crops Cultivated */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <span>3. Primary Crops Cultivated</span>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {formData.primaryCrops.map((crop) => (
                <span
                  key={crop}
                  className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5"
                >
                  <span>{crop}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCrop(crop)}
                    className="text-emerald-700 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={cropInput}
                onChange={(e) => setCropInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCrop();
                  }
                }}
                placeholder="Type crop name (e.g. Turmeric, Soybean, Mango) and press Add"
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-emerald-600"
              />
              <button
                type="button"
                onClick={handleAddCrop}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Add Crop
              </button>
            </div>
          </div>

          {/* Section 4: Bank Account & Instant UPI Settlement */}
          <div className="space-y-4 p-4 rounded-2xl bg-slate-50 gradient-border-organic border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
                <CreditCard className="w-4 h-4 text-emerald-700" />
                <span>4. Bank Account & Instant UPI for 0% Escrow Payouts</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Encrypted & NPCI Compliant
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Bank Name & Branch *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccount.bankName}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankAccount: { ...formData.bankAccount, bankName: e.target.value },
                  })}
                  placeholder="e.g. Bank of Maharashtra, Pimpalgaon"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Account Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccount.accountNumber}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankAccount: { ...formData.bankAccount, accountNumber: e.target.value },
                  })}
                  placeholder="e.g. 6019842104910"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  IFSC Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccount.ifscCode}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankAccount: { ...formData.bankAccount, ifscCode: e.target.value.toUpperCase() },
                  })}
                  placeholder="e.g. MAHB0000421"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Instant UPI ID (VPA for Real-Time Payout) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bankAccount.upiId}
                  onChange={(e) => setFormData({
                    ...formData,
                    bankAccount: { ...formData.bankAccount, upiId: e.target.value },
                  })}
                  placeholder="e.g. rameshwar.patil@okaxis"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-emerald-600 font-mono text-emerald-800 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all"
            >
              {isNewRegistration ? 'Complete Registration' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
