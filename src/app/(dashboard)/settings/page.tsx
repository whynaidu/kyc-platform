"use client";

import * as React from "react";
import {
    Bell,
    Palette,
    Shield,
    Mail,
    MessageSquare,
    Slack,
    Check,
    Moon,
    Sun,
    Monitor,
    ScanFace,
    Camera,
    Edit3,
    MapPin,
    Save,
    RotateCcw,
} from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Color accent options - using OKLCH format to match globals.css
const accentColors = [
    { name: "Neutral", value: "neutral", color: "", fg: "" },
    { name: "Amber", value: "amber", color: "oklch(0.75 0.19 70)", fg: "oklch(0.2 0 0)" },
    { name: "Blue", value: "blue", color: "oklch(0.6 0.2 250)", fg: "oklch(1 0 0)" },
    { name: "Cyan", value: "cyan", color: "oklch(0.7 0.15 200)", fg: "oklch(0.2 0 0)" },
    { name: "Emerald", value: "emerald", color: "oklch(0.65 0.19 160)", fg: "oklch(1 0 0)" },
    { name: "Fuchsia", value: "fuchsia", color: "oklch(0.65 0.27 320)", fg: "oklch(1 0 0)" },
    { name: "Green", value: "green", color: "oklch(0.55 0.2 150)", fg: "oklch(1 0 0)" },
    { name: "Indigo", value: "indigo", color: "oklch(0.55 0.22 270)", fg: "oklch(1 0 0)" },
    { name: "Lime", value: "lime", color: "oklch(0.8 0.2 120)", fg: "oklch(0.2 0 0)" },
    { name: "Orange", value: "orange", color: "oklch(0.7 0.2 50)", fg: "oklch(0.2 0 0)" },
    { name: "Pink", value: "pink", color: "oklch(0.7 0.24 0)", fg: "oklch(0.2 0 0)" },
];

// VKYC Steps configuration
const vkycSteps = [
    { id: "face_liveness", name: "Face Liveness Check", icon: ScanFace, description: "Verify user is a real person" },
    { id: "face_match", name: "Face Matching", icon: Camera, description: "Match face with ID document" },
    { id: "handwriting", name: "Handwriting Verification", icon: Edit3, description: "Verify handwriting sample" },
    { id: "location", name: "Location Capture", icon: MapPin, description: "Capture user location" },
];

export default function SettingsPage() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Notification settings
    const [notifications, setNotifications] = React.useState({
        email: {
            enabled: true,
            address: "john.smith@company.com",
            onVerificationComplete: true,
            onVerificationFailed: true,
            onNewAssignment: true,
            dailyDigest: false,
        },
        slack: {
            enabled: false,
            webhookUrl: "",
            channel: "#kyc-alerts",
            onVerificationComplete: true,
            onVerificationFailed: true,
        },
        teams: {
            enabled: false,
            webhookUrl: "",
            onVerificationComplete: true,
            onVerificationFailed: true,
        },
    });

    // Theme settings
    const [accentColor, setAccentColor] = React.useState("default");

    // VKYC Configuration
    const [vkycConfig, setVkycConfig] = React.useState({
        face_liveness: true,
        face_match: true,
        handwriting: true,
        location: true,
    });

    const applyAccentColor = React.useCallback((colorValue: string) => {
        const color = accentColors.find(c => c.value === colorValue);
        if (color && color.value !== "default" && color.color) {
            document.documentElement.style.setProperty("--primary", color.color);
            document.documentElement.style.setProperty("--primary-foreground", color.fg);
        } else {
            document.documentElement.style.removeProperty("--primary");
            document.documentElement.style.removeProperty("--primary-foreground");
        }
    }, []);

    React.useEffect(() => {
        setMounted(true);
        // Load saved accent color
        const savedAccent = localStorage.getItem("accent-color");
        if (savedAccent) {
            setAccentColor(savedAccent);
            applyAccentColor(savedAccent);
        }
        // Load saved VKYC config
        const savedVkycConfig = localStorage.getItem("vkyc-config");
        if (savedVkycConfig) {
            setVkycConfig(JSON.parse(savedVkycConfig));
        }
    }, [applyAccentColor]);

    const handleAccentChange = (value: string) => {
        setAccentColor(value);
        applyAccentColor(value);
        localStorage.setItem("accent-color", value);
        toast.success("Accent color updated");
    };

    const handleVkycToggle = (stepId: string) => {
        const newConfig = { ...vkycConfig, [stepId]: !vkycConfig[stepId as keyof typeof vkycConfig] };
        // Ensure at least one step is enabled
        const enabledCount = Object.values(newConfig).filter(Boolean).length;
        if (enabledCount === 0) {
            toast.error("At least one step must be enabled");
            return;
        }
        setVkycConfig(newConfig);
        localStorage.setItem("vkyc-config", JSON.stringify(newConfig));
        toast.success("VKYC configuration updated");
    };

    const saveNotificationSettings = () => {
        localStorage.setItem("notification-settings", JSON.stringify(notifications));
        toast.success("Notification settings saved");
    };

    const testNotification = (channel: string) => {
        toast.success(`Test notification sent to ${channel}`, {
            description: "Check your channel for the test message.",
        });
    };

    if (!mounted) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                    Manage your preferences, notifications, and integrations.
                </p>
            </div>

            <Tabs defaultValue="notifications" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="appearance" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Appearance
                    </TabsTrigger>
                    <TabsTrigger value="vkyc" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        VKYC Config
                    </TabsTrigger>
                </TabsList>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    {/* Email Notifications */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Mail className="h-5 w-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Email Notifications</CardTitle>
                                        <CardDescription>Receive notifications via email</CardDescription>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications.email.enabled}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, email: { ...notifications.email, enabled: checked } })
                                    }
                                />
                            </div>
                        </CardHeader>
                        {notifications.email.enabled && (
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email Address</Label>
                                    <Input
                                        type="email"
                                        value={notifications.email.address}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, email: { ...notifications.email, address: e.target.value } })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>Notification Events</Label>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification completed</span>
                                        <Switch
                                            checked={notifications.email.onVerificationComplete}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, email: { ...notifications.email, onVerificationComplete: checked } })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification failed</span>
                                        <Switch
                                            checked={notifications.email.onVerificationFailed}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, email: { ...notifications.email, onVerificationFailed: checked } })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">New assignment</span>
                                        <Switch
                                            checked={notifications.email.onNewAssignment}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, email: { ...notifications.email, onNewAssignment: checked } })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Daily digest</span>
                                        <Switch
                                            checked={notifications.email.dailyDigest}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, email: { ...notifications.email, dailyDigest: checked } })
                                            }
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => testNotification("Email")}>
                                    Send Test Email
                                </Button>
                            </CardContent>
                        )}
                    </Card>

                    {/* Slack Integration */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-[#4A154B]/10 flex items-center justify-center">
                                        <Slack className="h-5 w-5 text-[#4A154B]" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Slack Integration</CardTitle>
                                        <CardDescription>Send notifications to Slack channels</CardDescription>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications.slack.enabled}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, slack: { ...notifications.slack, enabled: checked } })
                                    }
                                />
                            </div>
                        </CardHeader>
                        {notifications.slack.enabled && (
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Webhook URL</Label>
                                    <Input
                                        type="url"
                                        placeholder="https://hooks.slack.com/services/..."
                                        value={notifications.slack.webhookUrl}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, slack: { ...notifications.slack, webhookUrl: e.target.value } })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Channel</Label>
                                    <Input
                                        placeholder="#kyc-alerts"
                                        value={notifications.slack.channel}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, slack: { ...notifications.slack, channel: e.target.value } })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>Notification Events</Label>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification completed</span>
                                        <Switch
                                            checked={notifications.slack.onVerificationComplete}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, slack: { ...notifications.slack, onVerificationComplete: checked } })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification failed</span>
                                        <Switch
                                            checked={notifications.slack.onVerificationFailed}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, slack: { ...notifications.slack, onVerificationFailed: checked } })
                                            }
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => testNotification("Slack")}>
                                    Send Test Notification
                                </Button>
                            </CardContent>
                        )}
                    </Card>

                    {/* Microsoft Teams Integration */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-[#5059C9]/10 flex items-center justify-center">
                                        <MessageSquare className="h-5 w-5 text-[#5059C9]" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg">Microsoft Teams</CardTitle>
                                        <CardDescription>Send notifications to Teams channels</CardDescription>
                                    </div>
                                </div>
                                <Switch
                                    checked={notifications.teams.enabled}
                                    onCheckedChange={(checked) =>
                                        setNotifications({ ...notifications, teams: { ...notifications.teams, enabled: checked } })
                                    }
                                />
                            </div>
                        </CardHeader>
                        {notifications.teams.enabled && (
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Webhook URL</Label>
                                    <Input
                                        type="url"
                                        placeholder="https://outlook.office.com/webhook/..."
                                        value={notifications.teams.webhookUrl}
                                        onChange={(e) =>
                                            setNotifications({ ...notifications, teams: { ...notifications.teams, webhookUrl: e.target.value } })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-3">
                                    <Label>Notification Events</Label>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification completed</span>
                                        <Switch
                                            checked={notifications.teams.onVerificationComplete}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, teams: { ...notifications.teams, onVerificationComplete: checked } })
                                            }
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm">Verification failed</span>
                                        <Switch
                                            checked={notifications.teams.onVerificationFailed}
                                            onCheckedChange={(checked) =>
                                                setNotifications({ ...notifications, teams: { ...notifications.teams, onVerificationFailed: checked } })
                                            }
                                        />
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={() => testNotification("Teams")}>
                                    Send Test Notification
                                </Button>
                            </CardContent>
                        )}
                    </Card>

                    <div className="flex justify-end">
                        <Button onClick={saveNotificationSettings}>
                            <Save className="mr-2 h-4 w-4" />
                            Save Notification Settings
                        </Button>
                    </div>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                    {/* Theme Mode */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Mode</CardTitle>
                            <CardDescription>Choose between light, dark, or system theme</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <Button
                                    variant={theme === "light" ? "default" : "outline"}
                                    className="flex flex-col h-auto py-4 gap-2"
                                    onClick={() => setTheme("light")}
                                >
                                    <Sun className="h-5 w-5" />
                                    <span>Light</span>
                                    {theme === "light" && <Check className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant={theme === "dark" ? "default" : "outline"}
                                    className="flex flex-col h-auto py-4 gap-2"
                                    onClick={() => setTheme("dark")}
                                >
                                    <Moon className="h-5 w-5" />
                                    <span>Dark</span>
                                    {theme === "dark" && <Check className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant={theme === "system" ? "default" : "outline"}
                                    className="flex flex-col h-auto py-4 gap-2"
                                    onClick={() => setTheme("system")}
                                >
                                    <Monitor className="h-5 w-5" />
                                    <span>System</span>
                                    {theme === "system" && <Check className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Accent Color */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Accent Color</CardTitle>
                            <CardDescription>Choose your preferred accent color</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-4 gap-3">
                                {accentColors.map((color) => (
                                    <button
                                        key={color.value}
                                        className={`relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${accentColor === color.value
                                            ? "border-primary bg-primary/5"
                                            : "border-border hover:border-muted-foreground"
                                            }`}
                                        onClick={() => handleAccentChange(color.value)}
                                    >
                                        <div
                                            className="h-8 w-8 rounded-full"
                                            style={{ backgroundColor: color.color || "oklch(0.55 0.25 290)" }}
                                        />
                                        <span className="text-xs">{color.name}</span>
                                        {accentColor === color.value && (
                                            <Check className="absolute top-1 right-1 h-4 w-4 text-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* VKYC Configuration Tab */}
                <TabsContent value="vkyc" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>AI Agent VKYC Flow Configuration</CardTitle>
                            <CardDescription>
                                Enable or disable individual verification steps in the VKYC flow.
                                At least one step must remain enabled.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {vkycSteps.map((step, index) => (
                                <div key={step.id} className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-sm font-medium">
                                            {index + 1}
                                        </div>
                                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <step.icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{step.name}</p>
                                            <p className="text-sm text-muted-foreground">{step.description}</p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={vkycConfig[step.id as keyof typeof vkycConfig]}
                                        onCheckedChange={() => handleVkycToggle(step.id)}
                                    />
                                </div>
                            ))}

                            <Separator />

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Active Steps</p>
                                    <p className="text-sm text-muted-foreground">
                                        {Object.values(vkycConfig).filter(Boolean).length} of 4 steps enabled
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setVkycConfig({ face_liveness: true, face_match: true, handwriting: true, location: true });
                                        localStorage.setItem("vkyc-config", JSON.stringify({ face_liveness: true, face_match: true, handwriting: true, location: true }));
                                        toast.success("VKYC configuration reset to defaults");
                                    }}
                                >
                                    <RotateCcw className="mr-2 h-4 w-4" />
                                    Reset to Defaults
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Preview */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Flow Preview</CardTitle>
                            <CardDescription>Preview of enabled verification steps</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2">
                                {vkycSteps
                                    .filter(step => vkycConfig[step.id as keyof typeof vkycConfig])
                                    .map((step, index, arr) => (
                                        <React.Fragment key={step.id}>
                                            <div className="flex flex-col items-center">
                                                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                                                    <step.icon className="h-5 w-5" />
                                                </div>
                                                <span className="text-xs mt-1 text-center max-w-16">{step.name.split(" ")[0]}</span>
                                            </div>
                                            {index < arr.length - 1 && (
                                                <div className="h-0.5 w-8 bg-primary flex-shrink-0" />
                                            )}
                                        </React.Fragment>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
