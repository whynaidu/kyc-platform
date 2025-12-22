"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Shield, Clock, FileCheck, Video, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OnboardingLandingPage() {
    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome to Digital Onboarding
                </h1>
                <p className="text-lg text-muted-foreground">
                    डिजिटल ऑनबोर्डिंग में आपका स्वागत है
                </p>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Complete your KYC verification in just 6 simple steps.
                    The entire process takes approximately 10-15 minutes.
                </p>
            </div>

            {/* What You'll Need */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">What You&apos;ll Need</CardTitle>
                    <CardDescription>आपको क्या चाहिए</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Aadhaar Card</p>
                                <p className="text-sm text-muted-foreground">12-digit Aadhaar number with registered mobile</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">PAN Card</p>
                                <p className="text-sm text-muted-foreground">Original PAN card for Video KYC</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Bank Account Details</p>
                                <p className="text-sm text-muted-foreground">Account number and IFSC code</p>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium">Device with Camera</p>
                                <p className="text-sm text-muted-foreground">For Video KYC verification</p>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            {/* Steps Preview */}
            <div className="grid gap-3">
                {[
                    { step: 1, title: 'Mobile & Email', desc: 'Verify your contact details', icon: Shield, time: '2 min' },
                    { step: 2, title: 'Identity', desc: 'Aadhaar & PAN verification', icon: FileCheck, time: '3 min' },
                    { step: 3, title: 'Video KYC', desc: 'Face-to-face verification', icon: Video, time: '5 min' },
                    { step: 4, title: 'Address', desc: 'Verify your address', icon: FileCheck, time: '2 min' },
                    { step: 5, title: 'Bank Account', desc: 'Link your bank account', icon: Shield, time: '2 min' },
                    { step: 6, title: 'Review', desc: 'Confirm and submit', icon: CheckCircle2, time: '1 min' },
                ].map((item) => (
                    <div key={item.step} className="flex items-center gap-4 p-3 rounded-lg border bg-card">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                            {item.step}
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {item.time}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="pt-4">
                <Link href="/onboarding/mobile-verify">
                    <Button size="lg" className="w-full gap-2">
                        Start Onboarding
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
                <p className="text-center text-xs text-muted-foreground mt-3">
                    By continuing, you agree to our <Link href="#" className="underline">Terms of Service</Link> and <Link href="#" className="underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
