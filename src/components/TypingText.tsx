import React, { useState, useEffect, useRef } from 'react';

interface TypingTextProps {
  text: string;
  onComplete?: () => void;
  typingSpeed?: number;
}

const TypingText: React.FC<TypingTextProps> = ({ 
  text, 
  onComplete, 
  typingSpeed = 30 
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasStartedRef = useRef(false);

  // Function to detect URLs and render them as clickable links
  const renderTextWithLinks = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)|(github\.com\/[^\s]+)|(linkedin\.com\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    
    return parts.map((part, index) => {
      if (part && urlRegex.test(part)) {
        const url = part.startsWith('http') ? part : `https://${part}`;
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#00ff00', textDecoration: 'underline' }}
            onClick={(e) => e.stopPropagation()}
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    // Only start typing if we haven't started yet
    if (!hasStartedRef.current) {
      hasStartedRef.current = true;
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, []);

  useEffect(() => {
    if (currentIndex < text.length && hasStartedRef.current) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      return () => clearTimeout(timeout);
    } else if (currentIndex >= text.length && onComplete) {
      onComplete();
    }
  }, [currentIndex, text, typingSpeed, onComplete]);

  // Reset when text changes, but only if we haven't started typing yet
  useEffect(() => {
    if (!hasStartedRef.current) {
      setDisplayedText('');
      setCurrentIndex(0);
    }
  }, [text]);

  return <span>{renderTextWithLinks(displayedText)}</span>;
};

export default TypingText; 