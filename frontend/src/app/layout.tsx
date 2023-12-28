import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css";
import { cn } from "#/lib/utils";
import { ThemeProvider } from "#/components/providers/theme-provider";
import { ThemeToggle } from "#/components/theme-toggle";
import JotaiProvider from "#/components/providers/jotai-provider";
import { StatusLed } from "#/components/status-led";
import ReactQueryProvider from "#/components/providers/reactquery-provider";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ReactQueryProvider>
          {/* <JotaiProvider> */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="sticky top-0 z-50 flex items-center justify-end w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl gap-2 select-none">
              <StatusLed />
              <ThemeToggle />
            </div>
            {children}
          </ThemeProvider>
          {/* </JotaiProvider> */}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
