import "@rainbow-me/rainbowkit/styles.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import "@/styles/globals.css";
import { getMetadata } from "@/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Scaffold-ETH 2 App",
  description: "Built with 🏗 Scaffold-ETH 2",
});

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider enableSystem>{children}</ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
