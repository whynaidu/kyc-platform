"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    MapPin,
    CheckCircle,
    Navigation,
    Info,
    Edit,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "permission" | "detecting" | "confirm" | "manual" | "success";

interface LocationData {
    latitude: number;
    longitude: number;
    accuracy: number;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
}

export default function LocationPage() {
    const router = useRouter();
    const [step, setStep] = React.useState<Step>("permission");
    const [location, setLocation] = React.useState<LocationData | null>(null);
    const [manualAddress, setManualAddress] = React.useState({
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
    });

    const detectLocation = () => {
        setStep("detecting");

        if (!navigator.geolocation) {
            toast.error("Geolocation not supported", {
                description: "Your browser doesn't support geolocation. Please enter address manually.",
            });
            setStep("manual");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Simulate reverse geocoding
                const mockLocation: LocationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    address: "123 Main Street",
                    city: "San Francisco",
                    state: "California",
                    country: "United States",
                    postalCode: "94102",
                };
                setLocation(mockLocation);
                setStep("confirm");
            },
            () => {
                toast.error("Location access denied", {
                    description: "Please allow location access or enter address manually.",
                });
                setStep("manual");
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    const confirmLocation = () => {
        toast.success("Location verified!", {
            description: "Your location has been captured successfully.",
        });
        setStep("success");
    };

    const submitManualAddress = () => {
        if (!manualAddress.street || !manualAddress.city || !manualAddress.country) {
            toast.error("Incomplete address", {
                description: "Please fill in all required fields.",
            });
            return;
        }

        setLocation({
            latitude: 0,
            longitude: 0,
            accuracy: 0,
            address: manualAddress.street,
            city: manualAddress.city,
            state: manualAddress.state,
            country: manualAddress.country,
            postalCode: manualAddress.postalCode,
        });

        toast.success("Address saved!", {
            description: "Your address has been captured successfully.",
        });
        setStep("success");
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.push("/kyc")}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Location Capture</h1>
                    <p className="text-muted-foreground">Verify your current location</p>
                </div>
            </div>

            {step === "permission" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Location Permission</CardTitle>
                        <CardDescription>We need your location to verify your identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Privacy Notice</AlertTitle>
                            <AlertDescription>
                                Your location data is used solely for identity verification purposes and is handled
                                in accordance with our privacy policy. We do not share your location with third parties.
                            </AlertDescription>
                        </Alert>

                        <div className="flex justify-center py-8">
                            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                                <MapPin className="h-12 w-12 text-primary" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Button onClick={detectLocation} className="w-full">
                                <Navigation className="mr-2 h-4 w-4" />
                                Allow Location Access
                            </Button>
                            <Button variant="outline" onClick={() => setStep("manual")} className="w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Enter Address Manually
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "detecting" && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-4 border-primary border-t-transparent" />
                            <h2 className="text-xl font-semibold">Detecting location...</h2>
                            <p className="text-muted-foreground">Please wait while we determine your location</p>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "confirm" && location && (
                <Card>
                    <CardHeader>
                        <CardTitle>Confirm Your Location</CardTitle>
                        <CardDescription>Is this your current location?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Map Placeholder */}
                        <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                                    </p>
                                </div>
                            </div>
                            {/* Accuracy circle indicator */}
                            <div className="absolute bottom-4 left-4 bg-background/90 px-3 py-1 rounded-full text-xs">
                                Accuracy: ±{Math.round(location.accuracy)}m
                            </div>
                        </div>

                        {/* Address Display */}
                        <div className="p-4 bg-muted rounded-lg space-y-1">
                            <p className="font-medium">{location.address}</p>
                            <p className="text-sm text-muted-foreground">
                                {location.city}, {location.state} {location.postalCode}
                            </p>
                            <p className="text-sm text-muted-foreground">{location.country}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep("manual")} className="flex-1">
                                Edit Address
                            </Button>
                            <Button onClick={confirmLocation} className="flex-1">
                                Confirm Location
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "manual" && (
                <Card>
                    <CardHeader>
                        <CardTitle>Enter Address</CardTitle>
                        <CardDescription>Please enter your current address manually</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="street">Street Address *</Label>
                            <Input
                                id="street"
                                placeholder="123 Main Street"
                                value={manualAddress.street}
                                onChange={(e) => setManualAddress({ ...manualAddress, street: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="city">City *</Label>
                                <Input
                                    id="city"
                                    placeholder="City"
                                    value={manualAddress.city}
                                    onChange={(e) => setManualAddress({ ...manualAddress, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="state">State/Province</Label>
                                <Input
                                    id="state"
                                    placeholder="State"
                                    value={manualAddress.state}
                                    onChange={(e) => setManualAddress({ ...manualAddress, state: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="country">Country *</Label>
                                <Input
                                    id="country"
                                    placeholder="Country"
                                    value={manualAddress.country}
                                    onChange={(e) => setManualAddress({ ...manualAddress, country: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input
                                    id="postalCode"
                                    placeholder="12345"
                                    value={manualAddress.postalCode}
                                    onChange={(e) => setManualAddress({ ...manualAddress, postalCode: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep("permission")} className="flex-1">
                                Use GPS Instead
                            </Button>
                            <Button onClick={submitManualAddress} className="flex-1">
                                Submit Address
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {step === "success" && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="h-20 w-20 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <CheckCircle className="h-10 w-10 text-green-500" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-green-500">Location Captured!</h2>
                            <p className="text-muted-foreground">
                                Your location has been verified successfully.
                            </p>

                            {location && (
                                <div className="p-4 bg-muted rounded-lg text-left">
                                    <p className="font-medium">{location.address}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {location.city}, {location.state} {location.postalCode}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{location.country}</p>
                                </div>
                            )}

                            <Button onClick={() => router.push("/kyc")} className="w-full">
                                Continue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
