"use client";

import * as React from "react";
import {
    MapPin,
    TrendingUp,
    TrendingDown,
    Globe,
    Users,
    Clock,
    CheckCircle,
    BarChart3,
} from "lucide-react";

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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from "recharts";

import { regionalStats } from "@/lib/mock-data";
import { WorldMap } from "@/components/world-map";

const chartConfig = {
    verifications: {
        label: "Verifications",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const REGION_COLORS = {
    "Asia": "#8b5cf6",
    "Europe": "#3b82f6",
    "North America": "#22c55e",
    "South America": "#f59e0b",
    "Africa": "#ef4444",
    "Oceania": "#06b6d4",
};

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
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Location Analytics</h1>
                    <p className="text-muted-foreground">
                        Geographic distribution of KYC verifications.
                    </p>
                </div>
                <Select value={regionFilter} onValueChange={setRegionFilter}>
                    <SelectTrigger className="w-40">
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
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                        <Globe className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{totalVerifications.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-green-500">+12.5%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Countries Active</CardTitle>
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{filteredStats.length}</p>
                        <p className="text-xs text-muted-foreground">
                            Across {regions.length} regions
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Success Rate</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{avgSuccessRate.toFixed(1)}%</p>
                        <Progress value={avgSuccessRate} className="mt-2 h-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Country</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{topCountry?.country}</p>
                        <p className="text-xs text-muted-foreground">
                            {topCountry?.verifications.toLocaleString()} verifications
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="countries">Countries</TabsTrigger>
                    <TabsTrigger value="regions">Regions</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4">
                    {/* World Map Section */}
                    <Card className="overflow-hidden">
                        <CardHeader>
                            <CardTitle>Global Verification Heatmap</CardTitle>
                            <CardDescription>Real-time geographic distribution of identity verifications</CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                            <WorldMap data={filteredStats} />
                        </CardContent>
                    </Card>

                    <div className="grid gap-4 lg:grid-cols-2">
                        {/* Top Countries Bar Chart */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Top Countries by Verifications</CardTitle>
                                <CardDescription>Top 8 performing countries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <BarChart data={barChartData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" className="text-xs" />
                                        <YAxis
                                            dataKey="country"
                                            type="category"
                                            className="text-xs"
                                            width={100}
                                            tickFormatter={(value) => value.length > 12 ? value.slice(0, 12) + '...' : value}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="verifications" fill="var(--color-verifications)" radius={4} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        {/* Regional Distribution */}
                        <Card className="lg:col-span-1">
                            <CardHeader>
                                <CardTitle>Regional Distribution</CardTitle>
                                <CardDescription>Verifications by region</CardDescription>
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
                                                            style={{ backgroundColor: REGION_COLORS[region.region as keyof typeof REGION_COLORS] || "#6b7280" }}
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
                                                            backgroundColor: REGION_COLORS[region.region as keyof typeof REGION_COLORS] || "#6b7280"
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
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredStats.map((stat) => (
                            <Card key={stat.country} className="relative overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 right-0 h-1"
                                    style={{ backgroundColor: REGION_COLORS[stat.region as keyof typeof REGION_COLORS] || "#6b7280" }}
                                />
                                <CardHeader className="pb-2">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{stat.country}</CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {stat.region}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Verifications</p>
                                            <p className="text-xl font-bold">{stat.verifications.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-muted-foreground">Success Rate</p>
                                            <p className={`text-xl font-bold ${stat.successRate >= 90 ? "text-green-500" : stat.successRate >= 85 ? "text-yellow-500" : "text-red-500"}`}>
                                                {stat.successRate}%
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        <span>Avg. {Math.round(stat.avgTime / 60)} min per verification</span>
                                    </div>
                                    <Progress
                                        value={stat.successRate}
                                        className="h-1"
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Regions Tab */}
                <TabsContent value="regions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Regional Statistics</CardTitle>
                            <CardDescription>Detailed breakdown by country</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Region</TableHead>
                                        <TableHead>Country</TableHead>
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
                                                        style={{ backgroundColor: REGION_COLORS[stat.region as keyof typeof REGION_COLORS] || "#6b7280" }}
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
