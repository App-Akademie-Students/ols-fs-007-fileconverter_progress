import type { ReactNode } from "react";

export const metadata = {
  title: "File Converter",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
