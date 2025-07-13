const Controls = ({ 
  isActive, 
  onStart, 
  onPause, 
  onReset, 
  onSkip,
  sessionType 
}) => {
  return (
    <div className="controls">
      {!isActive ? (
        <button 
          className="control-btn primary-btn"
          onClick={onStart}
        >
          <span className="control-icon">▶</span>
          Start Focus
        </button>
      ) : (
        <button 
          className="control-btn primary-btn"
          onClick={onPause}
        >
          <span className="control-icon">⏸</span>
          Pause
        </button>
      )}
      <button 
        className="control-btn secondary-btn"
        onClick={onReset}
        title="Reset current session"
      >
        <span className="control-icon">⏹</span>
        Reset
      </button>
      <button 
        className="control-btn secondary-btn"
        onClick={onSkip}
        title="Skip to next session"
      >
        <span className="control-icon">⏭</span>
        Skip
      </button>
    </div>
  );
};

export default Controls;