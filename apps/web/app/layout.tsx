import "@ui/styles/globals.css";
import type { Metadata } from "next";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@ui/components/Toaster";
import { AuthProvider } from "../contexts/AuthProvider";

export const metadata: Metadata = {
  title: "Web3 To-Do",
  description: "Generated by Mode Mobile",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<JSX.Element> {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
