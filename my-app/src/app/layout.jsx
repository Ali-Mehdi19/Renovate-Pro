import { Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata = {
  title: 'RenovatePro - Premium Renovation Services',
  description: 'AI-Powered architectural blueprints and renovation planning.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.variable} ${playfair.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}