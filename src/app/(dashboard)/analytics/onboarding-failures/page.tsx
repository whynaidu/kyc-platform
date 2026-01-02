"use client";

import * as React from "react";
import { TrendingDown, Clock, Users, ArrowRight } from "lucide-react";

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
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Area, AreaChart } from "recharts";

import {
    onboardingStepFailures,
    dropoffTimingByStep,
    getOnboardingFailureKPIs,
    getDropoffTrends,
    getRecoveryRates,
} from "@/lib/mock-data";

const chartConfig = {
    dropoffs: {
        label: "Drop-offs",
        color: "var(--destructive)",
    },
    recovered: {
        label: "Recovered",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

const STEP_COLORS = {
    mobile: "var(--chart-1)",
    identity: "var(--chart-2)",
    video_kyc: "var(--chart-3)",
    address: "var(--chart-4)",
    bank: "var(--chart-5)",
    review: "#22c55e",
};

export default function OnboardingFailuresPage() {
    const [stepFilter, setStepFilter] = React.useState<string>("all");

    const kpis = getOnboardingFailureKPIs();
    const trends = getDropoffTrends(14);
    const recoveryRates = getRecoveryRates();

    const filteredStepFailures = React.useMemo(() => {
        if (stepFilter === "all") return onboardingStepFailures;
        return onboardingStepFailures.filter(s => s.step === stepFilter);
    }, [stepFilter]);

    // Drop-off rate bar data
    const dropoffRateData = onboardingStepFailures.map(s => ({
        step: s.label,
        dropoffRate: s.dropoffRate,
        dropoffs: s.dropoffs,
        fill: STEP_COLORS[s.step as keyof typeof STEP_COLORS],
    }));

    // Recovery data for chart
    const recoveryData = recoveryRates.map(r => ({
        step: onboardingStepFailures.find(s => s.step === r.step)?.label || r.step,
        dropoffs: r.dropoffs,
        recovered: r.recovered,
        rate: r.rate,
    }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Onboarding Drop-off Analytics</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">
                        Understand where and why users abandon onboarding.
                    </p>
                </div>
                <Select value={stepFilter} onValueChange={setStepFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter by Step" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Steps</SelectItem>
                        <SelectItem value="mobile">Mobile & Email</SelectItem>
                        <SelectItem value="identity">Identity</SelectItem>
                        <SelectItem value="video_kyc">Video KYC</SelectItem>
                        <SelectItem value="address">Address</SelectItem>
                        <SelectItem value="bank">Bank</SelectItem>
                        <SelectItem value="review">Review</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
                <KPICard
                    title="Total Drop-offs"
                    value={kpis.totalDropoffs.value}
                    badge={`${kpis.totalDropoffs.changePercentage}%`}
                    badgeVariant="success"
                    trend="down"
                    description="Users who didn't complete"
                    subtitle="This month"
                />
                <KPICard
                    title="Highest Drop-off"
                    value={kpis.highestDropoffStep.step}
                    badge={`${kpis.highestDropoffStep.rate}%`}
                    badgeVariant="danger"
                    description="Most problematic step"
                    subtitle="Needs attention"
                />
                <KPICard
                    title="Avg Time Before Drop"
                    value={kpis.avgDropoffTime.value}
                    suffix=" min"
                    badge={`${kpis.avgDropoffTime.changePercentage}%`}
                    badgeVariant="success"
                    trend="down"
                    description="Time spent before leaving"
                    subtitle="Getting shorter"
                />
                <KPICard
                    title="Recovery Rate"
                    value={kpis.recoveryRate.value}
                    suffix="%"
                    badge={`+${kpis.recoveryRate.changePercentage}%`}
                    badgeVariant="success"
                    trend="up"
                    description="Users who return"
                    subtitle="Improving"
                />
            </div>

            <Tabs defaultValue="by-step" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="by-step">By Step</TabsTrigger>
                    <TabsTrigger value="reasons">Reasons</TabsTrigger>
                    <TabsTrigger value="timing">Timing</TabsTrigger>
                    <TabsTrigger value="patterns">Patterns</TabsTrigger>
                </TabsList>

                {/* By Step Tab */}
                <TabsContent value="by-step" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Drop-off Rate by Step</CardTitle>
                                <CardDescription>Which steps lose the most users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                    <BarChart data={dropoffRateData} layout="vertical" barCategoryGap="16%">
                                        <CartesianGrid horizontal={false} strokeDasharray="3 3" className="stroke-muted" />
                                        <XAxis type="number" domain={[0, 20]} tickLine={false} axisLine={false} />
                                        <YAxis
                                            dataKey="step"
                                            type="category"
                                            width={110}
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fontSize: 11 }}
                                        />
                                        <ChartTooltip content={<ChartTooltipContent />} />
                                        <Bar dataKey="dropoffRate" fill="var(--destructive)" radius={[0, 4, 4, 0]} maxBarSize={24} />
                                    </BarChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Drop-off Trends</CardTitle>
                                <CardDescription>Daily drop-offs by step (last 14 days)</CardDescription>
                            </CardHeader>
                            <CardContent className="px-2 sm:px-6">
                                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                    <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="dropoffsGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--destructive)" stopOpacity={0.4} />
                                                <stop offset="100%" stopColor="var(--destructive)" stopOpacity={0.05} />
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
                                            dataKey="video_kyc"
                                            stackId="1"
                                            stroke="var(--chart-3)"
                                            fill="var(--chart-3)"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="identity"
                                            stackId="1"
                                            stroke="var(--chart-2)"
                                            fill="var(--chart-2)"
                                            fillOpacity={0.6}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="mobile"
                                            stackId="1"
                                            stroke="var(--chart-1)"
                                            fill="var(--chart-1)"
                                            fillOpacity={0.6}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Step Drop-off Details</CardTitle>
                            <CardDescription>Detailed breakdown by onboarding step</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Step</TableHead>
                                        <TableHead className="text-right">Drop-offs</TableHead>
                                        <TableHead className="text-right">Rate</TableHead>
                                        <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStepFailures.map((step) => (
                                        <TableRow key={step.step}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-3 w-3 rounded-full"
                                                        style={{ backgroundColor: STEP_COLORS[step.step as keyof typeof STEP_COLORS] }}
                                                    />
                                                    <span className="font-medium">{step.label}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">{step.dropoffs.toLocaleString()}</TableCell>
                                            <TableCell className="text-right">
                                                <span className={step.dropoffRate > 10 ? "text-red-500" : step.dropoffRate > 6 ? "text-yellow-500" : "text-green-500"}>
                                                    {step.dropoffRate}%
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Badge
                                                    variant={step.dropoffRate > 10 ? "destructive" : "default"}
                                                    className={step.dropoffRate <= 6 ? "bg-green-500/10 text-green-500" : ""}
                                                >
                                                    {step.dropoffRate > 10 ? "Critical" : step.dropoffRate > 6 ? "Warning" : "Healthy"}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Reasons Tab */}
                <TabsContent value="reasons" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredStepFailures.map((step) => (
                            <Card key={step.step}>
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base">{step.label}</CardTitle>
                                        <Badge variant="outline">{step.dropoffRate}% drop-off</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {step.topReasons.map((reason, idx) => (
                                            <div key={idx} className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-muted-foreground truncate pr-2">{reason.reason}</span>
                                                    <span className="font-medium shrink-0">{reason.percentage}%</span>
                                                </div>
                                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${reason.percentage}%`,
                                                            backgroundColor: STEP_COLORS[step.step as keyof typeof STEP_COLORS]
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                {/* Timing Tab */}
                <TabsContent value="timing" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredStepFailures.map((step) => {
                            const timingData = dropoffTimingByStep[step.step] || [];
                            return (
                                <Card key={step.step}>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-base">{step.label}</CardTitle>
                                        <CardDescription>Time before drop-off</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-3">
                                            {timingData.map((timing, idx) => (
                                                <div key={idx} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                                        <span className="text-sm">{timing.timeRange}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium">{timing.count}</span>
                                                        <Badge variant="outline" className="text-xs">
                                                            {timing.percentage}%
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </TabsContent>

                {/* Patterns Tab */}
                <TabsContent value="patterns" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>User Journey Flow</CardTitle>
                            <CardDescription>How users move through onboarding</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {onboardingStepFailures.map((step, index) => {
                                    const nextStep = onboardingStepFailures[index + 1];
                                    const recovery = recoveryRates.find(r => r.step === step.step);

                                    return (
                                        <div key={step.step} className="relative">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="flex h-10 w-10 items-center justify-center rounded-full text-white font-medium"
                                                    style={{ backgroundColor: STEP_COLORS[step.step as keyof typeof STEP_COLORS] }}
                                                >
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium">{step.label}</span>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-muted-foreground">
                                                                <TrendingDown className="h-4 w-4 inline mr-1 text-red-500" />
                                                                {step.dropoffs} dropped
                                                            </span>
                                                            {recovery && (
                                                                <span className="text-green-500">
                                                                    <Users className="h-4 w-4 inline mr-1" />
                                                                    {recovery.recovered} returned ({recovery.rate}%)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="h-2 mt-2 rounded-full bg-muted overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all"
                                                            style={{
                                                                width: `${100 - step.dropoffRate}%`,
                                                                backgroundColor: STEP_COLORS[step.step as keyof typeof STEP_COLORS]
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            {nextStep && (
                                                <div className="ml-5 py-2">
                                                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recovery Analysis</CardTitle>
                            <CardDescription>Users who return after dropping off</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className="h-[280px] w-full">
                                <BarChart data={recoveryData} barCategoryGap="16%">
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted" />
                                    <XAxis
                                        dataKey="step"
                                        tickLine={false}
                                        axisLine={false}
                                        tick={{ fontSize: 10 }}
                                    />
                                    <YAxis tickLine={false} axisLine={false} width={40} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="dropoffs" fill="var(--destructive)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                    <Bar dataKey="recovered" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={30} />
                                </BarChart>
                            </ChartContainer>
                            <div className="mt-4 flex justify-center gap-6">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-3 w-3 rounded-full bg-destructive" />
                                    <span className="text-muted-foreground">Drop-offs</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: "var(--chart-2)" }} />
                                    <span className="text-muted-foreground">Recovered</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
