// components/ToastProvider.tsx
import React, { forwardRef } from 'react';
import Toast from 'react-native-toast-message';

const ToastProvider = forwardRef((props, ref) => {
  return <Toast ref={ref} />;
});

ToastProvider.displayName = 'ToastProvider';

export default ToastProvider;
