import { useState, useEffect, useRef } from 'react';

const Timer = ({ 
  minutes, 
  isActive, 
  onComplete, 
  sessionType,
  onTimeUpdate 
}) => {
  const [timeLeft, setTimeLeft] = useState(minutes * 60);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    setTimeLeft(minutes * 60);
    startTimeRef.current = null;
  }, [minutes]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(timeLeft);
    }
  }, [timeLeft, onTimeUpdate]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      if (!startTimeRef.current) {
        startTimeRef.current = Date.now();
      }

      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            onComplete();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((minutes * 60 - timeLeft) / (minutes * 60)) * 100;
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  // Calculate time-based urgency
  const urgencyLevel = timeLeft / (minutes * 60);
  const isUrgent = urgencyLevel < 0.1 && timeLeft > 0;

  return (
    <div className="timer-display">
      <div className="progress-container">
        <svg className="progress-ring" width="320" height="320">
          {/* Background circle */}
          <circle
            className="progress-circle"
            cx="160"
            cy="160"
            r={radius}
          />
          {/* Progress circle */}
          <circle
            className={`progress-circle active ${sessionType} ${isUrgent ? 'urgent' : ''}`}
            cx="160"
            cy="160"
            r={radius}
            style={{
              strokeDasharray,
              strokeDashoffset,
              opacity: isActive ? 1 : 0.7
            }}
          />
          {/* Inner decorative circle */}
          <circle
            cx="160"
            cy="160"
            r="120"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        </svg>
        <div className={`timer-text ${isUrgent ? 'urgent' : ''}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default Timer;