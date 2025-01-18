import Header from "@/modules/common/components/Header";
import Footer from "@/modules/common/components/Footer";
import { Toaster } from "@/modules/common/components/ui/toaster";

import "./globals.css";

export const metadata = {
  title: "Maverick - AI Trading Agents",
  description: "Create your personalized AI trading agent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-background mx-auto`}>
        <Header />
        {children}
        <Footer />

        <Toaster />
      </body>
    </html>
  );
}
