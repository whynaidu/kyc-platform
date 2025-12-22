"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { formatIndianNumber } from "@/lib/utils/indian-format";

// India TopoJSON - using geohacker India boundaries (reliable source)
const indiaGeoUrl = "https://raw.githubusercontent.com/geohacker/india/master/state/india_state.geojson";

interface IndiaMapProps {
    data: Array<{
        state: string;
        stateCode?: string;
        verifications: number;
        successRate: number;
        coordinates?: [number, number];
    }>;
}

// Indian state coordinates (longitude, latitude)
const STATE_COORDINATES: Record<string, [number, number]> = {
    "Maharashtra": [75.7139, 19.7515],
    "Karnataka": [75.7139, 15.3173],
    "Tamil Nadu": [78.6569, 11.1271],
    "Andhra Pradesh": [79.7400, 15.9129],
    "Telangana": [79.0193, 18.1124],
    "Kerala": [76.2711, 10.8505],
    "Gujarat": [71.1924, 22.2587],
    "Rajasthan": [74.2179, 27.0238],
    "Uttar Pradesh": [80.9462, 26.8467],
    "Madhya Pradesh": [78.6569, 22.9734],
    "West Bengal": [87.8550, 22.9868],
    "Bihar": [85.3131, 25.0961],
    "Odisha": [85.0985, 20.9517],
    "Jharkhand": [85.2799, 23.6102],
    "Chhattisgarh": [81.8661, 21.2787],
    "Punjab": [75.3412, 31.1471],
    "Haryana": [76.0856, 29.0588],
    "Uttarakhand": [79.0193, 30.0668],
    "Himachal Pradesh": [77.1734, 31.1048],
    "Jammu and Kashmir": [74.7973, 33.7782],
    "Assam": [92.9376, 26.2006],
    "Goa": [74.1240, 15.2993],
    "Delhi": [77.1025, 28.7041],
    "Chandigarh": [76.7794, 30.7333],
    "Puducherry": [79.8083, 11.9416],
    "Meghalaya": [91.3662, 25.4670],
    "Manipur": [93.9063, 24.6637],
    "Mizoram": [92.9376, 23.1645],
    "Tripura": [91.9882, 23.9408],
    "Nagaland": [94.5624, 26.1584],
    "Arunachal Pradesh": [94.7278, 28.2180],
    "Sikkim": [88.5122, 27.5330],
    "Ladakh": [77.5771, 34.1526],
};

const getStateCoordinates = (stateName: string): [number, number] | null => {
    if (STATE_COORDINATES[stateName]) {
        return STATE_COORDINATES[stateName];
    }
    const key = Object.keys(STATE_COORDINATES).find(k =>
        stateName.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(stateName.toLowerCase())
    );
    return key ? STATE_COORDINATES[key] : null;
};

// Parse OKLCH color string to get L, C, H values
function parseOklch(oklchStr: string): { l: number; c: number; h: number } | null {
    // Match patterns like "oklch(0.6 0.2 250)" or "oklch(0.6, 0.2, 250)"
    const match = oklchStr.match(/oklch\(\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*[,\s]\s*([\d.]+)\s*\)/i);
    if (match) {
        return {
            l: parseFloat(match[1]),
            c: parseFloat(match[2]),
            h: parseFloat(match[3])
        };
    }
    return null;
}

// Generate OKLCH color with modified lightness
function generateOklchVariant(l: number, c: number, h: number): string {
    return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h})`;
}

// Memoized Geography component to prevent unnecessary re-renders
const MemoizedGeography = React.memo(function MemoizedGeography({
    geo,
    fill,
    stroke,
    hoverFill,
    onMouseEnter,
    onMouseLeave,
}: {
    geo: GeoJSON.Feature;
    fill: string;
    stroke: string;
    hoverFill: string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}) {
    return (
        <Geography
            geography={geo}
            fill={fill}
            stroke={stroke}
            strokeWidth={0.5}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            style={{
                default: { outline: "none", cursor: "pointer" },
                hover: { fill: hoverFill, outline: "none" },
                pressed: { outline: "none" },
            }}
        />
    );
});

export function IndiaMap({ data }: IndiaMapProps) {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [, setHoveredState] = React.useState<string | null>(null);
    const [tooltipData, setTooltipData] = React.useState<{
        name: string;
        verifications?: number;
        successRate?: number;
        x: number;
        y: number;
    } | null>(null);
    const [primaryColor, setPrimaryColor] = React.useState<{ l: number; c: number; h: number } | null>(null);

    React.useEffect(() => {
        setMounted(true);

        // Read the primary color from CSS variable
        const updatePrimaryColor = () => {
            const computedStyle = getComputedStyle(document.documentElement);
            const primaryValue = computedStyle.getPropertyValue('--primary').trim();
            const parsed = parseOklch(primaryValue);
            if (parsed) {
                setPrimaryColor(parsed);
            }
        };

        updatePrimaryColor();

        // Listen for changes (theme/accent color changes)
        const observer = new MutationObserver(() => {
            updatePrimaryColor();
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['style', 'class']
        });

        return () => observer.disconnect();
    }, []);

    const isDark = mounted && resolvedTheme === 'dark';

    // Generate color palette based on primary color
    const colors = React.useMemo(() => {
        if (!primaryColor) {
            // Fallback colors if primary is not available
            return isDark ? {
                empty: "#1e293b",
                low: "#334155",
                medium: "#475569",
                high: "#64748b",
                intense: "#94a3b8",
                marker: "#94a3b8",
                markerRing: "#cbd5e1",
                stroke: "#334155",
                hoverEmpty: "#334155",
            } : {
                empty: "#f1f5f9",
                low: "#e2e8f0",
                medium: "#cbd5e1",
                high: "#94a3b8",
                intense: "#64748b",
                marker: "#64748b",
                markerRing: "#475569",
                stroke: "#cbd5e1",
                hoverEmpty: "#e2e8f0",
            };
        }

        const { c, h } = primaryColor;

        if (isDark) {
            // Dark mode: lighter colors for filled states (so they're visible on dark bg)
            return {
                empty: "#1e293b",
                low: generateOklchVariant(0.35, c * 0.6, h),      // Very dark, low chroma
                medium: generateOklchVariant(0.45, c * 0.8, h),   // Dark
                high: generateOklchVariant(0.55, c * 0.9, h),     // Medium
                intense: generateOklchVariant(0.65, c, h),        // Bright
                marker: generateOklchVariant(0.75, c, h),         // Brighter for markers
                markerRing: generateOklchVariant(0.85, c * 0.8, h), // Even brighter ring
                stroke: "#475569",
                hoverEmpty: "#334155",
            };
        } else {
            // Light mode: darker colors for higher intensity (so they're visible on light bg)
            return {
                empty: "#f1f5f9",
                low: generateOklchVariant(0.92, c * 0.4, h),      // Very light
                medium: generateOklchVariant(0.82, c * 0.6, h),   // Light
                high: generateOklchVariant(0.70, c * 0.8, h),     // Medium
                intense: generateOklchVariant(0.55, c, h),        // Dark (full saturation)
                marker: generateOklchVariant(0.50, c, h),         // Darker for markers
                markerRing: generateOklchVariant(0.60, c, h),     // Slightly lighter ring
                stroke: "#cbd5e1",
                hoverEmpty: "#e2e8f0",
            };
        }
    }, [primaryColor, isDark]);

    // Memoize data lookup map for performance
    const dataMap = React.useMemo(() => {
        const map = new Map<string, typeof data[0]>();
        data.forEach(d => {
            map.set(d.state.toLowerCase(), d);
        });
        return map;
    }, [data]);

    const maxVerifications = React.useMemo(() =>
        Math.max(...data.map(d => d.verifications)), [data]
    );

    const getColor = React.useCallback((stateData: typeof data[0] | undefined) => {
        if (!stateData) return colors.empty;
        const intensity = stateData.verifications / maxVerifications;
        if (intensity < 0.25) return colors.low;
        if (intensity < 0.5) return colors.medium;
        if (intensity < 0.75) return colors.high;
        return colors.intense;
    }, [colors, maxVerifications]);

    const findStateData = React.useCallback((stateName: string | undefined) => {
        if (!stateName) return undefined;
        const lowerName = stateName.toLowerCase();
        if (dataMap.has(lowerName)) return dataMap.get(lowerName);
        for (const [key, value] of dataMap) {
            if (lowerName.includes(key) || key.includes(lowerName)) {
                return value;
            }
        }
        return undefined;
    }, [dataMap]);

    const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
        if (tooltipData) {
            setTooltipData(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
        }
    }, [tooltipData]);

    if (!mounted) {
        return (
            <div className="w-full aspect-[4/3] rounded-lg relative overflow-hidden flex items-center justify-center border border-border/50 shadow-lg bg-muted animate-pulse">
                <span className="text-muted-foreground">Loading map...</span>
            </div>
        );
    }

    return (
        <div
            className={`w-full aspect-[4/3] rounded-lg relative overflow-hidden flex items-center justify-center border border-border/50 shadow-lg ${isDark ? 'bg-slate-900' : 'bg-slate-50'}`}
            onMouseMove={handleMouseMove}
        >
            {/* Subtle grid pattern */}
            <div
                className="absolute inset-0 pointer-events-none opacity-30"
                style={{
                    backgroundImage: `radial-gradient(${isDark ? '#475569' : '#94a3b8'} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="w-full h-full">
                <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                        scale: 900,
                        center: [82, 22],
                    }}
                    style={{ width: "100%", height: "100%" }}
                >
                    <Geographies geography={indiaGeoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                const stateName = geo.properties.NAME_1 || geo.properties.name || geo.properties.ST_NM;
                                const stateData = findStateData(stateName);

                                return (
                                    <MemoizedGeography
                                        key={geo.rsmKey}
                                        geo={geo}
                                        fill={getColor(stateData)}
                                        stroke={colors.stroke}
                                        hoverFill={stateData ? colors.intense : colors.hoverEmpty}
                                        onMouseEnter={() => {
                                            setHoveredState(stateName);
                                            setTooltipData({
                                                name: stateName || 'Unknown',
                                                verifications: stateData?.verifications,
                                                successRate: stateData?.successRate,
                                                x: 0,
                                                y: 0
                                            });
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredState(null);
                                            setTooltipData(null);
                                        }}
                                    />
                                );
                            })
                        }
                    </Geographies>

                    {/* State Markers with data */}
                    {data.map((stat) => {
                        const coords = stat.coordinates || getStateCoordinates(stat.state);
                        if (!coords) return null;

                        return (
                            <Marker key={stat.state} coordinates={coords}>
                                <g
                                    className="cursor-pointer"
                                    onMouseEnter={() => setTooltipData({
                                        name: stat.state,
                                        verifications: stat.verifications,
                                        successRate: stat.successRate,
                                        x: 0,
                                        y: 0
                                    })}
                                    onMouseLeave={() => setTooltipData(null)}
                                >
                                    {/* Outer ring */}
                                    <circle
                                        r={5}
                                        fill="none"
                                        stroke={colors.markerRing}
                                        strokeWidth={1.5}
                                        opacity={0.8}
                                    />
                                    {/* Main marker */}
                                    <circle
                                        r={3}
                                        fill={colors.marker}
                                    />
                                    {/* Center dot */}
                                    <circle
                                        r={1}
                                        fill="#ffffff"
                                        opacity={0.9}
                                    />
                                </g>
                            </Marker>
                        );
                    })}
                </ComposableMap>
            </div>

            {/* Custom Tooltip */}
            {tooltipData && (
                <div
                    className={`fixed z-50 px-3 py-2 rounded-lg shadow-lg text-sm pointer-events-none transform -translate-x-1/2 -translate-y-full ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}`}
                    style={{
                        left: tooltipData.x,
                        top: tooltipData.y - 10,
                    }}
                >
                    <p className="font-semibold">{tooltipData.name}</p>
                    {tooltipData.verifications !== undefined ? (
                        <>
                            <p className="text-muted-foreground text-xs">
                                {formatIndianNumber(tooltipData.verifications)} verifications
                            </p>
                            <p className={`text-xs ${(tooltipData.successRate || 0) >= 90 ? 'text-green-500' : 'text-yellow-500'}`}>
                                {tooltipData.successRate}% success rate
                            </p>
                        </>
                    ) : (
                        <p className="text-muted-foreground text-xs">No data</p>
                    )}
                </div>
            )}

            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground font-mono">
                LIVE TRAFFIC &bull; {data.length} STATES/UTs ACTIVE
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span>Low</span>
                <div className="flex gap-0.5">
                    <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: colors.low }} />
                    <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: colors.medium }} />
                    <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: colors.high }} />
                    <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: colors.intense }} />
                </div>
                <span>High</span>
            </div>
        </div>
    );
}
