import * as React from "react"
import { Search, ArrowRightLeft, Upload, BarChart3, Heart, Home, Settings, User, Shield } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navigationItems = [
  {
    title: "Dashboard",
    url: "dashboard",
    icon: Home,
    description: "Overview & quick actions"
  },
  {
    title: "Search Codes",
    url: "search",
    icon: Search,
    description: "Find NAMASTE & ICD-11 codes"
  },
  {
    title: "Mapping Gaps",
    url: "translate", 
    icon: ArrowRightLeft,
    description: "Review and improve mappings"
  },
  {
    title: "Encounter Upload",
    url: "encounter",
    icon: Upload,
    description: "Create FHIR encounters"
  },
  {
    title: "Analytics",
    url: "analytics",
    icon: BarChart3,
    description: "View usage statistics"
  },
  {
    title: "ABHA Integration",
    url: "abha",
    icon: Shield,
    description: "Insurance claims & policy exports"
  }
]

const settingsItems = [
  {
    title: "Profile",
    url: "profile",
    icon: User,
    description: "Account settings"
  },
  {
    title: "Settings",
    url: "settings",
    icon: Settings,
    description: "System preferences"
  }
]

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <SidebarContent className="bg-white">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-bold text-gray-900 text-lg">SwasthyaSetu</h2>
                <p className="text-xs text-gray-500">Bridge to Health</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-3">
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton 
                      onClick={() => onNavigate(item.url)}
                      isActive={currentPage === item.url}
                      className={`h-12 rounded-xl transition-all duration-200 ${
                        currentPage === item.url
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Account
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="px-3">
                {settingsItems.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton 
                      onClick={() => onNavigate(item.url)}
                      isActive={currentPage === item.url}
                      className={`h-12 rounded-xl transition-all duration-200 ${
                        currentPage === item.url
                          ? 'bg-blue-50 text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {!collapsed && (
                        <div className="flex flex-col items-start">
                          <span className="font-medium text-sm">{item.title}</span>
                          <span className="text-xs text-gray-500">{item.description}</span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}