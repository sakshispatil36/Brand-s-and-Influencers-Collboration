import {LayoutDashboard,Briefcase,Users,TrendingUp,Settings} from "lucide-react";
import {Sidebar,SidebarContent,SidebarGroup,SidebarMenu,SidebarMenuButton,SidebarMenuItem,SidebarTrigger,useSidebar,SidebarGroupLabel,SidebarGroupContent} from "@/components/ui/sidebar";
//import { NavLink } from "@/components/NavLink";

interface DashboardSidebarProps {
  userType: "influencer" | "brand";
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardSidebar = ({userType,activeTab,onTabChange,}: DashboardSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const influencerItems = [
    { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", title: "Campaigns", icon: Briefcase },
    { id: "settings", title: "Settings", icon: Settings },
  ];

  const brandItems = [
    { id: "dashboard", title: "Dashboard", icon: LayoutDashboard },
    { id: "campaigns", title: "My Campaigns", icon: Briefcase }, // ✅ ID FIXED
    { id: "influencers", title: "Influencers", icon: Users },
    { id: "analytics", title: "Analytics", icon: TrendingUp },
    { id: "settings", title: "Settings", icon: Settings },
  ];

  const items = userType === "influencer" ? influencerItems : brandItems;

  return (
      <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
        <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {userType === "influencer" ? "Influencer" : "Brand"} Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => onTabChange(item.id)}
                    className={
                      activeTab === item.id
                        ? "bg-accent text-accent-foreground data-[active=true]:bg-accent"
                        : "hover:bg-accent/50"
                    }
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DashboardSidebar;
