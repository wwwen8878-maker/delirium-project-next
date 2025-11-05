import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { SmartAssistant } from "@/components/smart-assistant";
import { ErrorBoundary } from "@/components/error-boundary";
import { QueryProvider } from "@/components/query-provider";
import { DefaultBackground } from "@/components/medical-background";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});



export const metadata: Metadata = {
  title: "谵妄预防与早筛平台 - 为手术患者及家属服务",
  description: "面向即将手术的患者和家属，提供术前谵妄知识学习、风险评估、术后症状识别与家庭护理指导。基于循证医学，通俗易懂。",
  keywords: ["谵妄预防", "术前准备", "术后护理", "患者教育", "家属陪护", "老年手术", "认知障碍", "CAM-ICU"],
  authors: [{ name: "智护心脑团队" }],
  creator: "智护心脑健康教育团队",
  publisher: "智护心脑",
  openGraph: {
    title: "谵妄预防与早筛平台 - 为手术患者及家属服务",
    description: "术前知识准备 · 术后症状识别 · 家庭护理指导",
    type: "website",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: "谵妄预防与早筛平台",
    description: "为即将手术的患者和家属提供谵妄预防健康教育",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${notoSansSC.variable} antialiased font-sans`}
      >
        <ErrorBoundary>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <DefaultBackground />
              <Header />
              {children}
              <Footer />
              <SmartAssistant />
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
