"use client";

import * as React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { dailyMetrics } from "@/lib/mock-data";

const chartConfig = {
    verifications: {
        label: "Verifications",
        color: "var(--primary)",
    },
    duration: {
        label: "Duration (min)",
        color: "var(--primary)",
    },
    approvalRate: {
        label: "Approval Rate (%)",
        color: "var(--primary)",
    },
} satisfies ChartConfig;

export default function AgentPerformancePage() {
    const [timeRange, setTimeRange] = React.useState("week");

    const getDaysCount = () => {
        switch (timeRange) {
            case "today": return 1;
            case "week": return 7;
            case "month": return 30;
            default: return 7;
        }
    };

    const data = dailyMetrics.slice(-getDaysCount()).map(m => ({
        date: m.date,
        verifications: m.totalVerifications,
        duration: Math.round(m.avgCompletionTime / 60),
        approvalRate: Math.round((m.successfulVerifications / m.totalVerifications) * 100),
    }));

    const stats = React.useMemo(() => {
        const totalVerifications = data.reduce((sum, d) => sum + d.verifications, 0);
        const avgDuration = Math.round(data.reduce((sum, d) => sum + d.duration, 0) / data.length);
        const avgApprovalRate = Math.round(data.reduce((sum, d) => sum + d.approvalRate, 0) / data.length);

        return { totalVerifications, avgDuration, avgApprovalRate };
    }, [data]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Performance</h1>
                    <p className="text-muted-foreground">
                        Track your verification performance metrics.
                    </p>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-40">
                        <SelectValue placeholder="Time range" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.totalVerifications}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Session Duration</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.avgDuration} min</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Avg. Approval Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-3xl font-bold">{stats.avgApprovalRate}%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-2">
                {/* Verifications Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Verifications Over Time</CardTitle>
                        <CardDescription>Daily verification count</CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
                            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    className="text-xs"
                                    tick={{ fontSize: 10 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis className="text-xs" tick={{ fontSize: 10 }} width={35} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Bar dataKey="verifications" fill="var(--color-verifications)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Duration Trend */}
                <Card>
                    <CardHeader>
                        <CardTitle>Session Duration Trend</CardTitle>
                        <CardDescription>Average session duration in minutes</CardDescription>
                    </CardHeader>
                    <CardContent className="px-2 sm:px-6">
                        <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
                            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                    className="text-xs"
                                    tick={{ fontSize: 10 }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis className="text-xs" tick={{ fontSize: 10 }} width={35} />
                                <ChartTooltip content={<ChartTooltipContent />} />
                                <Line type="monotone" dataKey="duration" stroke="var(--color-duration)" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Approval Rate Chart */}
            <Card>
                <CardHeader>
                    <CardTitle>Approval Rate Trend</CardTitle>
                    <CardDescription>Daily approval rate percentage</CardDescription>
                </CardHeader>
                <CardContent className="px-2 sm:px-6">
                    <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px] w-full">
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                className="text-xs"
                                tick={{ fontSize: 10 }}
                                interval="preserveStartEnd"
                            />
                            <YAxis domain={[0, 100]} className="text-xs" tick={{ fontSize: 10 }} width={35} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Line type="monotone" dataKey="approvalRate" stroke="var(--color-approvalRate)" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ChartContainer>
                </CardContent>
            </Card>

            {/* Detailed Stats Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Detailed Statistics</CardTitle>
                    <CardDescription>Performance metrics by day</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Verifications</TableHead>
                                <TableHead className="text-right">Avg. Duration</TableHead>
                                <TableHead className="text-right">Approval Rate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.date}>
                                    <TableCell className="font-medium">
                                        {new Date(row.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </TableCell>
                                    <TableCell className="text-right">{row.verifications}</TableCell>
                                    <TableCell className="text-right">{row.duration} min</TableCell>
                                    <TableCell className="text-right">{row.approvalRate}%</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
