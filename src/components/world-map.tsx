"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface WorldMapProps {
    data: Array<{ country: string; verifications: number; successRate: number }>;
}

// Real coordinates (longitude, latitude)
const getCoordinates = (country: string): [number, number] | null => {
    const mapping: Record<string, [number, number]> = {
        "United States": [-95.7129, 37.0902],
        "Canada": [-106.3468, 56.1304],
        "United Kingdom": [-3.4360, 55.3781],
        "Germany": [10.4515, 51.1657],
        "France": [2.2137, 46.2276],
        "India": [78.9629, 20.5937],
        "Japan": [138.2529, 36.2048],
        "Australia": [133.7751, -25.2744],
        "Brazil": [-51.9253, -14.2350],
        "Singapore": [103.8198, 1.3521],
        "Mexico": [-102.5528, 23.6345],
        "Spain": [-3.7492, 40.4637],
        "Italy": [12.5674, 41.8719],
        "South Korea": [127.7669, 35.9078],
        "China": [104.1954, 35.8617],
        "Russia": [105.3188, 61.5240],
    };
    return mapping[country] || null;
};

export function WorldMap({ data }: WorldMapProps) {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Use resolved theme to determine actual theme (resolves 'system')
    const isDark = mounted && (resolvedTheme === 'dark' || (!resolvedTheme && theme === 'dark'));

    return (
        <div className={`w-full aspect-[2/1] rounded-lg relative overflow-hidden flex items-center justify-center border border-border/50 shadow-2xl ${isDark ? 'bg-neutral-950' : 'bg-neutral-100'}`}>
            {/* Dot Pattern Background Overlay */}
            <div className={`absolute inset-0 bg-[radial-gradient(${isDark ? '#ffffff10' : '#00000008'}_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none`} />

            <div className="w-full h-full">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 110,
                        center: [0, 10]
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={isDark ? "#1a1a1a" : "#e5e5e5"}
                                    stroke={isDark ? "#404040" : "#a3a3a3"}
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: isDark ? "#262626" : "#d4d4d4", outline: "none" },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {/* Data Points */}
                    {data.map((stat) => {
                        const coords = getCoordinates(stat.country);
                        if (!coords) return null;

                        return (
                            <Marker key={stat.country} coordinates={coords}>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <g className="cursor-pointer group">
                                                {/* Outer glow ring - white in dark mode, accent color in light mode */}
                                                <circle
                                                    r={5}
                                                    fill="none"
                                                    stroke={isDark ? "#ffffff" : "hsl(var(--primary))"}
                                                    strokeWidth={isDark ? 1 : 1.5}
                                                    opacity={isDark ? 0.4 : 0.5}
                                                />
                                                {/* Main marker */}
                                                <circle
                                                    r={4}
                                                    fill="hsl(var(--primary))"
                                                    className="transition-all group-hover:opacity-100"
                                                    opacity={isDark ? 0.9 : 1}
                                                />
                                                {/* Pulsing animation ring */}
                                                <circle
                                                    r={8}
                                                    stroke={isDark ? "#ffffff" : "hsl(var(--primary))"}
                                                    strokeWidth={isDark ? 1 : 2}
                                                    opacity={isDark ? 0.3 : 0.5}
                                                    fill="none"
                                                >
                                                    <animate attributeName="r" from="5" to="16" dur="2s" repeatCount="indefinite" />
                                                    <animate attributeName="opacity" from={isDark ? "0.4" : "0.6"} to="0" dur="2s" repeatCount="indefinite" />
                                                </circle>
                                            </g>
                                        </TooltipTrigger>
                                        <TooltipContent className="z-50">
                                            <div className="text-center">
                                                <p className="font-bold text-sm">{stat.country}</p>
                                                <p className="text-xs text-muted-foreground">{stat.verifications} verifications</p>
                                                <p className={`text-xs mt-1 ${stat.successRate >= 90 ? 'text-green-500' : 'text-yellow-500'}`}>
                                                    {stat.successRate}% success rate
                                                </p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Marker>
                        );
                    })}
                </ComposableMap>
            </div>

            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-mono">
                LIVE TRAFFIC • {data.length} ACTIVE REGIONS
            </div>
        </div>
    );
}
