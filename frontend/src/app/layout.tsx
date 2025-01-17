import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
      <body className={`bg-background max-w-6xl mx-auto`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
