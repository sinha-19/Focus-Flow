const ProductivityInsights = ({ stats, currentSession }) => {
  const getInsights = () => {
    const insights = [];
    
    if (stats.currentStreak >= 5) {
      insights.push({
        icon: '🔥',
        text: `Amazing! You're on a ${stats.currentStreak}-session streak. Keep the momentum going!`
      });
    }
    
    if (stats.todaySessions >= 8) {
      insights.push({
        icon: '🏆',
        text: `Exceptional focus today! You've completed ${stats.todaySessions} sessions.`
      });
    } else if (stats.todaySessions >= 4) {
      insights.push({
        icon: '⭐',
        text: `Great progress! ${stats.todaySessions} sessions completed today.`
      });
    }
    
    if (stats.totalFocusTime >= 1000) {
      insights.push({
        icon: '💎',
        text: `You've achieved ${Math.round(stats.totalFocusTime / 60)} hours of focused work!`
      });
    }
    
    const avgSession = stats.completedSessions > 0 ? stats.totalFocusTime / stats.completedSessions : 0;
    if (avgSession >= 25) {
      insights.push({
        icon: '🎯',
        text: `Your average session length is ${Math.round(avgSession)} minutes - excellent focus!`
      });
    }
    
    if (currentSession === 'work' && stats.currentStreak > 0) {
      insights.push({
        icon: '💪',
        text: 'You\'re in the zone! This focused work will compound into great results.'
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        icon: '🌱',
        text: 'Every expert was once a beginner. Start your first session to build momentum!'
      });
    }
    
    return insights.slice(0, 3);
  };

  const insights = getInsights();

  return (
    <div className="insights-section">
      <h3 className="insights-title">💡 Productivity Insights</h3>
      {insights.map((insight, index) => (
        <div key={index} className="insight-item">
          <span className="insight-icon">{insight.icon}</span>
          <span className="insight-text">{insight.text}</span>
        </div>
      ))}
    </div>
  );
};

export default ProductivityInsights;
