"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";

import { regionalStats } from "@/lib/mock-data";
import { IndiaMapMapcn } from "@/components/india-map-mapcn";
import { formatIndianNumber } from "@/lib/utils/indian-format";

const chartConfig = {
    verifications: {
        label: "Verifications",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

// Indian zone colors
const ZONE_COLORS = {
    "North": "#3b82f6",
    "South": "#22c55e",
    "East": "#f59e0b",
    "West": "#8b5cf6",
    "Central": "#ef4444",
    "Northeast": "#06b6d4",
} as const;


export default function LocationAnalyticsPage() {
    const [regionFilter, setRegionFilter] = React.useState<string>("all");

    const regions = React.useMemo(() => {
        return [...new Set(regionalStats.map(s => s.region))];
    }, []);

    const filteredStats = React.useMemo(() => {
        if (regionFilter === "all") return regionalStats;
        return regionalStats.filter(s => s.region === regionFilter);
    }, [regionFilter]);

    const totalVerifications = filteredStats.reduce((sum, s) => sum + s.verifications, 0);
    const avgSuccessRate = filteredStats.reduce((sum, s) => sum + s.successRate, 0) / filteredStats.length;
    const topCountry = [...filteredStats].sort((a, b) => b.verifications - a.verifications)[0];

    // Regional data for pie chart
    const regionData = React.useMemo(() => {
        const grouped = regionalStats.reduce((acc, stat) => {
            if (!acc[stat.region]) {
                acc[stat.region] = { region: stat.region, verifications: 0, countries: 0 };
            }
            acc[stat.region].verifications += stat.verifications;
            acc[stat.region].countries += 1;
            return acc;
        }, {} as Record<string, { region: string; verifications: number; countries: number }>);
        return Object.values(grouped);
    }, []);

    // Bar chart data - top 8 countries
    const barChartData = [...filteredStats]
        .sort((a, b) => b.verifications - a.verifications)
        .slice(0, 8)
        .map(s => ({
            country: s.country,
            verifications: s.verifications,
            successRate: s.successRate,
        }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Location Analytics</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Geographic distribution of KYC verifications.
                    </p>
                </div>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Regions</SelectItem>
                        {regions.map((region) => (
                            <SelectItem key={region} value={region}>
                                {region}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Verifications"
                    value={totalVerifications}
                    badge="+12.5%"
                    badgeVariant="success"
                    trend="up"
                    description="Strong regional coverage"
                    subtitle="Compared to last month"
                />
                <KPICard
                    title="States/UTs Active"
                    value={filteredStats.length}
                    badge="All India"
                    badgeVariant="info"
                    description="Geographic spread"
                    subtitle={`Across ${regions.length} zones`}
                />
                <KPICard
                    title="Avg. Success Rate"
                    value={avgSuccessRate.toFixed(1)}
                    suffix="%"
                    badge={avgSuccessRate >= 90 ? "Excellent" : "Good"}
                    badgeVariant={avgSuccessRate >= 90 ? "success" : "warning"}
                    description="Across all states"
                    subtitle="Target: 95%"
                />
                <KPICard
                    title="Top State"
                    value={topCountry?.country || "N/A"}
                    badge="#1"
                    badgeVariant="default"
                    description="Highest volume"
                    subtitle={`${formatIndianNumber(topCountry?.verifications || 0)} verifications`}
                />
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="countries">States</TabsTrigger>
                    <TabsTrigger value="regions">Zones</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    {/* India Map Section */}
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>India Verification Heatmap</CardTitle>
                            <CardDescription>Real-time state-wise distribution of identity verifications</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 relative">
                            <IndiaMapMapcn data={filteredStats.map(s => ({ state: s.country, verifications: s.verifications, successRate: s.successRate }))} />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Top Countries Bar Chart */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Top States by Verifications</CardTitle>
                                <CardDescription>Top 8 performing states</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <BarChart data={barChartData} layout="vertical" barCategoryGap="16%">
                                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" className="text-xs" tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="country"
                                            type="category"
                                            className="text-xs"
                                            width={90}
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.length > 10 ? value.slice(0, 10) + '...' : value}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="verifications" fill="var(--color-verifications)" radius={[0, 4, 4, 0]} maxBarSize={24} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Regional Distribution */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Zone-wise Distribution</CardTitle>
                                <CardDescription>Verifications by zone</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {regionData.map((region) => {
                                        const percentage = (region.verifications / totalVerifications) * 100;
                                        return (
                                            <div key={region.region} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="h-3 w-3 rounded-full"
                                                            style={{ backgroundColor: ZONE_COLORS[region.region as keyof typeof ZONE_COLORS] || "#6b7280" }}
                                                        />
                                                        <span className="text-sm font-medium">{region.region}</span>
                                                    </div>
                                                    <span className="text-sm text-muted-foreground">
                                                        {region.verifications.toLocaleString()} ({percentage.toFixed(1)}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${percentage}%`,
                                                            backgroundColor: ZONE_COLORS[region.region as keyof typeof ZONE_COLORS] || "#6b7280"
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Countries Tab */}
                <TabsContent value="countries" className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredStats
                            .sort((a, b) => b.verifications - a.verifications)
                            .map((stat, index) => (
                            <div
                                key={stat.country}
                                className="group relative rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-primary/20"
                            >
                                {/* Rank Badge */}
                                <div className="absolute -top-2 -left-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
                                    {index + 1}
                                </div>

                                {/* Header */}
                                <div className="flex items-start justify-between mb-4 pt-1">
                                    <div className="space-y-1">
                                        <h3 className="font-semibold leading-none tracking-tight">
                                            {stat.country}
                                        </h3>
                                        <div className="flex items-center gap-1.5">
                                            <div
                                                className="h-2 w-2 rounded-full"
                                                style={{ backgroundColor: ZONE_COLORS[stat.region as keyof typeof ZONE_COLORS] || "#6b7280" }}
                                            />
                                            <span className="text-xs text-muted-foreground">{stat.region}</span>
                                        </div>
                                    </div>
                                    <div className={`text-right ${stat.successRate >= 90 ? "text-emerald-500" : stat.successRate >= 85 ? "text-amber-500" : "text-red-500"}`}>
                                        <p className="text-2xl font-bold tabular-nums">{stat.successRate}%</p>
                                        <p className="text-[10px] uppercase tracking-wider opacity-70">Success</p>
                                    </div>
                                </div>

                                {/* Stats Row */}
                                <div className="flex items-center justify-between border-t pt-3">
                                    <div>
                                        <p className="text-lg font-semibold tabular-nums">{stat.verifications.toLocaleString()}</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Verifications</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium tabular-nums">{Math.round(stat.avgTime / 60)}m</p>
                                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Avg Time</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                {/* Regions Tab */}
                <TabsContent value="regions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Zone Statistics</CardTitle>
                            <CardDescription>Detailed breakdown by state</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Zone</TableHead>
                                        <TableHead>State</TableHead>
                                        <TableHead className="text-right">Verifications</TableHead>
                                        <TableHead className="text-right">Success Rate</TableHead>
                                        <TableHead className="text-right">Avg. Time</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStats.map((stat) => (
                                        <TableRow key={stat.country}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: ZONE_COLORS[stat.region as keyof typeof ZONE_COLORS] || "#6b7280" }}
                                                    />
                                                    <span>{stat.region}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium">{stat.country}</TableCell>
                                            <TableCell className="text-right">{stat.verifications.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={stat.successRate >= 90 ? "text-green-500" : stat.successRate >= 85 ? "text-yellow-500" : "text-red-500"}>
                                                    {stat.successRate}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">{Math.round(stat.avgTime / 60)} min</TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={stat.successRate >= 90 ? "default" : stat.successRate >= 85 ? "secondary" : "destructive"}
                                                    className={stat.successRate >= 90 ? "bg-green-500/10 text-green-500" : ""}
                                                >
                                                    {stat.successRate >= 90 ? "Excellent" : stat.successRate >= 85 ? "Good" : "Needs Attention"}
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
