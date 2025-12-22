"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { formatAadhaar, validateAadhaar } from "@/lib/validators/aadhaar";
import { CheckCircle2, XCircle } from "lucide-react";

interface AadhaarInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    onValidChange?: (isValid: boolean) => void;
    className?: string;
}

export function AadhaarInput({ value, onChange, disabled, onValidChange, className }: AadhaarInputProps) {
    const [touched, setTouched] = React.useState(false);

    const cleanValue = value.replace(/\s/g, '');
    const isComplete = cleanValue.length === 12;
    const isValid = isComplete && validateAadhaar(cleanValue);

    React.useEffect(() => {
        if (onValidChange) {
            onValidChange(isValid);
        }
    }, [isValid, onValidChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only allow digits
        const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
        onChange(digits);
    };

    const displayValue = formatAadhaar(cleanValue);

    return (
        <div className={cn("relative", className)}>
            <Input
                type="text"
                inputMode="numeric"
                placeholder="XXXX XXXX XXXX"
                value={displayValue}
                onChange={handleChange}
                onBlur={() => setTouched(true)}
                disabled={disabled}
                className={cn(
                    "text-lg tracking-wider font-mono pr-10",
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
            {touched && isComplete && !isValid && (
                <p className="text-xs text-destructive mt-1">Invalid Aadhaar number</p>
            )}
        </div>
    );
}
