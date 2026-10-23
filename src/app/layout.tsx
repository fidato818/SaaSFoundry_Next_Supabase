import type { Metadata } from 'next';
import '../index.css'; // Aapki purani Tailwind/CSS file ko import karein
import "./globals.css";
export const metadata: Metadata = {
  title: 'SaaSFoundry',
  description: 'Multi-Tenant SaaS Starter Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}