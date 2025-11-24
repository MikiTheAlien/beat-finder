// Root layout - Next.js requires this for app directory
// The actual layout with html/body is in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

