"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
    title: string;
    value: string | number;
    badge?: string;
    badgeVariant?: "success" | "warning" | "danger" | "info" | "default";
    trend?: "up" | "down" | "neutral";
    description?: string;
    subtitle?: string;
    suffix?: string;
}

const badgeStyles = {
    success: "bg-emerald-500/10 text-emerald-500",
    warning: "bg-amber-500/10 text-amber-500",
    danger: "bg-red-500/10 text-red-500",
    info: "bg-blue-500/10 text-blue-500",
    default: "bg-primary/10 text-primary",
};

export function KPICard({
    title,
    value,
    badge,
    badgeVariant = "default",
    trend,
    description,
    subtitle,
    suffix = "",
}: KPICardProps) {
    const isPositive = trend === "up";
    const showTrendInBadge = trend && !badge;

    // Format value if it's a number
    const formattedValue = typeof value === "number"
        ? (value % 1 !== 0 ? value.toFixed(1) : value.toLocaleString())
        : value;

    return (
        <Card className="bg-card/50 min-w-0">
            <CardContent className="px-3 py-3 sm:px-5">
                {/* Header: Title and Badge */}
                <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs sm:text-sm text-muted-foreground truncate">{title}</span>
                    {(badge || showTrendInBadge) && (
                        <div className={`flex items-center gap-1 text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 ${
                            showTrendInBadge
                                ? (isPositive ? badgeStyles.success : badgeStyles.danger)
                                : badgeStyles[badgeVariant]
                        }`}>
                            {showTrendInBadge && (
                                isPositive
                                    ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                    : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            )}
                            <span className="whitespace-nowrap">{badge || (showTrendInBadge ? (isPositive ? "Up" : "Down") : "")}</span>
                        </div>
                    )}
                </div>

                {/* Large Value */}
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight mb-2 truncate">
                    {formattedValue}{suffix}
                </div>

                {/* Description with trend */}
                {(description || subtitle) && (
                    <div className="space-y-0.5 min-w-0">
                        {description && (
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
                                <span className="truncate">{description}</span>
                                {trend && (
                                    isPositive
                                        ? <TrendingUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                        : <TrendingDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                                )}
                            </div>
                        )}
                        {subtitle && (
                            <p className="text-[10px] sm:text-xs text-muted-foreground/70 truncate">{subtitle}</p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
