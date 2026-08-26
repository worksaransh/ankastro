import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WhatsAppButton from "@/components/WhatsAppButton";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ErrorBoundary from "@/components/ErrorBoundary";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import TrackingScripts from "@/components/TrackingScripts";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import AiChatWidget from "@/components/AiChatWidget";
import { validateEnv } from "@/lib/envCheck";

import { CartProvider } from "@/contexts/CartContext";
import MobileBottomNav from "@/components/MobileBottomNav";

// Eager: HomePage (LCP) + NotFound (small)
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";

// Validate required env vars once at app boot
validateEnv();

const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const ShopPage = lazy(() => import("./pages/ShopPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const DiscoverMulankPage = lazy(() => import("./pages/DiscoverMulankPage"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));

// Lazy-load all secondary routes for code splitting
const FormPage = lazy(() => import("./pages/FormPage"));
const SummaryPage = lazy(() => import("./pages/SummaryPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const AdvancedReportPage = lazy(() => import("./pages/AdvancedReportPage"));
const CalculatorTestPage = lazy(() => import("./pages/CalculatorTestPage"));
const MoolankCalculatorPage = lazy(() => import("./pages/MoolankCalculatorPage"));
const NaamankCalculatorPage = lazy(() => import("./pages/NaamankCalculatorPage"));
const BabyNamePage = lazy(() => import("./pages/BabyNamePage"));
const DailyForecastPage = lazy(() => import("./pages/DailyForecastPage"));
const RemediesPage = lazy(() => import("./pages/RemediesPage"));
const AiChatPage = lazy(() => import("./pages/AiChatPage"));
const DynamicLandingPage = lazy(() => import("./pages/DynamicLandingPage"));
const StaticReportLanding = lazy(() => import("./pages/StaticReportLanding"));
const BuyReportPage = lazy(() => import("./pages/BuyReportPage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const ReportsCatalogPage = lazy(() => import("./pages/ReportsCatalogPage"));
const PlusPage = lazy(() => import("./pages/PlusPage"));
const PlusSuccessPage = lazy(() => import("./pages/PlusSuccessPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const VerifySuccessPage = lazy(() => import("./pages/VerifySuccessPage"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const PaymentSuccessPage = lazy(() => import("./pages/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("./pages/PaymentFailedPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const RefundPage = lazy(() => import("./pages/RefundPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const SampleReportPage = lazy(() => import("./pages/SampleReportPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const ToolsVibrationPage = lazy(() => import("./pages/ToolsVibrationPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const MulankDetailPseoPage = lazy(() => import("./pages/pseo/MulankDetailPseoPage"));
const NameAnalyzerPage = lazy(() => import("./pages/NameAnalyzerPage"));
const LuckyNumberCheckerPage = lazy(() => import("./pages/LuckyNumberCheckerPage"));
const MonthlyPlannerPage = lazy(() => import("./pages/MonthlyPlannerPage"));
const MantraPlayerPage = lazy(() => import("./pages/MantraPlayerPage"));
const RedirectHandlerPage = lazy(() => import("./pages/RedirectHandlerPage"));


const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3 text-muted-foreground">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-sm font-medium">Loading…</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
          <CartProvider>
          <Toaster />
          <Sonner />
          <ErrorBoundary inline><TrackingScripts /></ErrorBoundary>
          <BrowserRouter>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {/* Public Pages */}
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/product/:slug" element={<ProductDetailPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/find-my-vibration" element={<DiscoverMulankPage />} />
                <Route path="/discover" element={<DiscoverMulankPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/form" element={<FormPage />} />
                <Route path="/summary" element={<SummaryPage />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/advanced-report" element={<AdvancedReportPage />} />
                <Route path="/calculator" element={<CalculatorTestPage />} />
                <Route path="/tools/vibration" element={<ToolsVibrationPage />} />
                <Route path="/name-analyzer" element={<NameAnalyzerPage />} />
                <Route path="/lucky-number-checker" element={<LuckyNumberCheckerPage />} />
                <Route path="/monthly-planner" element={<MonthlyPlannerPage />} />
                <Route path="/mantras" element={<MantraPlayerPage />} />
                <Route path="/go/:slug" element={<RedirectHandlerPage />} />
                <Route path="/moolank-calculator" element={<MoolankCalculatorPage />} />
                <Route path="/naamank-calculator" element={<NaamankCalculatorPage />} />
                <Route path="/baby-name" element={<BabyNamePage />} />
                <Route path="/daily-forecast" element={<DailyForecastPage />} />
                <Route path="/remedies" element={<RemediesPage />} />
                <Route path="/ai-chat" element={<AiChatPage />} />
                <Route path="/r/:slug" element={<DynamicLandingPage />} />
                <Route path="/report/:slug" element={<StaticReportLanding />} />
                <Route path="/buy/:slug" element={<BuyReportPage />} />
                <Route path="/reports" element={<ReportsCatalogPage />} />
                <Route path="/plus" element={<PlusPage />} />
                <Route path="/plus-success" element={<PlusSuccessPage />} />
                <Route path="/order/:id" element={<OrderSuccessPage />} />

                {/* Auth Pages */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/verify-success" element={<VerifySuccessPage />} />

                {/* Payment Pages */}
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/payment-success" element={<PaymentSuccessPage />} />
                <Route path="/payment-failed" element={<PaymentFailedPage />} />

                {/* Blog */}
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />

                <Route path="/pricing" element={<PricingPage />} />

                {/* Programmatic SEO Routes */}
                <Route path="/numerology/mulank/:number" element={<MulankDetailPseoPage />} />

                {/* Compliance Pages */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/refund" element={<RefundPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/about" element={<AboutPage />} />

                {/* Sample & Admin Dedicated Routes */}
                <Route path="/sample-report" element={<SampleReportPage />} />
                <Route path="/admin-login" element={<AdminLoginPage />} />
                <Route path="/portal-login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                <Route path="/master-portal" element={<AdminRoute><AdminPage /></AdminRoute>} />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <ErrorBoundary inline><PWAInstallPrompt /></ErrorBoundary>
            <ErrorBoundary inline><WhatsAppButton /></ErrorBoundary>
            <ErrorBoundary inline><AiChatWidget /></ErrorBoundary>
            <MobileBottomNav />
            </BrowserRouter>
          </CartProvider>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
