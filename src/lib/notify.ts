export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
};

export const notify = (title: string, body: string, icon = '/pwa-192x192.png') => {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, { body, icon, badge: '/pwa-64x64.png' });
};
