import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallNowButton from "@/components/CallNowButton";

export const metadata: Metadata = {
  title: "Chahal Farm | Fresh Hens in Punjab",
  description:
    "Chahal Farm sells fresh, healthy hens for meat/chicken. Serving Village Bassowal, Ludhiana with retail and small wholesale orders.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        <CallNowButton />
      </body>
    </html>
  );
}
