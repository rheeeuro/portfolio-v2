import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: 'Developer’s Room — Frontend Portfolio',
  description:
    '공간과 인터페이스가 만나는 프론트엔드 개발자의 작업실. 프로젝트, 기술적 결정, 그리고 만드는 과정.',
  robots: { index: false, follow: false },
  icons: { icon: '/icon.svg' },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
