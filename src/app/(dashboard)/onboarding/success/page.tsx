"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, Download, Home, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatIndianDateTime } from "@/lib/utils/indian-format";

export default function SuccessPage() {
    const [copied, setCopied] = React.useState(false);

    // Generate reference numbers
    const referenceNumber = `KYC${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    const ckycNumber = Math.floor(Math.random() * 90000000000000 + 10000000000000).toString();
    const ucicNumber = `UC${Math.floor(Math.random() * 900000000 + 100000000)}`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Clear onboarding data
    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            // Keep the data for reference but mark as complete
            localStorage.setItem('onboarding_completed', 'true');
            localStorage.setItem('onboarding_ref', referenceNumber);
        }
    }, [referenceNumber]);

    return (
        <div className="flex flex-col items-center text-center space-y-8 py-8">
            {/* Success Icon */}
            <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-500">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>

            {/* Success Message */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Application Submitted!</h1>
                <p className="text-lg text-muted-foreground">आवेदन सफलतापूर्वक जमा हो गया</p>
                <p className="text-sm text-muted-foreground max-w-md">
                    Your KYC application has been submitted successfully. We will notify you within 24-48 hours.
                </p>
            </div>

            {/* Reference Details */}
            <Card className="w-full max-w-md">
                <CardContent className="pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Reference Number</span>
                        <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{referenceNumber}</code>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCopy(referenceNumber)}>
                                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">CKYC Number</span>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{ckycNumber}</code>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">UCIC</span>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{ucicNumber}</code>
                    </div>

                    <hr />

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge className="bg-yellow-500">Under Review</Badge>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Submitted On</span>
                        <span className="text-sm">{formatIndianDateTime(new Date())}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Notification Info */}
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <p className="flex items-center justify-center gap-2">
                    📧 Confirmation sent to your email
                </p>
                <p className="flex items-center justify-center gap-2">
                    📱 SMS sent to your mobile
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                <Button variant="outline" className="flex-1 gap-2">
                    <Download className="h-4 w-4" />
                    Download Summary
                </Button>
                <Link href="/dashboard" className="flex-1">
                    <Button className="w-full gap-2">
                        <Home className="h-4 w-4" />
                        Go to Dashboard
                    </Button>
                </Link>
            </div>

            {/* Help Text */}
            <p className="text-xs text-muted-foreground max-w-sm">
                For any queries, contact our support at <a href="tel:1800-XXX-XXXX" className="text-primary underline">1800-XXX-XXXX</a> or email <a href="mailto:support@example.com" className="text-primary underline">support@example.com</a>
            </p>
        </div>
    );
}
