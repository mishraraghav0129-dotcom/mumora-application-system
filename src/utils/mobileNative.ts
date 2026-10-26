import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Checks if the application is running inside a native iOS or Android Capacitor wrapper
 */
export const isNativeMobile = (): boolean => {
  return Capacitor.isNativePlatform();
};

/**
 * Get current platform: 'android', 'ios', or 'web'
 */
export const getMobilePlatform = (): 'android' | 'ios' | 'web' => {
  const platform = Capacitor.getPlatform();
  if (platform === 'android') return 'android';
  if (platform === 'ios') return 'ios';
  return 'web';
};

/**
 * Trigger subtle haptic feedback for mobile interactions
 */
export const triggerHaptic = async (
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light'
): Promise<void> => {
  try {
    if (Capacitor.isPluginAvailable('Haptics')) {
      if (type === 'light') {
        await Haptics.impact({ style: ImpactStyle.Light });
      } else if (type === 'medium') {
        await Haptics.impact({ style: ImpactStyle.Medium });
      } else if (type === 'heavy') {
        await Haptics.impact({ style: ImpactStyle.Heavy });
      } else if (type === 'success') {
        await Haptics.notification({ type: NotificationType.Success });
      } else if (type === 'warning') {
        await Haptics.notification({ type: NotificationType.Warning });
      } else if (type === 'error') {
        await Haptics.notification({ type: NotificationType.Error });
      }
    } else if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      // Browser fallback vibration
      const duration = type === 'light' ? 8 : type === 'medium' ? 18 : 30;
      navigator.vibrate(duration);
    }
  } catch (err) {
    // Ignore haptic errors on unsupported hardware
  }
};

/**
 * Configure native mobile status bar style
 */
export const configureMobileStatusBar = async (): Promise<void> => {
  try {
    if (Capacitor.isPluginAvailable('StatusBar')) {
      await StatusBar.setStyle({ style: Style.Dark });
      if (Capacitor.getPlatform() === 'android') {
        await StatusBar.setBackgroundColor({ color: '#7E22CE' });
      }
    }
  } catch (e) {
    // Silent fallback
  }
};
