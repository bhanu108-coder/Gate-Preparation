import React from 'react';
import { X, Sparkles, Check, ShieldCheck, Zap, BookOpen } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#141416] border border-[#27272A] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Top Banner */}
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#1D4ED8] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-[12px] font-bold tracking-wider uppercase mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GATE Prep Pro Workspace</span>
          </div>
          <h3 className="text-[24px] font-bold leading-tight">
            Accelerate Your All India Rank
          </h3>
          <p className="text-white/80 text-[14px] mt-1">
            Unlock AI-powered PDF digitization, 30+ full mock tests, and synced video notes export.
          </p>
        </div>

        {/* Benefits */}
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {[
              'Unlimited PDF & handwritten coaching notes OCR digitization',
              'Detailed video solutions for all 1,248+ GATE CS Previous Year Questions',
              'Subject-wise difficulty benchmarking & weak topic diagnosis',
              'Personalized daily 4-hour adaptive schedule planner',
              'Synchronized timestamped notes export to PDF & Notion',
            ].map((benefit, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#10B981]/20 text-[#34D399] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="text-[14px] text-[#FAFAFA]">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Pricing Box */}
          <div className="bg-[#18181B] border border-[#2563EB]/40 rounded-xl p-4 flex items-center justify-between mt-4">
            <div>
              <span className="text-[12px] font-bold text-[#60A5FA] uppercase tracking-wider block">Full Year Access</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-[24px] font-bold text-[#FAFAFA]">₹1,499</span>
                <span className="text-[13px] text-[#71717A] line-through">₹4,999</span>
                <span className="text-[12px] font-bold text-[#34D399] ml-2">70% OFF</span>
              </div>
            </div>
            <button
              onClick={() => {
                alert('Upgraded to GATE Prep Pro Workspace!');
                onClose();
              }}
              className="px-6 py-2.5 bg-[#2563EB] text-white rounded-lg font-bold text-[13px] hover:bg-[#1D4ED8] transition-colors shadow-xs"
            >
              Get Pro Access
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="px-6 py-3 bg-[#18181B] border-t border-[#27272A] text-center text-[12px] text-[#A1A1AA] flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#34D399]" />
          <span>7-day risk-free academic satisfaction guarantee</span>
        </div>
      </div>
    </div>
  );
};
