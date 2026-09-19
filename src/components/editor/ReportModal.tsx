import React, { useRef } from 'react';
import { X, Printer, FileText } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportHtml: string;
  projectName: string;
  docId: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportHtml,
  projectName,
  docId,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!isOpen || !reportHtml) return null;

  const handlePrint = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.focus();
      iframeRef.current.contentWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full h-full max-w-7xl max-h-[94vh] bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-[#090d16] border-b border-[#1e293b] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[var(--brand)]/15 border border-[var(--brand)]/30 flex items-center justify-center text-[var(--brand-light)]">
              <FileText className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white font-[Outfit]">Specification Report</h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-gray-300 font-medium border border-white/10">
                {projectName}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--brand)] hover:bg-[#4338ca] text-white text-xs font-bold transition shadow-md shadow-indigo-500/20 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#1e293b] hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition border border-white/10 cursor-pointer"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embedded Document Frame */}
        <div className="flex-1 bg-[#1e293b]/40 relative overflow-hidden flex flex-col">
          <iframe
            ref={iframeRef}
            srcDoc={reportHtml}
            title="Architectural Space Specification Report"
            className="w-full h-full border-0 bg-[#e2e8f0]"
            sandbox="allow-same-origin allow-scripts allow-modals allow-popups"
          />
        </div>
      </div>
    </div>
  );
};
