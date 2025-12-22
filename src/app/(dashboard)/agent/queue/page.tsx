"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowUpDown,
    Play,
    Eye,
    FileText,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { AgentStatusControl, AgentStatus } from "@/components/agent/status-control";
import { mockQueueItems } from "@/lib/mock-data";
import { QueueItem, Priority } from "@/types";

function getPriorityBadge(priority: Priority) {
    switch (priority) {
        case "high":
            return <Badge variant="destructive">High</Badge>;
        case "medium":
            return <Badge>Medium</Badge>;
        default:
            return <Badge variant="secondary">Normal</Badge>;
    }
}

export default function AgentQueuePage() {
    const router = useRouter();
    const [queue] = React.useState<QueueItem[]>(mockQueueItems);
    const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
    const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
    const [agentStatus, setAgentStatus] = React.useState<AgentStatus>("offline");

    React.useEffect(() => {
        // Load saved status from localStorage
        const savedStatus = localStorage.getItem("agent_status") as AgentStatus;
        if (savedStatus) {
            setAgentStatus(savedStatus);
        }
    }, []);

    const handleStatusChange = (newStatus: AgentStatus) => {
        setAgentStatus(newStatus);
        localStorage.setItem("agent_status", newStatus);
    };

    const filteredQueue = React.useMemo(() => {
        let filtered = [...queue];

        if (priorityFilter !== "all") {
            filtered = filtered.filter(item => item.priority === priorityFilter);
        }

        // Sort by priority (high > medium > normal)
        const priorityOrder = { high: 3, medium: 2, normal: 1 };
        filtered.sort((a, b) => {
            const orderA = priorityOrder[a.priority];
            const orderB = priorityOrder[b.priority];
            return sortOrder === "desc" ? orderB - orderA : orderA - orderB;
        });

        return filtered;
    }, [queue, priorityFilter, sortOrder]);

    const startSession = (item: QueueItem) => {
        // Check if agent is online
        if (agentStatus !== "online") {
            toast.warning("You must be online", {
                description: "Please set your status to Online before starting a session.",
            });
            return;
        }

        toast.success("Session started", {
            description: `Starting verification session with ${item.user.name}`,
        });
        // Set status to in_call when starting session
        setAgentStatus("in_call");
        localStorage.setItem("agent_status", "in_call");
        router.push("/agent/video-session");
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Verification Queue</h1>
                    <p className="text-muted-foreground">
                        Manage and process pending KYC verification requests.
                    </p>
                </div>
                <AgentStatusControl
                    initialStatus={agentStatus}
                    onStatusChange={handleStatusChange}
                />
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Pending Verifications</CardTitle>
                            <CardDescription>{filteredQueue.length} items in queue</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="normal">Normal</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
                            >
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Priority</TableHead>
                                <TableHead>Customer Name</TableHead>
                                <TableHead>KYC Type</TableHead>
                                <TableHead>Wait Time</TableHead>
                                <TableHead>Documents</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredQueue.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{getPriorityBadge(item.priority)}</TableCell>
                                    <TableCell className="font-medium">{item.user.name}</TableCell>
                                    <TableCell className="capitalize">{item.kycType.replace("_", " ")}</TableCell>
                                    <TableCell>
                                        <span className={item.waitTime > 15 ? "text-red-500" : "text-muted-foreground"}>
                                            {item.waitTime} min
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{item.documents.length}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" onClick={() => startSession(item)}>
                                                <Play className="h-4 w-4 mr-1" />
                                                Start
                                            </Button>
                                        </div>
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
