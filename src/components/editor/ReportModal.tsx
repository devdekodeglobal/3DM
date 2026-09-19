import React, { useRef } from 'react';
import { X, Printer, Download, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';

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

  const handleDownloadHtml = () => {
    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Specification_Report_${docId}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenNewTab = () => {
    const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full h-full max-w-7xl max-h-[94vh] bg-[#0f172a] border border-[#1e293b] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-[#090d16] border-b border-[#1e293b] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[var(--brand)]/15 border border-[var(--brand)]/30 flex items-center justify-center text-[var(--brand-light)]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm md:text-base font-bold text-white font-[Outfit]">Architectural Specification Report</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1e293b] text-cyan-400 font-semibold border border-cyan-500/20">
                  {docId}
                </span>
              </div>
              <p className="text-xs text-gray-400 truncate max-w-[280px] md:max-w-md">
                {projectName} · Ready for print, export, and technical procurement
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadHtml}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-gray-200 hover:text-white text-xs font-semibold transition border border-white/10 shadow-sm cursor-pointer"
              title="Download standalone HTML file with all embedded drawings"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download HTML</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--brand)] hover:bg-[#4338ca] text-white text-xs font-bold transition shadow-md shadow-indigo-500/25 cursor-pointer"
              title="Print document or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleOpenNewTab}
              className="p-2 rounded-xl bg-[#1e293b] hover:bg-[#334155] text-gray-400 hover:text-white transition border border-white/10 cursor-pointer hidden sm:flex"
              title="Open full page in new tab"
            >
              <ExternalLink className="w-4 h-4" />
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
