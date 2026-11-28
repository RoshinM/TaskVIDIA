import type { Metadata } from "next";
import { THEME_COOKIE } from "@/lib/theme";
import "@/styles/global.css";

export const metadata: Metadata = {
  title: "TaskVIDIA — Team task workspace",
  description: "A platform to plan projects and manage team projects",
};

const themeScript = `
(function () {
  var name = ${JSON.stringify(THEME_COOKIE)};
  var cookie = document.cookie
    .split(';')
    .map(function (item) { return item.trim(); })
    .find(function (item) { return item.indexOf(name + '=') === 0; });
  var theme = cookie ? cookie.slice(name.length + 1) : '';
  if (theme !== 'dark' && theme !== 'light') {
    try {
      var stored = localStorage.getItem(name);
      if (stored === 'dark' || stored === 'light') theme = stored;
    } catch (error) {}
  }
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  var root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.classList.toggle('light', theme === 'light');
  root.style.colorScheme = theme;
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
