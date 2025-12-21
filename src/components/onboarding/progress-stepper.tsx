"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStepperProps {
    currentStep: number;
    className?: string;
}

const steps = [
    { number: 1, label: 'Mobile', labelHi: 'मोबाइल', route: '/onboarding/mobile-verify' },
    { number: 2, label: 'Identity', labelHi: 'पहचान', route: '/onboarding/identity-verify' },
    { number: 3, label: 'Video KYC', labelHi: 'वीडियो', route: '/onboarding/video-kyc' },
    { number: 4, label: 'Address', labelHi: 'पता', route: '/onboarding/address-verify' },
    { number: 5, label: 'Bank', labelHi: 'बैंक', route: '/onboarding/bank-link' },
    { number: 6, label: 'Review', labelHi: 'समीक्षा', route: '/onboarding/review' },
];

export function ProgressStepper({ currentStep, className }: ProgressStepperProps) {
    return (
        <div className={cn("w-full py-4", className)}>
            {/* Desktop View */}
            <div className="hidden sm:flex justify-between items-center">
                {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                                    step.number < currentStep && "bg-green-500 text-white",
                                    step.number === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                    step.number > currentStep && "bg-muted text-muted-foreground"
                                )}
                            >
                                {step.number < currentStep ? <Check className="w-5 h-5" /> : step.number}
                            </div>
                            <span className={cn(
                                "text-xs mt-2 font-medium",
                                step.number <= currentStep ? "text-foreground" : "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 h-0.5 mx-2 transition-all duration-300",
                                step.number < currentStep ? "bg-green-500" : "bg-muted"
                            )} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Mobile View - Compact */}
            <div className="flex sm:hidden items-center justify-center gap-2">
                {steps.map((step) => (
                    <div
                        key={step.number}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all duration-300",
                            step.number < currentStep && "bg-green-500",
                            step.number === currentStep && "bg-primary w-6",
                            step.number > currentStep && "bg-muted"
                        )}
                    />
                ))}
            </div>

            {/* Mobile Step Label */}
            <div className="sm:hidden text-center mt-2">
                <span className="text-sm font-medium">
                    Step {currentStep} of 6: {steps[currentStep - 1]?.label}
                </span>
            </div>
        </div>
    );
}

export { steps };
