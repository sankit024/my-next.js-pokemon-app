import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles/globals.scss';

export const metadata: Metadata = {
  title: 'Pokemon Explorer',
  description: 'Explore Pokemon by type, search and view in grid or list format',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}