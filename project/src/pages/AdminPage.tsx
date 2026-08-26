import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Logo } from '@/components/Logo';
import { supabase } from '@/integrations/supabase/client';
import {
  Users, CreditCard, FileText, Settings, LogOut,
  Shield, BookOpen, Tag, Globe, BarChart3, Sparkles, Star, ScrollText, Smartphone, LayoutTemplate, Crown, Bot, Gem, Heart, ShoppingBag
} from 'lucide-react';
import OtpProvidersManager from '@/components/admin/OtpProvidersManager';
import LandingPageManager from '@/components/admin/LandingPageManager';
import BrandingManager from '@/components/admin/BrandingManager';
import BlogManager from '@/components/admin/BlogManager';
import CouponManager from '@/components/admin/CouponManager';
import UpgradePathsManager from '@/components/admin/UpgradePathsManager';
import SystemSettingsManager from '@/components/admin/SystemSettingsManager';
import SiteContentManager from '@/components/admin/SiteContentManager';
import PaymentManager from '@/components/admin/PaymentManager';
import PricingManager from '@/components/admin/PricingManager';
import ReportCatalogManager from '@/components/admin/ReportCatalogManager';
import ReportContentManager from '@/components/admin/ReportContentManager';
import SubscriptionsManager from '@/components/admin/SubscriptionsManager';
import UserManager from '@/components/admin/UserManager';
import ReportsManager from '@/components/admin/ReportsManager';
import FamousPersonsManager from '@/components/admin/FamousPersonsManager';
import NumerologyDataManager from '@/components/admin/NumerologyDataManager';
import AnalyticsDashboard from '@/components/admin/AnalyticsDashboard';
import FeatureFlagsManager from '@/components/admin/FeatureFlagsManager';
import AdminAuditLog from '@/components/admin/AdminAuditLog';
import RemediesManager from '@/components/admin/RemediesManager';
import RecommendationManager from '@/components/admin/RecommendationManager';
import BabyNamesManager from '@/components/admin/BabyNamesManager';
import AiBotSettingsManager from '@/components/admin/AiBotSettingsManager';
import EcommerceManager from '@/components/admin/EcommerceManager';
import AstrologyKundliManager from '@/components/admin/AstrologyKundliManager';
import SEO from '@/components/SEO';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminPage = () => {
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/login'); };

  const tabOptions = [
    { value: 'dashboard', label: '📊 Analytics Dashboard' },
    { value: 'ecommerce', label: '🛍️ Store & T-Shirts Inventory' },
    { value: 'astrology', label: '⭐ Astrology & Kundli' },
    { value: 'aibot', label: '🤖 AI Astrologer Bot' },
    { value: 'payments', label: '💳 Payments & Orders' },
    { value: 'users', label: '👥 User Management' },
    { value: 'reports', label: '📄 Report Blueprints' },
    { value: 'numerology', label: '✨ Numerology Matrices' },
    { value: 'remedies', label: '💎 Remedial Catalog' },
    { value: 'affiliate', label: '🏷️ Affiliate Network' },
    { value: 'babynames', label: '👶 Baby Names Directory' },
    { value: 'famous', label: '🌟 Famous Celebrities' },
    { value: 'coupons', label: '🏷️ Discount Coupons' },
    { value: 'subscriptions', label: '👑 Plus Memberships' },
    { value: 'blog', label: '📖 Blog Articles CMS' },
    { value: 'pages', label: '📑 Landing Pages CMS' },
    { value: 'content', label: '🌐 Site Copy & Content' },
    { value: 'flags', label: '🛡️ Feature Flags' },
    { value: 'audit', label: '📜 Security Audit Logs' },
    { value: 'otp', label: '📱 OTP SMS Providers' },
    { value: 'settings', label: '⚙️ System Settings' },
  ];

  return (
    <>
      <SEO title="Admin Panel — Ankjyotish" description="Ankjyotish admin panel." canonical="/admin" noindex={true} />
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Logo size="md" />
              <Badge variant="secondary" className="gap-1"><Shield className="w-3 h-3" />Admin Control Panel</Badge>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/dashboard"><Button variant="ghost" size="sm">View Site</Button></Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            {/* Mobile Dropdown for Tab Navigation */}
            <div className="block lg:hidden mb-4">
              <Select value={currentTab} onValueChange={setCurrentTab}>
                <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-sm font-semibold h-11">
                  <SelectValue placeholder="Select Management Section" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700 max-h-72">
                  {tabOptions.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Horizontal Scroll Tabs */}
            <div className="hidden lg:block overflow-x-auto -mx-4 px-4 pb-2">
              <TabsList className="inline-flex w-max">
                <TabsTrigger value="dashboard" className="gap-1 text-xs sm:text-sm"><BarChart3 className="w-3.5 h-3.5" /><span className="hidden sm:inline">Dashboard</span></TabsTrigger>
                <TabsTrigger value="ecommerce" className="gap-1 text-xs sm:text-sm"><ShoppingBag className="w-3.5 h-3.5 text-amber-400" /><span className="hidden sm:inline">Store & T-Shirts</span></TabsTrigger>
                <TabsTrigger value="astrology" className="gap-1 text-xs sm:text-sm"><Star className="w-3.5 h-3.5 text-yellow-400" /><span className="hidden sm:inline">Astrology & Kundli</span></TabsTrigger>
                <TabsTrigger value="aibot" className="gap-1 text-xs sm:text-sm"><Bot className="w-3.5 h-3.5 text-amber-400" /><span className="hidden sm:inline">AI Bot</span></TabsTrigger>
                <TabsTrigger value="payments" className="gap-1 text-xs sm:text-sm"><CreditCard className="w-3.5 h-3.5" /><span className="hidden sm:inline">Payments</span></TabsTrigger>
                <TabsTrigger value="users" className="gap-1 text-xs sm:text-sm"><Users className="w-3.5 h-3.5" /><span className="hidden sm:inline">Users</span></TabsTrigger>
                <TabsTrigger value="reports" className="gap-1 text-xs sm:text-sm"><FileText className="w-3.5 h-3.5" /><span className="hidden sm:inline">Reports</span></TabsTrigger>
                <TabsTrigger value="numerology" className="gap-1 text-xs sm:text-sm"><Sparkles className="w-3.5 h-3.5" /><span className="hidden sm:inline">Numerology</span></TabsTrigger>
                <TabsTrigger value="remedies" className="gap-1 text-xs sm:text-sm"><Gem className="w-3.5 h-3.5" /><span className="hidden sm:inline">Remedies</span></TabsTrigger>
                <TabsTrigger value="affiliate" className="gap-1 text-xs sm:text-sm"><Tag className="w-3.5 h-3.5 text-amber-400" /><span className="hidden sm:inline">Affiliate Links</span></TabsTrigger>
                <TabsTrigger value="babynames" className="gap-1 text-xs sm:text-sm"><Heart className="w-3.5 h-3.5" /><span className="hidden sm:inline">Baby Names</span></TabsTrigger>
                <TabsTrigger value="famous" className="gap-1 text-xs sm:text-sm"><Star className="w-3.5 h-3.5" /><span className="hidden sm:inline">Famous</span></TabsTrigger>
                <TabsTrigger value="coupons" className="gap-1 text-xs sm:text-sm"><Tag className="w-3.5 h-3.5" /><span className="hidden sm:inline">Coupons</span></TabsTrigger>
                <TabsTrigger value="subscriptions" className="gap-1 text-xs sm:text-sm"><Crown className="w-3.5 h-3.5" /><span className="hidden sm:inline">Plus</span></TabsTrigger>
                <TabsTrigger value="blog" className="gap-1 text-xs sm:text-sm"><BookOpen className="w-3.5 h-3.5" /><span className="hidden sm:inline">Blog</span></TabsTrigger>
                <TabsTrigger value="pages" className="gap-1 text-xs sm:text-sm"><LayoutTemplate className="w-3.5 h-3.5" /><span className="hidden sm:inline">Pages</span></TabsTrigger>
                <TabsTrigger value="content" className="gap-1 text-xs sm:text-sm"><Globe className="w-3.5 h-3.5" /><span className="hidden sm:inline">Content</span></TabsTrigger>
                <TabsTrigger value="flags" className="gap-1 text-xs sm:text-sm"><Shield className="w-3.5 h-3.5" /><span className="hidden sm:inline">Flags</span></TabsTrigger>
                <TabsTrigger value="audit" className="gap-1 text-xs sm:text-sm"><ScrollText className="w-3.5 h-3.5" /><span className="hidden sm:inline">Audit</span></TabsTrigger>
                <TabsTrigger value="otp" className="gap-1 text-xs sm:text-sm"><Smartphone className="w-3.5 h-3.5" /><span className="hidden sm:inline">OTP</span></TabsTrigger>
                <TabsTrigger value="settings" className="gap-1 text-xs sm:text-sm"><Settings className="w-3.5 h-3.5" /><span className="hidden sm:inline">Settings</span></TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="dashboard"><AnalyticsDashboard /></TabsContent>
            <TabsContent value="ecommerce"><EcommerceManager /></TabsContent>
            <TabsContent value="astrology"><AstrologyKundliManager /></TabsContent>
            <TabsContent value="aibot"><AiBotSettingsManager /></TabsContent>
            <TabsContent value="payments"><PaymentManager /><div className="mt-6"><ReportCatalogManager /></div><div className="mt-6"><PricingManager /></div></TabsContent>
            <TabsContent value="users"><UserManager /></TabsContent>
            <TabsContent value="reports"><ReportsManager /></TabsContent>
            <TabsContent value="numerology"><NumerologyDataManager /></TabsContent>
            <TabsContent value="remedies"><RemediesManager /></TabsContent>
            <TabsContent value="affiliate"><RecommendationManager /></TabsContent>
            <TabsContent value="babynames"><BabyNamesManager /></TabsContent>
            <TabsContent value="famous"><FamousPersonsManager /></TabsContent>
            <TabsContent value="coupons"><CouponManager /><div className="mt-6"><UpgradePathsManager /></div></TabsContent>
            <TabsContent value="subscriptions"><SubscriptionsManager /></TabsContent>
            <TabsContent value="blog"><BlogManager /></TabsContent>
            <TabsContent value="pages"><ReportContentManager /><div className="mt-6"><LandingPageManager /></div></TabsContent>
            <TabsContent value="content"><SiteContentManager /></TabsContent>
            <TabsContent value="flags"><FeatureFlagsManager /></TabsContent>
            <TabsContent value="audit"><AdminAuditLog /></TabsContent>
            <TabsContent value="otp"><OtpProvidersManager /></TabsContent>
            <TabsContent value="settings"><BrandingManager /><div className="mt-6"><SystemSettingsManager /></div></TabsContent>
          </Tabs>
        </main>
      </div>
    </>
  );
};

export default AdminPage;
