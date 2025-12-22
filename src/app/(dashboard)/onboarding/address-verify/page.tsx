"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { INDIAN_STATES } from "@/lib/constants/indian-states";
import { validatePincode } from "@/lib/validators/indian-patterns";

export default function AddressVerifyPage() {
    const router = useRouter();

    const [address, setAddress] = React.useState({
        flatNo: '',
        building: '',
        street: '',
        locality: '',
        landmark: '',
        city: '',
        district: '',
        state: '',
        pincode: '',
    });

    const [sameAsCurrent, setSameAsCurrent] = React.useState(true);
    const [addressProofMethod, setAddressProofMethod] = React.useState<'aadhaar' | 'digilocker' | 'upload'>('aadhaar');
    const [fetchingPincode, setFetchingPincode] = React.useState(false);
    const [addressVerified, setAddressVerified] = React.useState(false);
    const [verifying, setVerifying] = React.useState(false);

    const handlePincodeChange = async (pincode: string) => {
        const cleanPincode = pincode.replace(/\D/g, '').slice(0, 6);
        setAddress(prev => ({ ...prev, pincode: cleanPincode }));

        if (cleanPincode.length === 6 && validatePincode(cleanPincode)) {
            setFetchingPincode(true);
            // Simulate API call for PIN code lookup
            await new Promise(resolve => setTimeout(resolve, 800));

            // Mock response based on first digit
            const mockData: Record<string, { city: string; district: string; state: string }> = {
                '1': { city: 'Delhi', district: 'Central Delhi', state: 'Delhi' },
                '2': { city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh' },
                '3': { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan' },
                '4': { city: 'Mumbai', district: 'Mumbai', state: 'Maharashtra' },
                '5': { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana' },
                '6': { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu' },
                '7': { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal' },
                '8': { city: 'Patna', district: 'Patna', state: 'Bihar' },
            };

            const data = mockData[cleanPincode[0]] || { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka' };
            setAddress(prev => ({ ...prev, ...data }));
            setFetchingPincode(false);
        }
    };

    const handleVerify = async () => {
        setVerifying(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAddressVerified(true);
        setVerifying(false);
    };

    const isFormValid = address.locality && address.city && address.district && address.state &&
        address.pincode.length === 6 && validatePincode(address.pincode);

    const handleContinue = () => {
        localStorage.setItem('onboarding_address', JSON.stringify(address));
        router.push('/onboarding/bank-link');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Address Verification</h2>
                <p className="text-muted-foreground">पता सत्यापन</p>
            </div>

            {/* Current Address */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Current Address / वर्तमान पता
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="flatNo">Flat/House No.</Label>
                            <Input
                                id="flatNo"
                                placeholder="B-402"
                                value={address.flatNo}
                                onChange={(e) => setAddress(prev => ({ ...prev, flatNo: e.target.value }))}
                                disabled={addressVerified}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="building">Building Name</Label>
                            <Input
                                id="building"
                                placeholder="Sunshine Apartments"
                                value={address.building}
                                onChange={(e) => setAddress(prev => ({ ...prev, building: e.target.value }))}
                                disabled={addressVerified}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="street">Street/Road</Label>
                        <Input
                            id="street"
                            placeholder="80 Feet Road"
                            value={address.street}
                            onChange={(e) => setAddress(prev => ({ ...prev, street: e.target.value }))}
                            disabled={addressVerified}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="locality">Locality/Area *</Label>
                        <Input
                            id="locality"
                            placeholder="Koramangala 4th Block"
                            value={address.locality}
                            onChange={(e) => setAddress(prev => ({ ...prev, locality: e.target.value }))}
                            disabled={addressVerified}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                            id="landmark"
                            placeholder="Near Forum Mall"
                            value={address.landmark}
                            onChange={(e) => setAddress(prev => ({ ...prev, landmark: e.target.value }))}
                            disabled={addressVerified}
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="pincode">PIN Code *</Label>
                            <div className="relative">
                                <Input
                                    id="pincode"
                                    placeholder="560034"
                                    inputMode="numeric"
                                    value={address.pincode}
                                    onChange={(e) => handlePincodeChange(e.target.value)}
                                    disabled={addressVerified}
                                    className="pr-8"
                                    required
                                />
                                {fetchingPincode && (
                                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="city">City *</Label>
                            <Input
                                id="city"
                                placeholder="Auto-filled from PIN"
                                value={address.city}
                                onChange={(e) => setAddress(prev => ({ ...prev, city: e.target.value }))}
                                disabled={addressVerified || fetchingPincode}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="district">District *</Label>
                            <Input
                                id="district"
                                placeholder="Auto-filled from PIN"
                                value={address.district}
                                onChange={(e) => setAddress(prev => ({ ...prev, district: e.target.value }))}
                                disabled={addressVerified || fetchingPincode}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="state">State *</Label>
                            <Select
                                value={address.state}
                                onValueChange={(value) => setAddress(prev => ({ ...prev, state: value }))}
                                disabled={addressVerified}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                                <SelectContent>
                                    {INDIAN_STATES.map((state) => (
                                        <SelectItem key={state.code} value={state.name}>
                                            {state.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permanent Address */}
            <div className="flex items-center gap-3 px-1">
                <Checkbox
                    id="sameAddress"
                    checked={sameAsCurrent}
                    onCheckedChange={(checked) => setSameAsCurrent(checked as boolean)}
                    disabled={addressVerified}
                />
                <Label htmlFor="sameAddress" className="cursor-pointer">
                    Permanent address is same as current address
                </Label>
            </div>

            {/* Address Proof */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Address Proof</CardTitle>
                    <CardDescription>How would you like to verify your address?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup value={addressProofMethod} onValueChange={(v) => setAddressProofMethod(v as 'aadhaar' | 'digilocker' | 'upload')} disabled={addressVerified}>
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <RadioGroupItem value="aadhaar" id="aadhaar_addr" />
                            <Label htmlFor="aadhaar_addr" className="cursor-pointer flex-1">
                                <p className="font-medium">Use Aadhaar address</p>
                                <p className="text-xs text-muted-foreground">Already verified in previous step</p>
                            </Label>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <RadioGroupItem value="digilocker" id="digilocker" />
                            <Label htmlFor="digilocker" className="cursor-pointer flex-1">
                                <p className="font-medium">Import from DigiLocker</p>
                                <p className="text-xs text-muted-foreground">Fetch documents from your DigiLocker</p>
                            </Label>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <RadioGroupItem value="upload" id="upload" />
                            <Label htmlFor="upload" className="cursor-pointer flex-1">
                                <p className="font-medium">Upload utility bill/bank statement</p>
                                <p className="text-xs text-muted-foreground">Last 2 months document</p>
                            </Label>
                        </div>
                    </RadioGroup>

                    {!addressVerified && (
                        <Button onClick={handleVerify} disabled={!isFormValid || verifying} className="w-full">
                            {verifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MapPin className="h-4 w-4 mr-2" />}
                            Verify Address
                        </Button>
                    )}

                    {addressVerified && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-600">Address verified successfully</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding/video-kyc')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button onClick={handleContinue} disabled={!addressVerified}>
                    Continue to Bank
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
