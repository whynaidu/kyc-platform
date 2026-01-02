"use client";

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

import {
    onboardingFunnel,
    getOnboardingKPIs,
    getOnboardingDailyMetrics,
    getTimePerStep,
    getCompletionTimeDistribution,
} from "@/lib/mock-data";

const chartConfig = {
    started: {
        label: "Started",
        color: "var(--chart-1)",
    },
    completed: {
        label: "Completed",
        color: "var(--chart-2)",
    },
    avgTime: {
        label: "Avg Time (min)",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

const STEP_COLORS = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "#22c55e",
];

export default function OnboardingDashboardPage() {
    const [timeRange, setTimeRange] = React.useState<string>("30days");

    const kpis = getOnboardingKPIs();
    const dailyMetrics = getOnboardingDailyMetrics(timeRange === "7days" ? 7 : timeRange === "14days" ? 14 : 30);
    const timePerStep = getTimePerStep();
    const completionDistribution = getCompletionTimeDistribution();

    // Funnel data for visualization
    const funnelData = onboardingFunnel.map((step, index) => ({
        step: step.label,
        started: step.started,
        completed: step.completed,
        dropoffs: step.dropoffs,
        dropoffRate: ((step.dropoffs / step.started) * 100).toFixed(1),
        fill: STEP_COLORS[index],
    }));

    const totalStarted = onboardingFunnel[0].started;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Onboarding Analytics</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Conversion funnel and completion metrics.
                    </p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="14days">Last 14 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Started"
                    value={kpis.totalStarted.value}
                    badge={`+${kpis.totalStarted.changePercentage}%`}
                    badgeVariant="success"
                    trend="up"
                    description="New onboarding sessions"
                    subtitle="This month"
                />
                <KPICard
                    title="Conversion Rate"
                    value={kpis.conversionRate.value}
                    suffix="%"
                    badge={`+${kpis.conversionRate.changePercentage}%`}
                    badgeVariant="success"
                    trend="up"
                    description="End-to-end completion"
                    subtitle="Target: 65%"
                />
                <KPICard
                    title="Avg Completion Time"
                    value={kpis.avgCompletionTime.value}
                    suffix=" min"
                    badge={`${kpis.avgCompletionTime.changePercentage}%`}
                    badgeVariant="success"
                    trend="down"
                    description="Getting faster"
                    subtitle="Target: 20 min"
                />
                <KPICard
                    title="Drop-off Rate"
                    value={kpis.dropoffRate.value}
                    suffix="%"
                    badge={`${kpis.dropoffRate.changePercentage}%`}
                    badgeVariant="success"
                    trend="down"
                    description="Users who didn't complete"
                    subtitle="Improving"
                />
            </div>

            <Tabs defaultValue="funnel" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="funnel">Funnel</TabsTrigger>
                    <TabsTrigger value="time">Time Metrics</TabsTrigger>
                    <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>

                {/* Funnel Tab */}
                <TabsContent value="funnel" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Conversion Funnel</CardTitle>
                            <CardDescription>User progression through onboarding steps</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {funnelData.map((step, index) => {
                                    const widthPercent = (step.started / totalStarted) * 100;
                                    const completedPercent = (step.completed / totalStarted) * 100;
                                    return (
                                        <div key={step.step} className="space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: step.fill }}
                                                    />
                                                    <span className="font-medium">{index + 1}. {step.step}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-muted-foreground">
                                                    <span>{step.started.toLocaleString()} started</span>
                                                    <span>{step.completed.toLocaleString()} completed</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {step.dropoffRate}% drop-off
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="relative h-8 rounded-lg bg-muted overflow-hidden">
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-lg transition-all"
                                                    style={{
                                                        width: `${widthPercent}%`,
                                                        backgroundColor: step.fill,
                                                        opacity: 0.3,
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-y-0 left-0 rounded-lg transition-all"
                                                    style={{
                                                        width: `${completedPercent}%`,
                                                        backgroundColor: step.fill,
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center px-3">
                                                    <span className="text-xs font-medium text-white drop-shadow">
                                                        {((step.completed / totalStarted) * 100).toFixed(1)}% of total
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 pt-4 border-t">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Overall Conversion</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl font-bold text-green-500">
                                            {((onboardingFunnel[onboardingFunnel.length - 1].completed / totalStarted) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                            ({onboardingFunnel[onboardingFunnel.length - 1].completed.toLocaleString()} of {totalStarted.toLocaleString()})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Time Metrics Tab */}
                <TabsContent value="time" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Time per Step</CardTitle>
                                <CardDescription>Average completion time by step</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <BarChart data={timePerStep} layout="vertical" barCategoryGap="16%">
                                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="step"
                                            type="category"
                                            width={120}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="avgTime" fill="var(--color-avgTime)" radius={[0, 4, 4, 0]} maxBarSize={24} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Completion Time Distribution</CardTitle>
                                <CardDescription>How long users take to complete onboarding</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                    <BarChart data={completionDistribution} barCategoryGap="16%">
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis
                                            dataKey="range"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 10 }}
                                        />
                                        <YAxis tickLine={false} axisLine={false} width={40} />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Trends Tab */}
                <TabsContent value="trends" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Onboarding Trends</CardTitle>
                            <CardDescription>Started vs completed over time</CardDescription>
                        </CardHeader>
                        <CardContent className="px-2 sm:px-6">
                            <ChartContainer config={chartConfig} className="h-[300px] w-full">
                                <AreaChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="startedGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.05} />
                                        </linearGradient>
                                        <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.4} />
                                            <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.05} />
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
                                    <Area
                                        type="monotone"
                                        dataKey="started"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2}
                                        fill="url(#startedGradient)"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="var(--chart-2)"
                                        strokeWidth={2}
                                        fill="url(#completedGradient)"
                                    />
                                </AreaChart>
                            </ChartContainer>
                            <div className="mt-4 flex justify-center gap-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--chart-1)" }} />
                                    <span className="text-muted-foreground">Started</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--chart-2)" }} />
                                    <span className="text-muted-foreground">Completed</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
