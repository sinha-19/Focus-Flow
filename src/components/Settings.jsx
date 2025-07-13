const Settings = ({ 
  settings, 
  onSettingsChange,
  isActive 
}) => {
  const handleChange = (key, value) => {
    const numValue = parseInt(value);
    if (numValue > 0 && numValue <= 120) {
      onSettingsChange({ ...settings, [key]: numValue });
    }
  };

  return (
    <div className="settings-section">
      <h3 className="settings-title">⚙️ Timer Settings</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">🎯 Focus Duration</label>
          <input
            type="number"
            className="setting-input"
            value={settings.workDuration}
            onChange={(e) => handleChange('workDuration', e.target.value)}
            min="1"
            max="120"
            disabled={isActive}
            placeholder="25"
          />
          <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            Recommended: 25-50 minutes
          </small>
        </div>
        <div className="setting-item">
          <label className="setting-label">☕ Short Break</label>
          <input
            type="number"
            className="setting-input"
            value={settings.shortBreak}
            onChange={(e) => handleChange('shortBreak', e.target.value)}
            min="1"
            max="30"
            disabled={isActive}
            placeholder="5"
          />
          <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            Recommended: 5-10 minutes
          </small>
        </div>
        <div className="setting-item">
          <label className="setting-label">🌟 Long Break</label>
          <input
            type="number"
            className="setting-input"
            value={settings.longBreak}
            onChange={(e) => handleChange('longBreak', e.target.value)}
            min="1"
            max="60"
            disabled={isActive}
            placeholder="15"
          />
          <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            Recommended: 15-30 minutes
          </small>
        </div>
        <div className="setting-item">
          <label className="setting-label">🔄 Long Break Interval</label>
          <input
            type="number"
            className="setting-input"
            value={settings.longBreakInterval}
            onChange={(e) => handleChange('longBreakInterval', e.target.value)}
            min="2"
            max="10"
            disabled={isActive}
            placeholder="4"
          />
          <small style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>
            After how many focus sessions
          </small>
        </div>
      </div>
    </div>
  );
};

export default Settings;