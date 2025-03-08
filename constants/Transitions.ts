import { Platform } from 'react-native';

export const screenTransition = {
  gestureDirection: 'horizontal',
  animation: 'slide_from_right',
  headerShown: false,
  animationDuration: 200,
};

export const modalTransition = {
  gestureDirection: 'vertical',
  animation: 'slide_from_bottom',
  headerShown: false,
  animationDuration: 200,
  presentation: 'modal',
};