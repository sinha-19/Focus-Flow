const Stats = ({ stats }) => {
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getProductivityLevel = () => {
    if (stats.currentStreak >= 10) return { level: 'Master', color: '#845ec2', emoji: '🏆' };
    if (stats.currentStreak >= 5) return { level: 'Expert', color: '#339af0', emoji: '💎' };
    if (stats.currentStreak >= 3) return { level: 'Pro', color: '#51cf66', emoji: '⭐' };
    return { level: 'Beginner', color: '#ff6b6b', emoji: '🌱' };
  };

  const productivity = getProductivityLevel();

  return (
    <div className="stats-section">
      <div className="stat-card">
        <div className="stat-value">{stats.completedSessions}</div>
        <div className="stat-label">Sessions Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{formatTime(stats.totalFocusTime)}</div>
        <div className="stat-label">Total Focus Time</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.currentStreak}</div>
        <div className="stat-label">Current Streak</div>
        {stats.currentStreak > 0 && (
          <div className="streak-indicator">
            <span className="streak-fire">🔥</span>
            <span>{productivity.level}</span>
            <span>{productivity.emoji}</span>
          </div>
        )}
      </div>
      <div className="stat-card">
        <div className="stat-value">{stats.todaySessions}</div>
        <div className="stat-label">Today's Sessions</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">
          {stats.completedSessions > 0 ? Math.round((stats.totalFocusTime / stats.completedSessions)) : 0}
        </div>
        <div className="stat-label">Avg Session (min)</div>
      </div>
      <div className="stat-card">
        <div className="stat-value">
          {stats.totalFocusTime > 0 ? Math.round((stats.totalFocusTime / 60) * 100) / 100 : 0}
        </div>
        <div className="stat-label">Focus Hours</div>
      </div>
    </div>
  );
};

export default Stats;