import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@uppy/dashboard/dist/style.min.css";
import "@uppy/audio/dist/style.min.css";
import "@uppy/webcam/dist/style.min.css";
import "@repo/editor/src/styles/index.css";
import "@repo/ui/styles";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle";
import { Providers } from "@/components/providers";
import { Toaster } from "@repo/ui/components/ui/toast";
import { Dialog } from "@repo/ui/components/ui/dialog";
import RoomPage from "./(workspaces)/[workspaceSlug]/(workspace)/room/[teamId]/[channelId]/call/page";
import { createPortal } from "react-dom";

/** Runtime = edge require in order to make next-auth works with cf-pages */
export const runtime = "edge";

export const metadata: Metadata = {
  title: "Wodge App",
  description: "Generated by create next app",
};

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="relative overflow-hidden font-sans">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </Providers>
        <Toaster richColors />
      </body>
    </html>
  );
}
