import type { Metadata } from "next";
import "./globals.css";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@/components/QueryClientProvider";
import { AuthProvider } from "@/contexts/auth-context";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontHeading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Alumni Network | University Alumni Relations",
  description:
    "The official platform for university alumni to network, mentor, and find career opportunities.",
  keywords: "alumni, university, networking, mentorship, careers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn("font-sans", fontSans.variable, fontHeading.variable)}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <TooltipProvider>
            <QueryClientProvider>
              <AuthProvider>
                {children}
                <Toaster richColors position="bottom-right" />
              </AuthProvider>
            </QueryClientProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
