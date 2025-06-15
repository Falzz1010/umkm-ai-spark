
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, BarChart3, LayoutList, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function AppSidebar() {
  const location = useLocation();
  const menu = [
    {
      title: "Dashboard",
      to: "/dashboard",
      icon: Home,
    },
    {
      title: "Analytics",
      to: "/dashboard?tab=analytics",
      icon: BarChart3,
    },
    {
      title: "Produk",
      to: "/dashboard?tab=products",
      icon: LayoutList,
    },
    {
      title: "Integrasi Marketplace", // fitur baru
      to: "/dashboard/marketplace-integrations",
      icon: ShoppingBag,
    }
  ];
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.to === "/dashboard"
                        ? location.pathname === "/dashboard"
                        : location.pathname + location.search === item.to
                    }
                  >
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
