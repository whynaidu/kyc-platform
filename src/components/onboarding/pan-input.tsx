"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { validatePAN, getPANEntityType, isIndividualPAN, PAN_PATTERN } from "@/lib/validators/pan";
import { CheckCircle2, XCircle, User, Building2 } from "lucide-react";

interface PANInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    onValidChange?: (isValid: boolean) => void;
    className?: string;
}

export function PANInput({ value, onChange, disabled, onValidChange, className }: PANInputProps) {
    const [touched, setTouched] = React.useState(false);

    const isComplete = value.length === 10;
    const isValid = isComplete && validatePAN(value);
    const entityType = isValid ? getPANEntityType(value) : undefined;
    const isIndividual = isValid && isIndividualPAN(value);

    React.useEffect(() => {
        if (onValidChange) {
            onValidChange(isValid);
        }
    }, [isValid, onValidChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Convert to uppercase and limit to 10 chars
        const formatted = e.target.value.toUpperCase().slice(0, 10);
        // Only allow alphanumeric
        const cleaned = formatted.replace(/[^A-Z0-9]/g, '');
        onChange(cleaned);
    };

    return (
        <div className={cn("space-y-1", className)}>
            <div className="relative">
                <Input
                    type="text"
                    placeholder="ABCPS1234K"
                    value={value}
                    onChange={handleChange}
                    onBlur={() => setTouched(true)}
                    disabled={disabled}
                    className={cn(
                        "text-lg tracking-wider font-mono uppercase pr-10",
                        touched && isComplete && !isValid && "border-destructive focus-visible:ring-destructive"
                    )}
                />
                {isComplete && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                            <XCircle className="h-5 w-5 text-destructive" />
                        )}
                    </div>
                )}
            </div>

            {touched && isComplete && !isValid && (
                <p className="text-xs text-destructive">Invalid PAN format</p>
            )}

            {isValid && entityType && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {isIndividual ? (
                        <User className="h-3 w-3" />
                    ) : (
                        <Building2 className="h-3 w-3" />
                    )}
                    <span>{entityType}</span>
                </div>
            )}
        </div>
    );
}
