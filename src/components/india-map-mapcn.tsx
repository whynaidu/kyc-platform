"use client";

import * as React from "react";
import {
    Map,
    MapMarker,
    MarkerContent,
    MarkerTooltip,
    MapControls,
} from "@/components/ui/map";
import { formatIndianNumber } from "@/lib/utils/indian-format";

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

// Get marker size based on verification intensity
const getMarkerSize = (verifications: number, maxVerifications: number): number => {
    const intensity = verifications / maxVerifications;
    // Size ranges from 8px to 24px based on intensity
    return 8 + Math.round(intensity * 16);
};

// Get color based on success rate
const getMarkerColor = (successRate: number): string => {
    if (successRate >= 95) return "bg-emerald-500";
    if (successRate >= 90) return "bg-green-500";
    if (successRate >= 85) return "bg-yellow-500";
    if (successRate >= 80) return "bg-orange-500";
    return "bg-red-500";
};

// Get ring color based on success rate
const getRingColor = (successRate: number): string => {
    if (successRate >= 95) return "ring-emerald-300";
    if (successRate >= 90) return "ring-green-300";
    if (successRate >= 85) return "ring-yellow-300";
    if (successRate >= 80) return "ring-orange-300";
    return "ring-red-300";
};

export function IndiaMapMapcn({ data }: IndiaMapProps) {
    const maxVerifications = React.useMemo(() =>
        Math.max(...data.map(d => d.verifications)), [data]
    );

    // India center coordinates
    const indiaCenter: [number, number] = [78.9629, 22.5937];

    return (
        <div className="w-full aspect-[4/3] rounded-lg overflow-hidden border border-border/50 shadow-lg">
            <Map
                center={indiaCenter}
                zoom={4.2}
                minZoom={3}
                maxZoom={10}
                maxBounds={[
                    [60, 5],   // Southwest - [lng, lat]
                    [100, 40]  // Northeast - [lng, lat]
                ]}
            >
                <MapControls
                    position="bottom-right"
                    showZoom={true}
                    showCompass={true}
                />

                {/* State Markers */}
                {data.map((stat) => {
                    const coords = stat.coordinates || getStateCoordinates(stat.state);
                    if (!coords) return null;

                    const size = getMarkerSize(stat.verifications, maxVerifications);
                    const colorClass = getMarkerColor(stat.successRate);
                    const ringClass = getRingColor(stat.successRate);

                    return (
                        <MapMarker
                            key={stat.state}
                            longitude={coords[0]}
                            latitude={coords[1]}
                        >
                            <MarkerContent>
                                <div
                                    className={`rounded-full ${colorClass} ring-2 ${ringClass} shadow-lg cursor-pointer transition-transform hover:scale-125 flex items-center justify-center`}
                                    style={{
                                        width: `${size}px`,
                                        height: `${size}px`,
                                    }}
                                >
                                    <div className="w-1/3 h-1/3 rounded-full bg-white/80" />
                                </div>
                            </MarkerContent>
                            <MarkerTooltip className="min-w-[180px] p-2">
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">{stat.state}</p>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Verifications:</span>
                                        <span className="font-medium">{formatIndianNumber(stat.verifications)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs">
                                        <span className="text-muted-foreground">Success Rate:</span>
                                        <span className={`font-medium ${stat.successRate >= 90 ? 'text-green-500' : stat.successRate >= 85 ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {stat.successRate}%
                                        </span>
                                    </div>
                                </div>
                            </MarkerTooltip>
                        </MapMarker>
                    );
                })}
            </Map>

            {/* Overlay Legend */}
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg p-3 border border-border/50 text-xs">
                <p className="font-medium mb-2 text-foreground">Success Rate</p>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-muted-foreground">&ge; 95%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">90-94%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <span className="text-muted-foreground">85-89%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500" />
                        <span className="text-muted-foreground">80-84%</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">&lt; 80%</span>
                    </div>
                </div>
                <p className="mt-2 text-muted-foreground italic">Size = Volume</p>
            </div>

            {/* Status indicator */}
            <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-border/50 text-xs font-mono text-muted-foreground">
                LIVE TRAFFIC &bull; {data.length} STATES/UTs ACTIVE
            </div>
        </div>
    );
}
