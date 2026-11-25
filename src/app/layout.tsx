import type { Metadata } from "next";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "TaskVIDIA — Team task workspace",
  description: "A platform to plan projects and manage team projects",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
