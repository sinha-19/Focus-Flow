const SessionTabs = ({ 
  activeSession, 
  onSessionChange,
  isActive,
  settings 
}) => {
  const sessions = [
    { 
      key: 'work', 
      label: 'Focus', 
      duration: settings?.workDuration || 25,
      icon: '🎯'
    },
    { 
      key: 'short-break', 
      label: 'Short Break', 
      duration: settings?.shortBreak || 5,
      icon: '☕'
    },
    { 
      key: 'long-break', 
      label: 'Long Break', 
      duration: settings?.longBreak || 15,
      icon: '🌟'
    }
  ];

  return (
    <div className="session-tabs">
      {sessions.map(session => (
        <button
          key={session.key}
          className={`session-tab ${session.key} ${activeSession === session.key ? 'active' : ''}`}
          onClick={() => onSessionChange(session.key)}
          disabled={isActive}
          title={`Switch to ${session.label} (${session.duration} minutes)`}
        >
          <span className="session-icon">{session.icon}</span>
          <span className="session-name">{session.label}</span>
          <span className="session-tab-duration">{session.duration}min</span>
        </button>
      ))}
    </div>
  );
};

export default SessionTabs;