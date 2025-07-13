import { useState, useEffect, useCallback } from 'react';
import Timer from './components/Timer';
import Controls from './components/Controls';
import SessionTabs from './components/SessionTabs';
import Stats from './components/Stats';
import Settings from './components/Settings';
import ProductivityInsights from './components/ProductivityInsights';
import useAudio from './hooks/useAudio';
import useLocalStorage from './hooks/useLocalStorage';
import useNotifications from './hooks/useNotifications';
import './App.css';

const INITIAL_SETTINGS = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  longBreakInterval: 4,
  autoStartBreaks: true,
  autoStartWork: false,
  soundEnabled: true
};

const INITIAL_STATS = {
  completedSessions: 0,
  totalFocusTime: 0,
  currentStreak: 0,
  todaySessions: 0,
  lastSessionDate: null,
  weeklyGoal: 20,
  bestStreak: 0,
  totalBreakTime: 0
};

function App() {
  const [settings, setSettings] = useLocalStorage('focus-flow-settings', INITIAL_SETTINGS);
  const [stats, setStats] = useLocalStorage('focus-flow-stats', INITIAL_STATS);
  const [activeSession, setActiveSession] = useState('work');
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  const { playNotification } = useAudio();
  const { notifySessionComplete } = useNotifications();

  useEffect(() => {
    const today = new Date().toDateString();
    if (stats.lastSessionDate !== today) {
      setStats(prev => ({
        ...prev,
        todaySessions: 0,
        lastSessionDate: today
      }));
    }
  }, [stats.lastSessionDate, setStats]);

  useEffect(() => {
    if (stats.currentStreak > stats.bestStreak) {
      setStats(prev => ({
        ...prev,
        bestStreak: stats.currentStreak
      }));
    }
  }, [stats.currentStreak, stats.bestStreak, setStats]);

  const getCurrentDuration = () => {
    switch (activeSession) {
      case 'work':
        return settings.workDuration;
      case 'short-break':
        return settings.shortBreak;
      case 'long-break':
        return settings.longBreak;
      default:
        return settings.workDuration;
    }
  };

  const getSessionLabel = () => {
    switch (activeSession) {
      case 'work':
        return 'Focus Time';
      case 'short-break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
      default:
        return 'Focus Time';
    }
  };

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    setIsComplete(true);
    
    if (settings.soundEnabled) {
      playNotification(activeSession === 'work' ? 'completion' : 'break');
    }
    notifySessionComplete(activeSession);
    const today = new Date().toDateString();
    setStats(prev => {
      const newStats = { ...prev };
      
      if (activeSession === 'work') {
        newStats.completedSessions += 1;
        newStats.totalFocusTime += settings.workDuration;
        newStats.currentStreak += 1;
        newStats.todaySessions += 1;
        newStats.lastSessionDate = today;
      } else {
        newStats.totalBreakTime += getCurrentDuration();
      }
      
      return newStats;
    });
    setTimeout(() => {
      if (activeSession === 'work') {
        const newSessionCount = sessionCount + 1;
        setSessionCount(newSessionCount);
        
        if (newSessionCount % settings.longBreakInterval === 0) {
          setActiveSession('long-break');
          if (settings.autoStartBreaks) {
            setTimeout(() => setIsActive(true), 1000);
          }
        } else {
          setActiveSession('short-break');
          if (settings.autoStartBreaks) {
            setTimeout(() => setIsActive(true), 1000);
          }
        }
      } else {
        setActiveSession('work');
        if (settings.autoStartWork) {
          setTimeout(() => setIsActive(true), 1000);
        }
      }
      setIsComplete(false);
    }, 3000);

  }, [activeSession, sessionCount, settings, playNotification, setStats, notifySessionComplete, getCurrentDuration]);

  const handleStart = () => {
    setIsActive(true);
    setIsComplete(false);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setIsComplete(false);
  };

  const handleSkip = () => {
    setIsActive(false);
    handleTimerComplete();
  };

  const handleSessionChange = (session) => {
    if (!isActive) {
      setActiveSession(session);
      setIsComplete(false);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
  };

  useEffect(() => {
    if (isActive && currentTime > 0) {
      const minutes = Math.floor(currentTime / 60);
      const seconds = currentTime % 60;
      const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      document.title = `${timeString} - ${getSessionLabel()} | Focus Flow`;
    } else {
      document.title = 'Focus Flow - Premium Pomodoro Timer';
    }
  }, [currentTime, isActive, activeSession]);

  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
      const colors = {
        work: '🎯',
        'short-break': '☕',
        'long-break': '🌟'
      };
      
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      
      ctx.fillStyle = activeSession === 'work' ? '#ff6b6b' : 
                     activeSession === 'short-break' ? '#51cf66' : '#339af0';
      ctx.fillRect(0, 0, 32, 32);
      
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillStyle = 'white';
      ctx.fillText(colors[activeSession] || '🎯', 16, 22);
      
      favicon.href = canvas.toDataURL();
    }
  }, [activeSession, isActive]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === 'INPUT') return;
      
      switch (e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          isActive ? handlePause() : handleStart();
          break;
        case 'r':
          e.preventDefault();
          handleReset();
          break;
        case 's':
          e.preventDefault();
          handleSkip();
          break;
        case '1':
          e.preventDefault();
          if (!isActive) handleSessionChange('work');
          break;
        case '2':
          e.preventDefault();
          if (!isActive) handleSessionChange('short-break');
          break;
        case '3':
          e.preventDefault();
          if (!isActive) handleSessionChange('long-break');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isActive, handleStart, handlePause, handleReset, handleSkip, handleSessionChange]);

  return (
    <div className="app">
      <header className="header">
        <h1 className="app-title">Focus Flow</h1>
        <p className="app-subtitle">
          Master your productivity with the ultimate Pomodoro experience
        </p>
      </header>

      <main className="main-content">
        <div className="timer-section">
          {isActive && activeSession === 'work' && (
            <div className="focus-mode-indicator">
              Focus Mode Active
            </div>
          )}
          
          <SessionTabs
            activeSession={activeSession}
            onSessionChange={handleSessionChange}
            isActive={isActive}
            settings={settings}
          />

          <div className="session-info">
            <div className="session-label">
              {getSessionLabel()}
            </div>
            {sessionCount > 0 && (
              <div className="session-counter">
                Session {sessionCount + 1} • Next: {
                  activeSession === 'work' 
                    ? (sessionCount + 1) % settings.longBreakInterval === 0 
                      ? 'Long Break' 
                      : 'Short Break'
                    : 'Focus Time'
                }
              </div>
            )}
          </div>

          <div className={`timer-container ${isComplete ? 'timer-complete' : ''}`}>
            <Timer
              minutes={getCurrentDuration()}
              isActive={isActive}
              onComplete={handleTimerComplete}
              sessionType={activeSession}
              onTimeUpdate={setCurrentTime}
            />
          </div>

          <Controls
            isActive={isActive}
            onStart={handleStart}
            onPause={handlePause}
            onReset={handleReset}
            onSkip={handleSkip}
            sessionType={activeSession}
          />

          {isComplete && (
            <div className="notification-indicator"></div>
          )}

          <div style={{ 
            marginTop: 'var(--space-lg)', 
            fontSize: '0.85rem', 
            color: 'var(--text-tertiary)',
            textAlign: 'center'
          }}>
            <p>Keyboard shortcuts: Space (start/pause) • R (reset) • S (skip) • 1/2/3 (switch sessions)</p>
          </div>
        </div>

        <div className="sidebar">
          <Stats stats={stats} />
          
          <ProductivityInsights 
            stats={stats} 
            currentSession={activeSession}
          />
          
          <Settings
            settings={settings}
            onSettingsChange={handleSettingsChange}
            isActive={isActive}
          />
        </div>
      </main>

      <footer style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        fontSize: '0.8rem',
        color: 'var(--text-tertiary)',
        background: 'rgba(0, 0, 0, 0.2)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-full)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        Created by Saket
      </footer>
    </div>
  );
}

export default App;
