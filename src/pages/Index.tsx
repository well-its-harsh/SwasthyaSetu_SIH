import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { AppTopbar } from "@/components/layout/AppTopbar";
import Dashboard from "./Dashboard";
import SearchCodes from "./SearchCodes";
import TranslateCodes from "./TranslateCodes";
import EncounterUpload from "./EncounterUpload";
import Analytics from "./Analytics";
import ABHAIntegration from "./ABHAIntegration";

export default function Index() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const getPageTitle = () => {
    switch (currentPage) {
      case "search": return "Search Medical Codes";
      case "translate": return "Mapping Gaps Dashboard";
      case "encounter": return "Patient Record Upload";
      case "analytics": return "Analytics Dashboard";
      case "abha": return "ABHA Integration";
      default: return "SwasthyaSetu Dashboard";
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "search":
        return <SearchCodes onNavigate={setCurrentPage} />;
      case "translate":
        return <TranslateCodes onNavigate={setCurrentPage} />;
      case "encounter":
        return <EncounterUpload onNavigate={setCurrentPage} />;
      case "analytics":
        return <Analytics onNavigate={setCurrentPage} />;
      case "abha":
        return <ABHAIntegration onNavigate={setCurrentPage} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
        <div className="flex-1 flex flex-col">
          <AppTopbar 
            title={getPageTitle()} 
            currentPage={currentPage}
            onNavigate={setCurrentPage}
          />
          <main className="flex-1">
            {renderPage()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}