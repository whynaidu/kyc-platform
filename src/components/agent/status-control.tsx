"use client";

import * as React from "react";
import {
    Circle,
    Coffee,
    LogOut,
    Phone,
    ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

export type AgentStatus = "online" | "in_call" | "break" | "offline";

interface StatusOption {
    value: AgentStatus;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    bgColor: string;
}

const statusOptions: StatusOption[] = [
    {
        value: "online",
        label: "Online",
        description: "Ready to receive calls",
        icon: Circle,
        color: "text-green-500",
        bgColor: "bg-green-500",
    },
    {
        value: "break",
        label: "On Break",
        description: "Taking a short break",
        icon: Coffee,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500",
    },
    {
        value: "offline",
        label: "Offline",
        description: "Not available for calls",
        icon: LogOut,
        color: "text-gray-500",
        bgColor: "bg-gray-500",
    },
];

// In-call status is system-controlled, not user-selectable
const inCallStatus: StatusOption = {
    value: "in_call",
    label: "In Call",
    description: "Currently on a video call",
    icon: Phone,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
};

interface AgentStatusControlProps {
    initialStatus?: AgentStatus;
    onStatusChange?: (status: AgentStatus) => void;
    className?: string;
}

export function AgentStatusControl({
    initialStatus = "offline",
    onStatusChange,
    className,
}: AgentStatusControlProps) {
    const [status, setStatus] = React.useState<AgentStatus>(initialStatus);
    const [showOfflineDialog, setShowOfflineDialog] = React.useState(false);
    const [pendingStatus, setPendingStatus] = React.useState<AgentStatus | null>(null);

    const currentStatusOption = status === "in_call"
        ? inCallStatus
        : statusOptions.find(s => s.value === status) || statusOptions[0];

    const handleStatusChange = (newStatus: AgentStatus) => {
        // If going offline, show confirmation
        if (newStatus === "offline" && status !== "offline") {
            setPendingStatus(newStatus);
            setShowOfflineDialog(true);
            return;
        }

        // If currently in a call, prevent status change
        if (status === "in_call") {
            toast.error("Cannot change status", {
                description: "Please end the current call first.",
            });
            return;
        }

        applyStatusChange(newStatus);
    };

    const applyStatusChange = (newStatus: AgentStatus) => {
        setStatus(newStatus);
        onStatusChange?.(newStatus);

        const statusInfo = statusOptions.find(s => s.value === newStatus);
        if (statusInfo) {
            toast.success(`Status changed to ${statusInfo.label}`, {
                description: statusInfo.description,
            });
        }
    };

    const confirmOffline = () => {
        if (pendingStatus) {
            applyStatusChange(pendingStatus);
        }
        setShowOfflineDialog(false);
        setPendingStatus(null);
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            "justify-between gap-2 min-w-[160px]",
                            status === "in_call" && "cursor-not-allowed",
                            className
                        )}
                        disabled={status === "in_call"}
                    >
                        <div className="flex items-center gap-2">
                            <span className={cn("h-2.5 w-2.5 rounded-full", currentStatusOption.bgColor)} />
                            <span className="font-medium">{currentStatusOption.label}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Set Your Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {statusOptions.map((option) => {
                        const isActive = status === option.value;
                        return (
                            <DropdownMenuItem
                                key={option.value}
                                onClick={() => handleStatusChange(option.value)}
                                className={cn(
                                    "flex items-center gap-3 cursor-pointer",
                                    isActive && "bg-accent"
                                )}
                            >
                                <span className={cn("h-2.5 w-2.5 rounded-full", option.bgColor)} />
                                <div className="flex-1">
                                    <p className="font-medium">{option.label}</p>
                                    <p className="text-xs text-muted-foreground">{option.description}</p>
                                </div>
                                {isActive && (
                                    <Circle className="h-3 w-3 fill-primary text-primary" />
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Offline Confirmation Dialog */}
            <AlertDialog open={showOfflineDialog} onOpenChange={setShowOfflineDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Go Offline?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will stop receiving new verification requests. Any customers in your queue will be reassigned to other agents.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setPendingStatus(null)}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmOffline}>
                            Go Offline
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

// Compact version for header/sidebar
export function AgentStatusBadge({
    status,
    showLabel = true,
    className,
}: {
    status: AgentStatus;
    showLabel?: boolean;
    className?: string;
}) {
    const statusOption = status === "in_call"
        ? inCallStatus
        : statusOptions.find(s => s.value === status) || statusOptions[0];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <span className={cn(
                "h-2.5 w-2.5 rounded-full",
                statusOption.bgColor,
                status === "online" && "animate-pulse"
            )} />
            {showLabel && (
                <span className={cn("text-sm font-medium", statusOption.color)}>
                    {statusOption.label}
                </span>
            )}
        </div>
    );
}
