import React, { useState } from 'react';
import './CertificateViewer.css';

interface CertificateViewerProps {
  selectedCertificate: string | null;
  isVisible: boolean;
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({ selectedCertificate, isVisible }) => {
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const isInternTeamLead = selectedCertificate?.includes('intern-team-lead');

  return (
    <div className={`certificate-viewer ${isVisible ? 'visible' : ''}`}>
      {!selectedCertificate ? (
        <div className="certificate-placeholder">
          <p>Select a certificate to view</p>
        </div>
      ) : (
        <div className="certificate-container">
          <div className="zoom-controls">
            <button onClick={handleZoomOut} className="zoom-button">-</button>
            <button onClick={handleZoomIn} className="zoom-button">+</button>
          </div>
          {isInternTeamLead ? (
            <div className="split-view">
              <div className="certificate-half">
                <img 
                  src="/certificates/intern-team-lead.jpg"
                  alt="Intern & Team Lead Academy Certificate" 
                  className="certificate-image"
                  style={{ transform: `scale(${scale})` }}
                />
              </div>
              <div className="certificate-half">
                <img 
                  src="/certificates/intern-team-lead-recommendation.jpg"
                  alt="Intern & Team Lead Academy Recommendation" 
                  className="certificate-image"
                  style={{ transform: `scale(${scale})` }}
                />
              </div>
            </div>
          ) : (
            <img 
              src={`/${selectedCertificate}`}
              alt="Certificate" 
              className="certificate-image"
              style={{ transform: `scale(${scale})` }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default CertificateViewer; 