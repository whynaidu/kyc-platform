"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    MoreHorizontal,
    Eye,
    Edit,
    MessageSquare,
    Ban,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockAgents } from "@/lib/mock-data";
import { AgentStatus } from "@/types";

function getStatusBadge(status: AgentStatus) {
    switch (status) {
        case "online":
            return <Badge className="bg-green-500/10 text-green-500">Online</Badge>;
        case "in_call":
            return <Badge className="bg-blue-500/10 text-blue-500">In Call</Badge>;
        case "break":
            return <Badge className="bg-yellow-500/10 text-yellow-500">Break</Badge>;
        default:
            return <Badge variant="secondary">Offline</Badge>;
    }
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
}

export default function AdminAgentsPage() {
    const router = useRouter();
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    const filteredAgents = React.useMemo(() => {
        if (statusFilter === "all") return mockAgents;
        return mockAgents.filter(agent => agent.status === statusFilter);
    }, [statusFilter]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">All Agents</h1>
                <p className="text-muted-foreground">
                    Manage and monitor all verification agents.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Agents</CardTitle>
                            <CardDescription>{filteredAgents.length} agents found</CardDescription>
                        </div>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="in_call">In Call</SelectItem>
                                <SelectItem value="break">On Break</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agent</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Today</TableHead>
                                <TableHead className="text-right">This Week</TableHead>
                                <TableHead className="text-right">Approval Rate</TableHead>
                                <TableHead className="text-right">Avg. Session</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAgents.map((agent) => (
                                <TableRow
                                    key={agent.id}
                                    className="cursor-pointer"
                                    onClick={() => router.push(`/admin/agents/${agent.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={agent.user.avatar} alt={agent.user.name} />
                                                <AvatarFallback>{agent.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{agent.user.name}</p>
                                                <p className="text-xs text-muted-foreground">{agent.user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(agent.status)}</TableCell>
                                    <TableCell className="text-right">{agent.todayVerifications}</TableCell>
                                    <TableCell className="text-right">{agent.weekVerifications}</TableCell>
                                    <TableCell className="text-right">{agent.approvalRate.toFixed(1)}%</TableCell>
                                    <TableCell className="text-right">{formatDuration(agent.avgSessionDuration)}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => {
                                                    e.stopPropagation();
                                                    router.push(`/admin/agents/${agent.id}`);
                                                }}>
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    View Details
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                                                    <MessageSquare className="mr-2 h-4 w-4" />
                                                    Message
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="text-destructive"
                                                >
                                                    <Ban className="mr-2 h-4 w-4" />
                                                    Disable
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
