import * as React from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut, Settings, User, Heart, BarChart3, ArrowRightLeft, Upload, Search, Shield } from "lucide-react"

interface AppTopbarProps {
  title: string
  currentPage?: string
  onNavigate?: (page: string) => void
}

export function AppTopbar({ title, currentPage, onNavigate }: AppTopbarProps) {
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/')
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Heart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'translate', label: 'Mapping Gaps', icon: ArrowRightLeft },
    { id: 'encounter', label: 'Upload', icon: Upload },
    { id: 'abha', label: 'ABHA', icon: Shield },
  ]

  return (
    <header className="sticky top-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 h-full">
        {/* Left side - Logo and Navigation */}
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="h-8 w-8 text-gray-600 hover:text-blue-600 transition-colors" />
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900">SwasthyaSetu</h1>
                <p className="text-xs text-gray-500 -mt-1">Bridge to Health</p>
              </div>
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentPage === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right side - Profile */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder-doctor.jpg" alt="Dr. Sharma" />
                  <AvatarFallback className="bg-blue-600 text-white">DS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Rajesh Sharma</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Internal Medicine
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    ID: DOC001
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}