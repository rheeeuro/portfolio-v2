import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '이유로 | Frontend Developer — Developer’s Room',
  description:
    '문제를 구조화하고 측정 가능한 결과로 검증하는 프론트엔드 개발자 이유로. SmartOffer, Jongalab, Comeet 프로젝트와 경력, 기술적 결정을 소개합니다.',
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
