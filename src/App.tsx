import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RequireAuth } from "@/components/RequireAuth";
import { ConsoleLayout } from "@/layouts/ConsoleLayout";
import { PublicLayout } from "@/layouts/PublicLayout";
import { queryClient } from "@/lib/query-client";
import { Landing } from "@/marketing/Landing";
import { Pricing } from "@/marketing/Pricing";
import { AuthPage } from "@/pages/AuthPage";
import { AnalyticsPage } from "@/pages/app/AnalyticsPage";
import { AssistantPage } from "@/pages/app/AssistantPage";
import { DashboardPage } from "@/pages/app/DashboardPage";
import { ExplorerPage } from "@/pages/app/ExplorerPage";
import { IntegrationsPage } from "@/pages/app/IntegrationsPage";
import { SettingsPage } from "@/pages/app/SettingsPage";

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/pricing" element={<Pricing />} />
          </Route>
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route element={<RequireAuth />}>
            <Route path="/app" element={<ConsoleLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="explorer" element={<ExplorerPage />} />
              <Route path="assistant" element={<AssistantPage />} />
              <Route path="integrations" element={<IntegrationsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
