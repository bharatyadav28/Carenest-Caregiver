// app/providers.tsx
"use client";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { NotificationProvider } from "../hooks/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <NotificationProvider>
        {children}
      </NotificationProvider>
    </Provider>
  );
}