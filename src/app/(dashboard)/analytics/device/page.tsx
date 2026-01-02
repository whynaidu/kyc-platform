"use client";

import * as React from "react";
import { Smartphone, Monitor, Tablet, Wifi, AlertTriangle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { KPICard } from "@/components/kpi-card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Pie, PieChart, Cell, Area, AreaChart } from "recharts";

import {
    deviceStats,
    osStats,
    browserStats,
    networkStats,
    getDeviceKPIs,
    getDeviceTrends,
} from "@/lib/mock-data";

const chartConfig = {
    count: {
        label: "Verifications",
        color: "var(--primary)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-1)",
    },
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
    tablet: {
        label: "Tablet",
        color: "var(--chart-3)",
    },
} satisfies ChartConfig;

const DEVICE_COLORS = {
    mobile: "var(--chart-1)",
    desktop: "var(--chart-2)",
    tablet: "var(--chart-3)",
};

const OS_COLORS = {
    Android: "#3DDC84",
    iOS: "#007AFF",
    Windows: "#00A4EF",
    macOS: "#A2AAAD",
    Linux: "#FCC624",
    Other: "#6B7280",
};

function getDeviceIcon(type: string) {
    switch (type) {
        case 'mobile':
            return <Smartphone className="h-4 w-4" />;
        case 'desktop':
            return <Monitor className="h-4 w-4" />;
        case 'tablet':
            return <Tablet className="h-4 w-4" />;
        default:
            return <Smartphone className="h-4 w-4" />;
    }
}

export default function DeviceAnalyticsPage() {
    const [deviceFilter, setDeviceFilter] = React.useState<string>("all");

    const kpis = getDeviceKPIs();
    const trends = getDeviceTrends(14);

    const filteredOsStats = React.useMemo(() => {
        if (deviceFilter === "all") return osStats;
        if (deviceFilter === "mobile") {
            return osStats.filter(s => s.os === 'Android' || s.os === 'iOS');
        }
        if (deviceFilter === "desktop") {
            return osStats.filter(s => s.os === 'Windows' || s.os === 'macOS' || s.os === 'Linux');
        }
        return osStats;
    }, [deviceFilter]);

    const totalVerifications = deviceStats.reduce((sum, d) => sum + d.count, 0);

    const pieData = deviceStats.map(d => ({
        name: d.deviceType.charAt(0).toUpperCase() + d.deviceType.slice(1),
        value: d.count,
        fill: DEVICE_COLORS[d.deviceType as keyof typeof DEVICE_COLORS],
    }));

    const osBarData = filteredOsStats.map(o => ({
        os: o.os,
        count: o.count,
        successRate: o.successRate,
        fill: OS_COLORS[o.os as keyof typeof OS_COLORS] || OS_COLORS.Other,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Device Analytics</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Device, browser, and network performance breakdown.
                    </p>
                </div>
                <Select value={deviceFilter} onValueChange={setDeviceFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Device Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Devices</SelectItem>
                        <SelectItem value="mobile">Mobile</SelectItem>
                        <SelectItem value="desktop">Desktop</SelectItem>
                        <SelectItem value="tablet">Tablet</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Verifications"
                    value={kpis.totalVerifications.value}
                    badge={`+${kpis.totalVerifications.changePercentage}%`}
                    badgeVariant="success"
                    trend="up"
                    description="All device types"
                    subtitle="Last 30 days"
                />
                <KPICard
                    title="Mobile Share"
                    value={kpis.mobileShare.value}
                    suffix="%"
                    badge={`+${kpis.mobileShare.changePercentage}%`}
                    badgeVariant="info"
                    trend="up"
                    description="Growing mobile usage"
                    subtitle="vs last month"
                />
                <KPICard
                    title="Avg Success Rate"
                    value={kpis.avgSuccessRate.value}
                    suffix="%"
                    badge={kpis.avgSuccessRate.value >= 92 ? "Excellent" : "Good"}
                    badgeVariant={kpis.avgSuccessRate.value >= 92 ? "success" : "warning"}
                    description="Across all devices"
                    subtitle="Target: 92%"
                />
                <KPICard
                    title="Browser Issues"
                    value={kpis.browserIssues.value}
                    badge={`${kpis.browserIssues.changePercentage}%`}
                    badgeVariant="success"
                    trend="down"
                    description="Compatibility issues"
                    subtitle="Decreasing trend"
                />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="browsers">Browsers</TabsTrigger>
                    <TabsTrigger value="network">Network</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Device Distribution Pie Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Device Distribution</CardTitle>
                                <CardDescription>Verifications by device type</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[250px] w-full mx-auto">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="40%"
                                            outerRadius="70%"
                                            paddingAngle={2}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ChartContainer>
                                <div className="mt-4 flex flex-wrap justify-center gap-4">
                                    {pieData.map((item, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <div
                                                className="h-3 w-3 rounded-full"
                                                style={{ backgroundColor: item.fill }}
                                            />
                                            <span className="text-muted-foreground">
                                                {item.name}: {((item.value / totalVerifications) * 100).toFixed(1)}%
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* OS Distribution Bar Chart */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Operating Systems</CardTitle>
                                <CardDescription>Verification count by OS</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                    <BarChart data={osBarData} layout="vertical" barCategoryGap="16%">
                                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="os"
                                            type="category"
                                            width={70}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={24}>
                                            {osBarData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Device Trends */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Device Trends</CardTitle>
                            <CardDescription>Daily verifications by device type (last 14 days)</CardDescription>
                        </CardHeader>
                        <CardContent className="px-2 sm:px-6">
                            <ChartContainer config={chartConfig} className="h-[250px] w-full">
                                <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="mobileGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="desktopGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="tabletGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--chart-3)" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="var(--chart-3)" stopOpacity={0.05} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        tick={{ fontSize: 10 }}
                                        tickLine={false}
                                        axisLine={false}
                                        interval="preserveStartEnd"
                                    />
                                    <YAxis tick={{ fontSize: 10 }} width={35} tickLine={false} axisLine={false} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area type="monotone" dataKey="mobile" stackId="1" stroke="var(--chart-1)" fill="url(#mobileGradient)" />
                                    <Area type="monotone" dataKey="desktop" stackId="1" stroke="var(--chart-2)" fill="url(#desktopGradient)" />
                                    <Area type="monotone" dataKey="tablet" stackId="1" stroke="var(--chart-3)" fill="url(#tabletGradient)" />
                                </AreaChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    {/* Device Stats Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Device Performance</CardTitle>
                            <CardDescription>Success rates and completion time by device</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Device</TableHead>
                                        <TableHead className="text-right">Verifications</TableHead>
                                        <TableHead className="text-right">Success Rate</TableHead>
                                        <TableHead className="text-right">Avg. Time</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {deviceStats.map((device) => (
                                        <TableRow key={device.deviceType}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getDeviceIcon(device.deviceType)}
                                                    <span className="capitalize font-medium">{device.deviceType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{device.count.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={device.successRate >= 92 ? "text-green-500" : device.successRate >= 90 ? "text-yellow-500" : "text-red-500"}>
                                                    {device.successRate}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">{Math.round(device.avgCompletionTime / 60)} min</TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={device.successRate >= 92 ? "default" : "secondary"}
                                                    className={device.successRate >= 92 ? "bg-green-500/10 text-green-500" : ""}
                                                >
                                                    {device.successRate >= 92 ? "Excellent" : device.successRate >= 90 ? "Good" : "Needs Attention"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Browsers Tab */}
                <TabsContent value="browsers" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Browser Compatibility</CardTitle>
                            <CardDescription>Performance and issues by browser</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Browser</TableHead>
                                        <TableHead className="text-right">Users</TableHead>
                                        <TableHead className="text-right">Success Rate</TableHead>
                                        <TableHead className="text-right">Issues</TableHead>
                                        <TableHead>Common Issues</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {browserStats.map((browser) => (
                                        <TableRow key={browser.browser}>
                                            <TableCell className="font-medium">{browser.browser}</TableCell>
                                            <TableCell className="text-right">{browser.count.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={browser.successRate >= 92 ? "text-green-500" : browser.successRate >= 90 ? "text-yellow-500" : "text-red-500"}>
                                                    {browser.successRate}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    {browser.compatibilityIssues > 200 && <AlertTriangle className="h-3 w-3 text-yellow-500" />}
                                                    <span className={browser.compatibilityIssues > 200 ? "text-yellow-500" : ""}>
                                                        {browser.compatibilityIssues}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {browser.commonIssues.slice(0, 2).map((issue, idx) => (
                                                        <Badge key={idx} variant="outline" className="text-xs">
                                                            {issue}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Network Tab */}
                <TabsContent value="network" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Network Performance</CardTitle>
                            <CardDescription>Impact of network quality on verifications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Network</TableHead>
                                        <TableHead className="text-right">Users</TableHead>
                                        <TableHead className="text-right">Avg Latency</TableHead>
                                        <TableHead className="text-right">Dropout Rate</TableHead>
                                        <TableHead className="text-right">Avg Time</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {networkStats.map((network) => (
                                        <TableRow key={network.networkType}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Wifi className="h-4 w-4" />
                                                    <span className="font-medium">{network.networkType}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{network.count.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">{network.avgLatency} ms</TableCell>
                                            <TableCell className="text-right">
                                                <span className={network.dropoutRate <= 3 ? "text-green-500" : network.dropoutRate <= 8 ? "text-yellow-500" : "text-red-500"}>
                                                    {network.dropoutRate}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">{Math.round(network.avgCompletionTime / 60)} min</TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={network.dropoutRate <= 3 ? "default" : "destructive"}
                                                    className={network.dropoutRate <= 3 ? "bg-green-500/10 text-green-500" : ""}
                                                >
                                                    {network.dropoutRate <= 3 ? "Stable" : network.dropoutRate <= 8 ? "Fair" : "Unstable"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
