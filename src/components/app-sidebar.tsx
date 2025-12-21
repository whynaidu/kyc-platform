"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import {
    LayoutDashboard,
    Users,
    Shield,
    Video,
    UserCheck,
    MapPin,
    Settings,
    LogOut,
    ChevronDown,
    Fingerprint,
    ScanFace,
    PenTool,
    BarChart3,
    UserCog,
    ClipboardList,
    LineChart,
    User,
    UserPlus2,
    Phone,
    CreditCard,
    FileCheck,
    Building2,
    CheckSquare,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCurrentUser, logout, hasRole } from "@/lib/auth"
import { AuthUser } from "@/types"

const mainNavItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "agent", "user"],
    },
]

const kycNavItems = [
    {
        title: "AI Agent VKYC",
        url: "/kyc",
        icon: Shield,
        roles: ["admin", "agent", "user"],
    },
    {
        title: "Individual Steps",
        icon: Fingerprint,
        roles: ["admin", "agent", "user"],
        items: [
            { title: "Face Liveness", url: "/kyc/face-liveness", icon: ScanFace },
            { title: "Face Match", url: "/kyc/face-match", icon: Fingerprint },
            { title: "Handwriting", url: "/kyc/handwriting", icon: PenTool },
            { title: "Location", url: "/kyc/location", icon: MapPin },
        ],
    },
    {
        title: "Video KYC",
        url: "/video-kyc",
        icon: Video,
        roles: ["admin", "agent", "user"],
    },
]

const agentNavItems = [
    {
        title: "Agent Dashboard",
        icon: UserCheck,
        roles: ["admin", "agent"],
        items: [
            { title: "Overview", url: "/agent", icon: LayoutDashboard },
            { title: "Queue", url: "/agent/queue", icon: ClipboardList },
            { title: "Performance", url: "/agent/performance", icon: LineChart },
            { title: "Video Session", url: "/agent/video-session", icon: Video },
        ],
    },
]

const adminNavItems = [
    {
        title: "Admin",
        icon: UserCog,
        roles: ["admin"],
        items: [
            { title: "Overview", url: "/admin", icon: LayoutDashboard },
            { title: "All Agents", url: "/admin/agents", icon: UserCheck },
            { title: "Users", url: "/admin/users", icon: Users },
            { title: "Roles", url: "/admin/roles", icon: Shield },
        ],
    },
    {
        title: "Analytics",
        icon: BarChart3,
        roles: ["admin"],
        items: [
            { title: "Location Analytics", url: "/analytics/location", icon: MapPin },
        ],
    },
]

const onboardingNavItems = [
    {
        title: "Digital Onboarding",
        icon: UserPlus2,
        roles: ["admin", "agent", "user"],
        items: [
            { title: "Start Onboarding", url: "/onboarding", icon: UserPlus2 },
            { title: "1. Mobile & Email", url: "/onboarding/mobile-verify", icon: Phone },
            { title: "2. Identity (Aadhaar/PAN)", url: "/onboarding/identity-verify", icon: FileCheck },
            { title: "3. Video KYC", url: "/onboarding/video-kyc", icon: Video },
            { title: "4. Address", url: "/onboarding/address-verify", icon: MapPin },
            { title: "5. Bank Account", url: "/onboarding/bank-link", icon: Building2 },
            { title: "6. Review & Submit", url: "/onboarding/review", icon: CheckSquare },
        ],
    },
]

interface NavItemWithSubProps {
    item: {
        title: string
        icon: React.ComponentType<{ className?: string }>
        roles: string[]
        items?: { title: string; url: string; icon: React.ComponentType<{ className?: string }> }[]
        url?: string
    }
    pathname: string
}

function NavItemWithSub({ item, pathname }: NavItemWithSubProps) {
    const isActive = item.items?.some(sub => pathname === sub.url) || pathname === item.url

    if (item.items) {
        return (
            <Collapsible defaultOpen={isActive} className="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton isActive={isActive}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            {item.items.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.url}>
                                    <SidebarMenuSubButton asChild isActive={pathname === subItem.url}>
                                        <Link href={subItem.url}>
                                            <subItem.icon className="h-4 w-4" />
                                            <span>{subItem.title}</span>
                                        </Link>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        )
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url!}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                </Link>
            </SidebarMenuButton>
        </SidebarMenuItem>
    )
}

export function AppSidebar() {
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = React.useState<AuthUser | null>(null)

    React.useEffect(() => {
        setUser(getCurrentUser())
    }, [])

    const handleLogout = () => {
        logout()
        router.push("/login")
    }

    const filterByRole = <T extends { roles: string[] }>(items: T[]): T[] => {
        if (!user) return []
        return items.filter(item => item.roles.includes(user.role))
    }

    return (
        <Sidebar>
            <SidebarHeader className="border-b border-border p-4">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-lg font-semibold">KYC Platform</span>
                </Link>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Main</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filterByRole(mainNavItems).map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                                        <Link href={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>KYC</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filterByRole(kycNavItems).map((item) => (
                                <NavItemWithSub key={item.title} item={item} pathname={pathname} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Onboarding</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filterByRole(onboardingNavItems).map((item) => (
                                <NavItemWithSub key={item.title} item={item} pathname={pathname} />
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {filterByRole(agentNavItems).length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Agent</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {filterByRole(agentNavItems).map((item) => (
                                    <NavItemWithSub key={item.title} item={item} pathname={pathname} />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}

                {filterByRole(adminNavItems).length > 0 && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {filterByRole(adminNavItems).map((item) => (
                                    <NavItemWithSub key={item.title} item={item} pathname={pathname} />
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter className="border-t border-border p-4">
                {user && (
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="truncate text-sm font-medium">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="rounded-md p-2 hover:bg-accent"
                            aria-label="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </SidebarFooter>
        </Sidebar>
    )
}
