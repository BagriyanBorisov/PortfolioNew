import React, { useState, useRef, useEffect } from 'react';
import { asciiArt } from './asciiArt';
import TypingText from './TypingText';
import './Terminal.css';

interface TerminalLine {
  text: string;
  isTyping: boolean;
  isCommand?: boolean;
  isWelcome?: boolean;
}

const AVAILABLE_COMMANDS = [
  'help',
  'about',
  'education',
  'skills',
  'projects',
  'contact',
  'clear'
];

const MAX_VISIBLE_LINES = 50; // Maximum number of lines to keep visible

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [commandIndex, setCommandIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(false);

  useEffect(() => {
    // Add initial ASCII art and welcome message
    setHistory([
      { text: asciiArt, isTyping: false },
      { text: 'Welcome to Bagriyan Borisov\'s Portfolio! Type "help" to see available commands.', isTyping: false, isWelcome: true }
    ]);
  }, []);

  useEffect(() => {
    // Keep input focused
    const focusInput = () => {
      if (inputRef.current && !isTypingRef.current) {
        inputRef.current.focus();
      }
    };

    // Focus input initially and after any click
    focusInput();
    document.addEventListener('click', focusInput);

    return () => {
      document.removeEventListener('click', focusInput);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom when new content is added
    if (contentRef.current) {
      const scrollToBottom = () => {
        contentRef.current!.scrollTop = contentRef.current!.scrollHeight;
      };
      
      // Initial scroll
      scrollToBottom();
      
      // Create a MutationObserver to watch for content changes
      const observer = new MutationObserver(scrollToBottom);
      
      // Start observing the content div for changes
      observer.observe(contentRef.current, {
        childList: true,
        subtree: true,
        characterData: true
      });
      
      return () => {
        observer.disconnect();
      };
    }

    // Trim history if it gets too long
    if (history.length > MAX_VISIBLE_LINES) {
      setHistory(prev => {
        const newHistory = [...prev];
        // Keep the first two lines (ASCII art and welcome message)
        const keepLines = newHistory.slice(0, 2);
        // Add the most recent lines
        const recentLines = newHistory.slice(-MAX_VISIBLE_LINES + 2);
        return [...keepLines, ...recentLines];
      });
    }
  }, [history]);

  // Add smooth scrolling behavior
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.scrollBehavior = 'smooth';
    }
  }, []);

  const handleContainerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isTypingRef.current && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCommand = (command: string) => {
    if (isTypingRef.current) {
      return;
    }

    isTypingRef.current = true;
    setIsTyping(true);

    const newHistory = [...history, { text: `$ ${command}`, isTyping: false, isCommand: true }];
    
    let response = '';
    const [mainCommand, ...args] = command.toLowerCase().split(' ');

    switch (mainCommand) {
      case 'help':
        response = `
Available commands:
- help: Show this help message
- about: Learn about me
- education: View my educational background
- skills: View my technical skills
- projects: See my projects
- projects [number]: View detailed information about a specific project
- contact: Get my contact information
- clear: Clear the terminal`;
        break;
      case 'about':
        response = `
About Me - Bagriyan Borisov
---------------------------
Junior Software Developer specializing in C# and ASP.NET Core
with a passion for crafting efficient, scalable solutions and enhancing user experiences.
I thrive in collaborative teams, enjoy solving complex problems, and continuously seek to
learn and adapt to new technologies.


I believe in writing clean, maintainable code and following best practices in software development.
My goal is to create applications that make a positive impact on users' lives.`;
        break;
      case 'skills':
        response = `
Technical Skills
---------------
Frontend Development:
- React.js, TypeScript, JavaScript (ES6+)
- HTML5, CSS3

Backend Development:
- C#, ASP.NET Core
- T-SQL, Entity Framework Core
- HTTP, REST, Web API, SignalR
- Unit Testing, Azure CI/CD

Databases:
- SQL Server
- MongoDB

DevOps & Tools:
- Git, GitHub
- Linux/Unix systems

Soft Skills:
- Problem-solving
- Team collaboration
- Project management
- Technical documentation
- Adaptability
- Patience
- Communication`;
        break;
      case 'projects':
        if (args.length > 0) {
          const projectNumber = parseInt(args[0]);
          switch (projectNumber) {
            case 1:
              response = `
VehiclesForSale Website
----------------------------------------
Description: A full-stack platform for buying and selling vehicles, developed as my bachelor's thesis.

Technologies: ASP.NET Core, Entity Framework Core, SQL Server, Bootstrap, AJAX, jQuery, SignalR, NUnit, Moq

Features:
- User authentication/authorization, listing management, search & filter
- Real-time updates for listings, chat, and notifications
- Responsive design
- Dynamic content loading
- Admin dashboard
- Chat
- Notifications
- Search
- Filter
- Pagination
- Sorting
- CRUD operations
GitHub: github.com/BagriyanBorisov/VehiclesForSale8.0`;
              break;
            case 2:
              response = `
AI-Social-Platform
----------------------------------------
Description: Soft Uni's Team Lead project "AI Social Platform"

This project is Social platform for sharing publications.
Publications have the option to be partially or fully generated by OpenAI. 
You could create and edit text/media with the help of OpenAI.

Technologies: .Net Web API, Entity Framework Core, SQL Server, React, Javascript

Features:
- User authentication and authorization
- Real-time updates for publications, chat, and notifications
- Responsive design
- Admin dashboard
- Chat
- Notifications
- Search
- Filter
- Pagination
- Sorting
- CRUD operations
- AI-powered content generation

GitHub: https://github.com/SoftUni-s-Team-Lead-AI-Social-Platform/AI-Social-Platform`;
              break;
            case 3:
              response = `
TanothBot
----------------------------------------
Description: A C# console application that automates your gameplay in the browser-based RPG Tanoth
 by talking directly to the game's XML-RPC API (and WebSocket endpoint).

Automated Adventure Runs:
- Dynamically fetches available adventures
- Picks the best adventure based on configurable scoring (e.g. exp * gold)
- Starts the adventure and waits for its duration (plus a safety buffer)
- Repeats until you've exhausted your daily free adventures
- Also supports a continuous daily loop: runs each day and auto-waits until the daily reset at 01:00 
                                          (with randomized keep-alive pings every 20-30 minutes)

  User Interactions:
- Check your user attributes (level, gold, exp, stats, etc.) at any time
- Raise attributes (STR, DEX, CON, INT) interactively via XML-RPC calls
- Live countdown timer in the console during each adventure, with the option to cancel mid-adventure

Technologies: C#, XML-RPC, WebSocket, Puppeteer

GitHub: https://github.com/BagriyanBorisov/TanothBot1.0.1`;
              break;
            case 4:
              response = `
Mouse Camera Control
----------------------------------------
Description: A Python application that turns your webcam into a touch-free mouse by recognizing hand gestures and mapping them to cursor actions.
It leverages MediaPipe for hand landmark detection, OpenCV for video capture, and PyAutoGUI for on-screen control. 

Technologies: Python, MediaPipe, OpenCV, PyAutoGUI

Features:
- Real-time hand tracking and gesture recognition
- Follows the tip of your index finger in real time.
- Push your pinky finger down to scroll vertically.
- Show a “peace” sign (index + middle finger) to trigger a click.
- Pinch your thumb and index finger together to drag-and-drop.

GitHub: https://github.com/BagriyanBorisov/MouseCameraControl`;
              break;
            default:
              response = `Project number ${projectNumber} not found. Available projects: 1, 2, 3, 4`;
          }
        } else {
          response = `
Featured Projects
---------------
1. VehiclesForSale Website
2. AI-Social-Platform
3. TanothBot
4. Mouse Camera Control

Type 'projects [number]' to view detailed information about a specific project.`;
        }
        break;
      case 'contact':
        response = `
Contact Information
------------------
Email: bagriyan.dilyanov@abv.bg
GitHub: github.com/BagriyanBorisov
LinkedIn: linkedin.com/in/bagriyan-borisov-a15a95224/
Portfolio: https://bagriyanborisov.github.io/

Feel free to reach out for:
- Job opportunities
- Collaboration on projects`;
        break;
      case 'education':
        response = `
Education
---------
Bachelor's Degree in Computer Science
University of Veliko Turnovo "St. Cyril and St. Methodius"
Veliko Turnovo, Bulgaria | Sep 2019 - Jul 2024

Professional Degree - Computer Technician and Technologies
PGMET "Deveti mai"
Cherven Bryag, Bulgaria | Sep 2015 - Jul 2019


Certifications:
- Intern & Team Lead Academy (incl. Recommendation) | Nov 2023 - Feb 2024 (SoftUni)
- ASP.NET Advanced | Jul 2023 - Aug 2023 (SoftUni)
- ASP.NET Fundamentals | May 2023 - Jul 2023 (SoftUni)
- Entity Framework Core | Feb 2023 - Mar 2023 (SoftUni)
- MS SQL | Jan 2023 - Mar 2023 (SoftUni)
- JS Applications | Oct 2022 - Dec 2022 (SoftUni)
- JS Advanced | Sep 2022 - Oct 2022 (SoftUni)
- C# OOP | Jun 2022 - Aug 2022 (SoftUni)
- C# Advanced | Jun 2022 - Aug 2022 (SoftUni)
- Programming Fundamentals with C# | Jan 2022 - Apr 2022 (SoftUni)
- Basics with C# | Oct 2021 - Dec 2021 (SoftUni)`;
        break;
      case 'clear':
        setHistory([
          { text: asciiArt, isTyping: false },
          { text: 'Welcome to Bagriyan Borisov\'s Portfolio! Type "help" to see available commands.', isTyping: false, isWelcome: true }
        ]);
        isTypingRef.current = false;
        setIsTyping(false);
        setInput('');
        setCommandIndex(-1);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 0);
        return;
      default:
        response = command.trim() === '' ? '' : `Command not found: ${command}. Type "help" to see available commands.`;
    }
    
    if (response) {
      newHistory.push({ text: response, isTyping: true });
    }
    setHistory(newHistory);
    setInput('');
    setCommandIndex(-1);
    
    // Remove the immediate focus attempt since we're still typing
    // The focus will be handled by handleTypingComplete
  };

  const handleTypingComplete = () => {
    isTypingRef.current = false;
    setIsTyping(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleTabPress = (e: React.KeyboardEvent) => {
    e.preventDefault();
    
    if (commandIndex === -1) {
      // First tab press - find matching commands
      const matchingCommands = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.startsWith(input.toLowerCase())
      );
      
      if (matchingCommands.length > 0) {
        setCommandIndex(0);
        setInput(matchingCommands[0]);
      }
    } else {
      // Subsequent tab presses - cycle through matching commands
      const matchingCommands = AVAILABLE_COMMANDS.filter(cmd => 
        cmd.startsWith(input.toLowerCase())
      );
      
      if (matchingCommands.length > 0) {
        const nextIndex = (commandIndex + 1) % matchingCommands.length;
        setCommandIndex(nextIndex);
        setInput(matchingCommands[nextIndex]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isTypingRef.current) {
      e.preventDefault();
      return;
    }
    setInput(e.target.value);
    setCommandIndex(-1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (isTypingRef.current) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isTypingRef.current) {
      e.preventDefault();
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      handleTabPress(e);
    }
  };

  return (
    <div className={`terminal-container ${isTyping ? 'busy' : ''}`} ref={containerRef} onClick={handleContainerClick}>
      <div className="terminal-content" ref={contentRef}>
        <div className="sticky-header">
          <div className="terminal-line ascii-art">{asciiArt}</div>
          <div className="terminal-line welcome-message">Welcome to Bagriyan Borisov's Portfolio! Type "help" to see available commands.</div>
        </div>
        {history.slice(2).map((line, index) => (
          <div className="terminal-line" key={index}>
            {line.isTyping ? (
              <TypingText 
                text={line.text} 
                onComplete={handleTypingComplete}
                typingSpeed={line.isCommand ? 5 : 15}
              />
            ) : (
              line.text
            )}
          </div>
        ))}
      </div>
      <div className="input-line">
        <span className={`prompt ${isTyping ? 'busy' : ''}`}>{'>'}</span>
        <input
          className="terminal-input"
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onKeyDown={handleKeyDown}
          autoFocus
          disabled={isTyping}
          readOnly={isTyping}
        />
      </div>
    </div>
  );
};

export default Terminal;
