'use client';
import { ConfirmProvider } from 'material-ui-confirm';
import { SnackbarProvider } from 'notistack';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SnackbarProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </SnackbarProvider>
  );
}
