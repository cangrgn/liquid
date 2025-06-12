import React from 'react';
import { IconXMark } from './Icons'; // Assuming IconXMark is available

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  showCopy?: boolean;
  onCopy?: () => void;
  showDownload?: boolean;
  onDownload?: () => void;
  downloadFilename?: string; // Used if onDownload is also about file saving
}

export const Modal: React.FC<ModalProps> = ({ 
    title, 
    children, 
    onClose, 
    showCopy, 
    onCopy, 
    showDownload, 
    onDownload,
    downloadFilename
}) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button onClick={onClose} className="modal-close-btn">
            <IconXMark className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {(showCopy || showDownload) && (
          <div className="modal-footer">
            {showCopy && onCopy && (
              <button className="modal-copy-btn" onClick={onCopy}>
                <i className="fas fa-copy mr-2"></i>Copy
              </button>
            )}
            {showDownload && onDownload && (
              <button className="modal-download-btn" onClick={onDownload}>
                <i className="fas fa-download mr-2"></i>Download
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
