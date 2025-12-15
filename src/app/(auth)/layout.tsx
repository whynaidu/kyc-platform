import { Shield } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            {/* Left side - Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground flex-col justify-between p-12">
                <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
                        <Shield className="h-6 w-6" />
                    </div>
                    <span className="text-xl font-bold">KYC Platform</span>
                </div>

                <div className="space-y-6">
                    <h1 className="text-4xl font-bold leading-tight">
                        Secure Identity Verification Made Simple
                    </h1>
                    <p className="text-lg text-primary-foreground/80">
                        Our AI-powered KYC platform provides seamless identity verification
                        with face liveness detection, document verification, and video KYC capabilities.
                    </p>
                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className="p-4 rounded-lg bg-primary-foreground/10">
                            <p className="text-3xl font-bold">99.9%</p>
                            <p className="text-sm text-primary-foreground/70">Accuracy Rate</p>
                        </div>
                        <div className="p-4 rounded-lg bg-primary-foreground/10">
                            <p className="text-3xl font-bold">&lt;30s</p>
                            <p className="text-sm text-primary-foreground/70">Avg. Verification</p>
                        </div>
                        <div className="p-4 rounded-lg bg-primary-foreground/10">
                            <p className="text-3xl font-bold">50M+</p>
                            <p className="text-sm text-primary-foreground/70">Verifications</p>
                        </div>
                        <div className="p-4 rounded-lg bg-primary-foreground/10">
                            <p className="text-3xl font-bold">150+</p>
                            <p className="text-sm text-primary-foreground/70">Countries</p>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-primary-foreground/60">
                    © 2024 KYC Platform. All rights reserved.
                </p>
            </div>

            {/* Right side - Auth Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Shield className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold">KYC Platform</span>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
