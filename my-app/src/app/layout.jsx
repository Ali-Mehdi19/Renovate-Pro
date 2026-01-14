import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../../contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RenovatePro - Streamline Your Renovation Projects',
  description: 'Connect with professional auditors, digitize property surveys, and generate accurate blueprints automatically.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}