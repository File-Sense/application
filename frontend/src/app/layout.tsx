import { Inter as FontSans } from "next/font/google";
import "../styles/globals.css";
import { cn } from "#/lib/utils";
import { ThemeProvider } from "#/components/providers/theme-provider";
import { ThemeToggle } from "#/components/theme-toggle";
import StatusLed from "#/components/status-led";
import ReactQueryProvider from "#/components/providers/reactquery-provider";
import { NavigationMenuDemo } from "#/components/menu";
import SettingsMenu from "#/components/settings-menu";

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
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="sticky top-0 z-50 grid grid-cols-3 w-full h-20 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl gap-2 select-none">
              <div className="md:w-20 lg:w-28"></div>
              <NavigationMenuDemo />
              <div className=" flex justify-self-end items-center gap-2">
                <StatusLed />
                <SettingsMenu />
              </div>
            </div>
            <div className="flex flex-col">
              <main className="flex flex-col flex-1 px-10 pt-4">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
