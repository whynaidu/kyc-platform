"use client";

import * as React from "react";
import { useTheme } from "next-themes";

// Color accent options - must match settings page
const accentColors = [
    { name: "Neutral", value: "neutral", color: "", fg: "" },
    { name: "Amber", value: "amber", color: "oklch(0.75 0.19 70)", fg: "oklch(0.2 0 0)" },
    { name: "Blue", value: "blue", color: "oklch(0.6 0.2 250)", fg: "oklch(1 0 0)" },
    { name: "Cyan", value: "cyan", color: "oklch(0.7 0.15 200)", fg: "oklch(0.2 0 0)" },
    { name: "Emerald", value: "emerald", color: "oklch(0.65 0.19 160)", fg: "oklch(1 0 0)" },
    { name: "Fuchsia", value: "fuchsia", color: "oklch(0.65 0.27 320)", fg: "oklch(1 0 0)" },
    { name: "Green", value: "green", color: "oklch(0.55 0.2 150)", fg: "oklch(1 0 0)" },
    { name: "Indigo", value: "indigo", color: "oklch(0.55 0.22 270)", fg: "oklch(1 0 0)" },
    { name: "Lime", value: "lime", color: "oklch(0.8 0.2 120)", fg: "oklch(0.2 0 0)" },
    { name: "Orange", value: "orange", color: "oklch(0.7 0.2 50)", fg: "oklch(0.2 0 0)" },
    { name: "Pink", value: "pink", color: "oklch(0.7 0.24 0)", fg: "oklch(0.2 0 0)" },
];

function applyAccentColor(colorValue: string, isDark: boolean) {
    const color = accentColors.find(c => c.value === colorValue);
    if (color && color.value !== "neutral" && color.color) {
        document.documentElement.style.setProperty("--primary", color.color);
        document.documentElement.style.setProperty("--primary-foreground", color.fg);

        // Extract hue from the color (oklch format: oklch(L C H))
        const hueMatch = color.color.match(/oklch\([\d.]+ [\d.]+ ([\d.]+)\)/);
        const hue = hueMatch ? parseFloat(hueMatch[1]) : 250;

        // Generate chart colors based on the accent hue
        if (isDark) {
            document.documentElement.style.setProperty("--chart-1", `oklch(0.65 0.14 ${hue})`);
            document.documentElement.style.setProperty("--chart-2", `oklch(0.72 0.11 ${(hue + 40) % 360})`);
            document.documentElement.style.setProperty("--chart-3", `oklch(0.58 0.09 ${(hue + 80) % 360})`);
            document.documentElement.style.setProperty("--chart-4", `oklch(0.68 0.07 ${(hue + 120) % 360})`);
            document.documentElement.style.setProperty("--chart-5", `oklch(0.55 0.05 ${(hue + 160) % 360})`);
        } else {
            document.documentElement.style.setProperty("--chart-1", `oklch(0.55 0.16 ${hue})`);
            document.documentElement.style.setProperty("--chart-2", `oklch(0.62 0.13 ${(hue + 40) % 360})`);
            document.documentElement.style.setProperty("--chart-3", `oklch(0.48 0.10 ${(hue + 80) % 360})`);
            document.documentElement.style.setProperty("--chart-4", `oklch(0.58 0.08 ${(hue + 120) % 360})`);
            document.documentElement.style.setProperty("--chart-5", `oklch(0.45 0.06 ${(hue + 160) % 360})`);
        }
    } else {
        document.documentElement.style.removeProperty("--primary");
        document.documentElement.style.removeProperty("--primary-foreground");
        document.documentElement.style.removeProperty("--chart-1");
        document.documentElement.style.removeProperty("--chart-2");
        document.documentElement.style.removeProperty("--chart-3");
        document.documentElement.style.removeProperty("--chart-4");
        document.documentElement.style.removeProperty("--chart-5");
    }
}

export function AccentColorProvider({ children }: { children: React.ReactNode }) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (!mounted) return;

        const savedAccent = localStorage.getItem("accent-color");
        if (savedAccent) {
            const isDark = resolvedTheme === "dark";
            applyAccentColor(savedAccent, isDark);
        }
    }, [mounted, resolvedTheme]);

    // Listen for storage changes (when accent is changed in settings)
    React.useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accent-color" && e.newValue) {
                const isDark = document.documentElement.classList.contains("dark");
                applyAccentColor(e.newValue, isDark);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return <>{children}</>;
}
