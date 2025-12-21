"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    PhoneOff,
    ZoomIn,
    ZoomOut,
    RotateCw,
    CheckSquare,
    MessageSquare,
    User,
    FileText,
    AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const verificationChecklist = [
    { id: "doc-valid", label: "Identity document is valid and not expired" },
    { id: "face-match", label: "Face matches document photo" },
    { id: "address-verified", label: "Address has been verified" },
    { id: "dob-confirmed", label: "Date of birth confirmed" },
    { id: "security-passed", label: "Security questions passed" },
];

const rejectionReasons = [
    "Document expired",
    "Face does not match document",
    "Suspicious activity detected",
    "Poor image quality",
    "Unable to verify information",
    "User unresponsive",
    "Other",
];

export default function VideoSessionPage() {
    const router = useRouter();
    const [isMuted, setIsMuted] = React.useState(false);
    const [isVideoOff, setIsVideoOff] = React.useState(false);
    const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});
    const [agentNotes, setAgentNotes] = React.useState("");
    const [showRejectDialog, setShowRejectDialog] = React.useState(false);
    const [rejectionReason, setRejectionReason] = React.useState("");
    const [rejectionComment, setRejectionComment] = React.useState("");
    const [zoom, setZoom] = React.useState(1);
    const [rotation, setRotation] = React.useState(0);

    const toggleCheck = (id: string) => {
        setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const allChecked = verificationChecklist.every(item => checkedItems[item.id]);

    const handleApprove = () => {
        if (!allChecked) {
            toast.warning("Incomplete checklist", {
                description: "Please complete all verification items before approving.",
            });
            return;
        }
        toast.success("KYC Approved", {
            description: "The customer's KYC verification has been approved.",
        });
        router.push("/agent/queue");
    };

    const handleReject = () => {
        if (!rejectionReason) {
            toast.error("Please select a rejection reason");
            return;
        }
        toast.error("KYC Rejected", {
            description: `Reason: ${rejectionReason}`,
        });
        setShowRejectDialog(false);
        router.push("/agent/queue");
    };

    const handleEscalate = () => {
        toast.info("Escalated for Review", {
            description: "This case has been escalated to a senior agent.",
        });
        router.push("/agent/queue");
    };

    return (
        <div className="flex flex-col lg:flex-row gap-4 pb-4">
            {/* Left Panel - Customer Video & Documents */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {/* Customer Video */}
                <Card className="flex-1 min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
                    <CardContent className="p-0 h-full">
                        <div className="relative h-full min-h-[280px] sm:min-h-[330px] lg:min-h-[380px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                                <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                    <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
                                </div>
                                <p className="text-white text-base sm:text-lg font-medium">John Garcia</p>
                                <p className="text-gray-400 text-xs sm:text-sm">Customer</p>
                            </div>

                            {/* Recording Badge */}
                            <Badge variant="destructive" className="absolute top-3 left-3 sm:top-4 sm:left-4 animate-pulse text-xs">
                                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white mr-1.5 sm:mr-2" />
                                Recording
                            </Badge>

                            {/* Controls */}
                            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                <Button
                                    variant={isMuted ? "destructive" : "secondary"}
                                    size="icon"
                                    className="h-9 w-9 sm:h-10 sm:w-10"
                                    onClick={() => setIsMuted(!isMuted)}
                                >
                                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant={isVideoOff ? "destructive" : "secondary"}
                                    size="icon"
                                    className="h-9 w-9 sm:h-10 sm:w-10"
                                    onClick={() => setIsVideoOff(!isVideoOff)}
                                >
                                    {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-9 w-9 sm:h-10 sm:w-10"
                                    onClick={() => router.push("/agent/queue")}
                                >
                                    <PhoneOff className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Document Viewer */}
                <Card className="h-48 sm:h-56 lg:h-64">
                    <CardHeader className="py-2 sm:py-3 px-3 sm:px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Document Viewer
                            </CardTitle>
                            <div className="flex gap-0.5 sm:gap-1">
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}>
                                    <ZoomOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setZoom(z => Math.min(2, z + 0.25))}>
                                    <ZoomIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={() => setRotation(r => (r + 90) % 360)}>
                                    <RotateCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-2 sm:p-3">
                        <div
                            className="h-full bg-muted rounded flex items-center justify-center overflow-hidden"
                            style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                        >
                            <div className="text-center text-muted-foreground">
                                <FileText className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-1 sm:mb-2" />
                                <p className="text-xs sm:text-sm">passport.jpg</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel - Customer Info & Verification */}
            <div className="w-full lg:w-80 xl:w-96 flex flex-col gap-3 sm:gap-4">
                {/* Customer Info */}
                <Card>
                    <CardHeader className="py-2 sm:py-3 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm">Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-6 pb-3 sm:pb-4">
                        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm">
                            <div className="text-muted-foreground">Name:</div>
                            <div className="font-medium">John Garcia</div>
                            <div className="text-muted-foreground">DOB:</div>
                            <div className="font-medium">Jan 15, 1990</div>
                            <div className="text-muted-foreground">ID Number:</div>
                            <div className="font-medium">AB1234567</div>
                            <div className="text-muted-foreground">Address:</div>
                            <div className="font-medium">123 Main St, City</div>
                        </div>
                    </CardContent>
                </Card>

                {/* Verification Checklist */}
                <Card>
                    <CardHeader className="py-2 sm:py-3 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                            <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Verification Checklist
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                        <ScrollArea className="h-32 sm:h-36 lg:h-40">
                            <div className="space-y-2.5 sm:space-y-3">
                                {verificationChecklist.map((item) => (
                                    <div key={item.id} className="flex items-start space-x-2">
                                        <Checkbox
                                            id={item.id}
                                            checked={checkedItems[item.id] || false}
                                            onCheckedChange={() => toggleCheck(item.id)}
                                            className="mt-0.5"
                                        />
                                        <Label htmlFor={item.id} className="text-xs sm:text-sm cursor-pointer leading-tight">
                                            {item.label}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </CardContent>
                </Card>

                {/* Agent Notes */}
                <Card>
                    <CardHeader className="py-2 sm:py-3 px-3 sm:px-6">
                        <CardTitle className="text-xs sm:text-sm flex items-center gap-1.5 sm:gap-2">
                            <MessageSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            Agent Notes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                        <Textarea
                            placeholder="Add notes about this verification..."
                            value={agentNotes}
                            onChange={(e) => setAgentNotes(e.target.value)}
                            className="h-16 sm:h-20 resize-none text-xs sm:text-sm"
                        />
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2">
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-sm"
                        onClick={handleApprove}
                        disabled={!allChecked}
                    >
                        Approve KYC
                    </Button>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="destructive"
                            className="text-xs sm:text-sm"
                            onClick={() => setShowRejectDialog(true)}
                        >
                            Reject KYC
                        </Button>
                        <Button
                            variant="outline"
                            className="text-xs sm:text-sm"
                            onClick={handleEscalate}
                        >
                            <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" />
                            Escalate
                        </Button>
                    </div>
                </div>
            </div>

            {/* Rejection Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-base sm:text-lg">Reject KYC Verification</DialogTitle>
                        <DialogDescription className="text-xs sm:text-sm">
                            Please provide a reason for rejecting this verification.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs sm:text-sm">Rejection Reason</Label>
                            <Select value={rejectionReason} onValueChange={setRejectionReason}>
                                <SelectTrigger className="text-xs sm:text-sm">
                                    <SelectValue placeholder="Select a reason" />
                                </SelectTrigger>
                                <SelectContent>
                                    {rejectionReasons.map((reason) => (
                                        <SelectItem key={reason} value={reason} className="text-xs sm:text-sm">
                                            {reason}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs sm:text-sm">Additional Comments</Label>
                            <Textarea
                                placeholder="Add any additional comments..."
                                value={rejectionComment}
                                onChange={(e) => setRejectionComment(e.target.value)}
                                className="text-xs sm:text-sm"
                            />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="text-xs sm:text-sm">
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} className="text-xs sm:text-sm">
                            Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
