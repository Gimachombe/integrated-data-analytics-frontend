import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from 'react-hot-toast';
import Footer from '@/components/Footer';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DataBizPro - Data & Business Services Platform',
  description: 'One-stop digital solution for data analytics and business services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <div className="flex-1">
                <ClientLayout>{children}</ClientLayout>
              </div>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
