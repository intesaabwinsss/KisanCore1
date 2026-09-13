import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Search,
  Filter,
  Cpu,
  BadgeCheck,
  Fingerprint,
} from 'lucide-react';

interface TransactionLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LedgerEntry {
  txId: string;
  blockNumber: number;
  blockHash: string;
  prevBlockHash: string;
  timestamp: string;
  orderNumber: string;
  cropName: string;
  quantity: string;
  amount: number;
  buyerName: string;
  farmerName: string;
  status: 'SETTLED' | 'ESCROW_LOCKED' | 'AUDIT_VERIFIED';
  encryptionType: string;
  signature: string;
}

const MOCK_LEDGER: LedgerEntry[] = [
  {
    txId: 'TX-KD-99482-A1',
    blockNumber: 104291,
    blockHash: '0x8f2a9c14e712ba6d9410ef39b207ca91834fd2a7e4b9c10d32e91a0b3c4d5e6f',
    prevBlockHash: '0x7e1b8b03d601aa5c8309de28a196b980723ec196d3a8b09c21d8099a2b3c4d5e',
    timestamp: '2026-09-02 09:30:14 IST',
    orderNumber: '#10243',
    cropName: 'Tomato (Abhinav Hybrid)',
    quantity: '500 kg',
    amount: 11000,
    buyerName: 'Restaurant XYZ (Bistro Green)',
    farmerName: 'Ramesh Kumar',
    status: 'SETTLED',
    encryptionType: 'AES-256-GCM + ECDSA-secp256k1',
    signature: 'SIG:04a89f...aadhaar_verified_sha256',
  },
  {
    txId: 'TX-KD-99483-B2',
    blockNumber: 104292,
    blockHash: '0x9a3b0d25f823cb7e0521fe40c318db02945fe3b8f5ca01e43f012b1c4d5e6f7a',
    prevBlockHash: '0x8f2a9c14e712ba6d9410ef39b207ca91834fd2a7e4b9c10d32e91a0b3c4d5e6f',
    timestamp: '2026-09-02 11:15:42 IST',
    orderNumber: '#10244',
    cropName: 'Potato (Kufri Jyoti)',
    quantity: '300 kg',
    amount: 5400,
    buyerName: 'FreshMart Supermarket',
    farmerName: 'Ramesh Kumar',
    status: 'ESCROW_LOCKED',
    encryptionType: 'AES-256-GCM + Smart Escrow Contract',
    signature: 'SIG:18c92e...smart_escrow_holding_pool',
  },
  {
    txId: 'TX-KD-99484-C3',
    blockNumber: 104293,
    blockHash: '0xab4c1e36a934dc8f1632af51d429ec13056af4c9a6db12f54a123c2d5e6f7a8b',
    prevBlockHash: '0x9a3b0d25f823cb7e0521fe40c318db02945fe3b8f5ca01e43f012b1c4d5e6f7a',
    timestamp: '2026-09-01 16:45:10 IST',
    orderNumber: '#10245',
    cropName: 'Onion (Nashik Red Grade A)',
    quantity: '200 kg',
    amount: 5600,
    buyerName: 'Taj City Bistro',
    farmerName: 'Ramesh Kumar',
    status: 'AUDIT_VERIFIED',
    encryptionType: 'AES-256-GCM + ECDSA-secp256k1',
    signature: 'SIG:44e21a...automated_instant_settlement',
  },
];

export const TransactionLedgerModal: React.FC<TransactionLedgerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEntries = MOCK_LEDGER.filter(
    (e) =>
      e.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.cropName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold text-lg border border-emerald-500/30">
              🔐
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white">
                  KisanDirect Cryptographic Transaction Ledger
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30">
                  Cyber Security Audit Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Immutable, tamper-evident audit trail of farmer payments, smart escrows, and digital trade contracts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Specs Banner */}
        <div className="bg-slate-950/60 p-4 border-b border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Data Cipher</div>
              <div className="font-mono font-bold text-slate-200">AES-256-GCM</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Identity Verification</div>
              <div className="font-mono font-bold text-slate-200">Aadhaar e-Sign</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Hash Function</div>
              <div className="font-mono font-bold text-slate-200">SHA-256 Chained</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold">Escrow Guarantee</div>
              <div className="font-mono font-bold text-slate-200">100% Locked Pool</div>
            </div>
          </div>
        </div>

        {/* Search & Ledger Entries */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search Tx Hash, Order #, or Buyer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 focus:outline-emerald-500"
              />
            </div>
            <div className="text-xs text-slate-400 font-mono">
              Displaying {filteredEntries.length} Cryptographic Blocks
            </div>
          </div>

          <div className="space-y-3">
            {filteredEntries.map((entry) => (
              <div
                key={entry.txId}
                className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 hover:border-slate-600 transition-all space-y-3"
              >
                {/* Entry Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-emerald-400 text-sm">
                      {entry.txId}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono text-[10px]">
                      Block #{entry.blockNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      {entry.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 font-mono">
                    {entry.timestamp}
                  </div>
                </div>

                {/* Deal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-700/40">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Trade Order & Crop
                    </span>
                    <span className="font-bold text-white">
                      {entry.orderNumber} — {entry.cropName}
                    </span>
                    <div className="text-slate-400 text-[11px]">{entry.quantity}</div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Counterparty Direct Buyer
                    </span>
                    <span className="font-bold text-white">{entry.buyerName}</span>
                    <div className="text-emerald-400 font-bold text-[11px]">
                      Farmer: {entry.farmerName}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Settled / Escrow Amount
                    </span>
                    <span className="text-base font-black text-emerald-400 font-mono">
                      ₹{entry.amount.toLocaleString('en-IN')}
                    </span>
                    <div className="text-slate-400 text-[10px]">UPI / IMPS Auto-Credit</div>
                  </div>
                </div>

                {/* Hashes and Cryptographic Signature */}
                <div className="space-y-1.5 text-[11px] font-mono text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <div className="flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-slate-500 shrink-0">Block Hash:</span>
                    <span className="truncate text-emerald-300">{entry.blockHash}</span>
                    <button
                      onClick={() => handleCopy(entry.blockHash, `${entry.txId}-hash`)}
                      className="text-slate-400 hover:text-white shrink-0 p-1"
                      title="Copy Hash"
                    >
                      {copiedId === `${entry.txId}-hash` ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 overflow-hidden">
                    <span className="text-slate-500 shrink-0">Parent Hash:</span>
                    <span className="truncate text-slate-400">{entry.prevBlockHash}</span>
                  </div>

                  <div className="flex items-center justify-between gap-2 overflow-hidden pt-1 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-500 shrink-0">Digital Signature:</span>
                    <span className="truncate text-amber-300">{entry.signature}</span>
                    <span className="text-emerald-400 font-bold text-[10px] shrink-0">
                      ✓ Valid
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span>Cryptographic integrity verified across all nodes. Zero unauthorized alterations.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
