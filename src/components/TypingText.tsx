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

  return <span>{displayedText}</span>;
};

export default TypingText; 