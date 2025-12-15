"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    Video,
    Calendar,
    Clock,
    CheckCircle,
    ArrowRight,
    Users,
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function VideoKYCPage() {
    const router = useRouter();

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Video KYC Verification</h1>
                <p className="text-muted-foreground">
                    Complete your KYC verification through a live video call with our verification agent.
                </p>
            </div>

            {/* Info Alert */}
            <Alert>
                <Video className="h-4 w-4" />
                <AlertTitle>What to Expect</AlertTitle>
                <AlertDescription>
                    A verification agent will guide you through the identity verification process in a
                    5-10 minute video call. Please have your ID document ready.
                </AlertDescription>
            </Alert>

            {/* Options Grid */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Join Queue Card */}
                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="mt-4">Join Queue Now</CardTitle>
                        <CardDescription>
                            Connect with the next available agent for immediate verification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Estimated wait: 2-5 minutes</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>3 people ahead of you</span>
                            </div>
                            <Button
                                onClick={() => router.push("/video-kyc/waiting-room")}
                                className="w-full"
                            >
                                Join Queue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Schedule Card */}
                <Card className="relative overflow-hidden">
                    <CardHeader>
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                            <Calendar className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="mt-4">Schedule for Later</CardTitle>
                        <CardDescription>
                            Book a convenient time slot for your verification call.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>Available: 9 AM - 6 PM</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Next available: Today, 3:30 PM</span>
                            </div>
                            <Button variant="outline" className="w-full">
                                Schedule Call
                                <Calendar className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Requirements */}
            <Card>
                <CardHeader>
                    <CardTitle>Before You Start</CardTitle>
                    <CardDescription>Make sure you have the following ready</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="grid gap-3 md:grid-cols-2">
                        <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                            <span className="text-sm">Valid government-issued ID (Passport, Driver&apos;s License, or National ID)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                            <span className="text-sm">Working camera and microphone</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                            <span className="text-sm">Stable internet connection</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle className="mt-0.5 h-4 w-4 text-green-500" />
                            <span className="text-sm">Quiet, well-lit environment</span>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
