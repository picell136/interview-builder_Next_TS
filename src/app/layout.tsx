import type { Metadata } from "next";
import StoreProvider from "@/store/provider";
import Header from "@/components/Header/Header";
import AuthHydrator from "@/components/AuthHydrator/AuthHydrator";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interview Builder — Конструктор интервью",
  description: "Подготовка к техническим собеседованиям",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <StoreProvider>
          <AuthHydrator />
          <Header />
          <main>{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
