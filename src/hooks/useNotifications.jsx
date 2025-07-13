import { useEffect, useRef } from 'react';

const useNotifications = () => {
  const permissionRef = useRef(null);

  useEffect(() => {
    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        permissionRef.current = permission;
      });
    } else {
      permissionRef.current = Notification.permission;
    }
  }, []);

  const showNotification = (title, options = {}) => {
    if ('Notification' in window && permissionRef.current === 'granted') {
      const notification = new Notification(title, {
        icon: '/vite.svg',
        badge: '/vite.svg',
        ...options
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    }
  };

  const notifySessionComplete = (sessionType) => {
    const messages = {
      work: {
        title: '🎯 Focus Session Complete!',
        body: 'Great work! Time for a well-deserved break.',
        icon: '🎯'
      },
      'short-break': {
        title: '☕ Break Time Over!',
        body: 'Ready to get back to focused work?',
        icon: '☕'
      },
      'long-break': {
        title: '🌟 Long Break Complete!',
        body: 'Refreshed and ready for the next focus session!',
        icon: '🌟'
      }
    };

    const message = messages[sessionType] || messages.work;
    
    showNotification(message.title, {
      body: message.body,
      tag: 'pomodoro-session',
      requireInteraction: true
    });
  };

  return { showNotification, notifySessionComplete };
};

export default useNotifications;