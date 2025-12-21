"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, AlertTriangle, ExternalLink, Upload, FileText } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { AadhaarInput } from "@/components/onboarding/aadhaar-input";
import { PANInput } from "@/components/onboarding/pan-input";
import { OTPInput } from "@/components/onboarding/otp-input";

type AadhaarMethod = 'otp' | 'offline_xml' | 'biometric';

export default function IdentityVerifyPage() {
    const router = useRouter();

    // Aadhaar State
    const [aadhaar, setAadhaar] = React.useState("");
    const [aadhaarValid, setAadhaarValid] = React.useState(false);
    const [aadhaarMethod, setAadhaarMethod] = React.useState<AadhaarMethod>('otp');
    const [aadhaarOtpSent, setAadhaarOtpSent] = React.useState(false);
    const [aadhaarOtp, setAadhaarOtp] = React.useState("");
    const [aadhaarVerified, setAadhaarVerified] = React.useState(false);
    const [aadhaarResendTimer, setAadhaarResendTimer] = React.useState(0);

    // Offline XML State
    const [xmlFile, setXmlFile] = React.useState<File | null>(null);
    const [shareCode, setShareCode] = React.useState("");

    // PAN State
    const [pan, setPan] = React.useState("");
    const [panValid, setPanValid] = React.useState(false);
    const [panVerified, setPanVerified] = React.useState(false);
    const [panAadhaarLinked, setPanAadhaarLinked] = React.useState<boolean | null>(null);

    // Loading States
    const [sendingOtp, setSendingOtp] = React.useState(false);
    const [verifyingAadhaar, setVerifyingAadhaar] = React.useState(false);
    const [verifyingPan, setVerifyingPan] = React.useState(false);

    // Timer Effect
    React.useEffect(() => {
        if (aadhaarResendTimer > 0) {
            const timer = setTimeout(() => setAadhaarResendTimer(aadhaarResendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [aadhaarResendTimer]);

    // Auto-verify OTP
    React.useEffect(() => {
        if (aadhaarOtp.length === 6 && aadhaarOtpSent && !aadhaarVerified) {
            handleVerifyAadhaarOtp();
        }
    }, [aadhaarOtp]);

    const handleSendAadhaarOtp = async () => {
        if (!aadhaarValid) return;

        setSendingOtp(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAadhaarOtpSent(true);
        setAadhaarResendTimer(60);
        setSendingOtp(false);
    };

    const handleVerifyAadhaarOtp = async () => {
        setVerifyingAadhaar(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAadhaarVerified(true);
        setVerifyingAadhaar(false);
    };

    const handleVerifyXml = async () => {
        if (!xmlFile || shareCode.length !== 4) return;

        setVerifyingAadhaar(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAadhaarVerified(true);
        setVerifyingAadhaar(false);
    };

    const handleVerifyPan = async () => {
        if (!panValid) return;

        setVerifyingPan(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setPanVerified(true);
        // Randomly set linked status for demo
        setPanAadhaarLinked(Math.random() > 0.3);
        setVerifyingPan(false);
    };

    const canContinue = aadhaarVerified && panVerified;

    const handleContinue = () => {
        localStorage.setItem('onboarding_aadhaar', aadhaar);
        localStorage.setItem('onboarding_pan', pan);
        localStorage.setItem('onboarding_kyc_type', aadhaarMethod === 'otp' ? 'otp_based' : 'full_kyc');
        router.push('/onboarding/video-kyc');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Identity Verification</h2>
                <p className="text-muted-foreground">पहचान सत्यापन</p>
            </div>

            {/* Aadhaar Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Aadhaar Number / आधार नंबर</CardTitle>
                    <CardDescription>12-digit Aadhaar with Verhoeff checksum validation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <AadhaarInput
                        value={aadhaar}
                        onChange={setAadhaar}
                        onValidChange={setAadhaarValid}
                        disabled={aadhaarVerified}
                    />

                    {aadhaarValid && !aadhaarVerified && (
                        <>
                            <div className="space-y-3">
                                <Label>Verification Method / सत्यापन विधि</Label>
                                <RadioGroup value={aadhaarMethod} onValueChange={(v) => setAadhaarMethod(v as AadhaarMethod)}>
                                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                                        <RadioGroupItem value="otp" id="otp" className="mt-0.5" />
                                        <Label htmlFor="otp" className="cursor-pointer flex-1">
                                            <p className="font-medium">OTP-based eKYC (Quick)</p>
                                            <p className="text-xs text-muted-foreground">Limited account: ₹1,00,000 max balance</p>
                                        </Label>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                                        <RadioGroupItem value="offline_xml" id="xml" className="mt-0.5" />
                                        <Label htmlFor="xml" className="cursor-pointer flex-1">
                                            <p className="font-medium">Upload Aadhaar XML (Full KYC)</p>
                                            <p className="text-xs text-muted-foreground">Unlimited account access</p>
                                        </Label>
                                    </div>
                                    <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer">
                                        <RadioGroupItem value="biometric" id="bio" className="mt-0.5" />
                                        <Label htmlFor="bio" className="cursor-pointer flex-1">
                                            <p className="font-medium">Biometric at Branch (Full KYC)</p>
                                            <p className="text-xs text-muted-foreground">Visit nearest branch with Aadhaar</p>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* OTP Method */}
                            {aadhaarMethod === 'otp' && (
                                <div className="space-y-3 pt-2">
                                    {!aadhaarOtpSent ? (
                                        <Button onClick={handleSendAadhaarOtp} disabled={sendingOtp} className="w-full">
                                            {sendingOtp ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                            Send OTP to Aadhaar-linked Mobile
                                        </Button>
                                    ) : (
                                        <>
                                            <Label>Enter OTP / ओटीपी दर्ज करें</Label>
                                            <OTPInput value={aadhaarOtp} onChange={setAadhaarOtp} disabled={verifyingAadhaar} />
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-muted-foreground">
                                                    {aadhaarResendTimer > 0
                                                        ? `Resend in ${aadhaarResendTimer}s`
                                                        : <Button variant="link" className="p-0 h-auto" onClick={handleSendAadhaarOtp}>Resend OTP</Button>
                                                    }
                                                </span>
                                                {verifyingAadhaar && <Loader2 className="h-4 w-4 animate-spin" />}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

                            {/* XML Upload Method */}
                            {aadhaarMethod === 'offline_xml' && (
                                <div className="space-y-4 pt-2">
                                    <Alert>
                                        <FileText className="h-4 w-4" />
                                        <AlertTitle>How to download Aadhaar XML</AlertTitle>
                                        <AlertDescription className="text-xs space-y-1">
                                            <p>1. Visit <a href="https://myaadhaar.uidai.gov.in/offline-ekyc" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">myaadhaar.uidai.gov.in <ExternalLink className="h-3 w-3" /></a></p>
                                            <p>2. Login with Aadhaar and OTP</p>
                                            <p>3. Set a 4-digit share code</p>
                                            <p>4. Download the ZIP file</p>
                                        </AlertDescription>
                                    </Alert>

                                    <div className="space-y-2">
                                        <Label>Upload Aadhaar XML ZIP</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="file"
                                                accept=".zip"
                                                onChange={(e) => setXmlFile(e.target.files?.[0] || null)}
                                                className="flex-1"
                                            />
                                        </div>
                                        {xmlFile && <p className="text-xs text-green-600">✓ {xmlFile.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Share Code (4 digits)</Label>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={4}
                                            placeholder="XXXX"
                                            value={shareCode}
                                            onChange={(e) => setShareCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                            className="w-32 text-center font-mono text-lg"
                                        />
                                    </div>

                                    <Button
                                        onClick={handleVerifyXml}
                                        disabled={!xmlFile || shareCode.length !== 4 || verifyingAadhaar}
                                        className="w-full"
                                    >
                                        {verifyingAadhaar ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                        Verify XML
                                    </Button>
                                </div>
                            )}

                            {/* Biometric Method */}
                            {aadhaarMethod === 'biometric' && (
                                <Alert>
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Branch Visit Required</AlertTitle>
                                    <AlertDescription>
                                        Biometric verification requires special hardware. Please visit your nearest branch with original Aadhaar card.
                                        <Button variant="link" className="p-0 h-auto ml-1">Find nearest branch →</Button>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}

                    {aadhaarVerified && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-600">
                                Aadhaar verified successfully ({aadhaarMethod === 'otp' ? 'OTP-based eKYC' : 'Full KYC'})
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* PAN Card */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">PAN Card / पैन कार्ड</CardTitle>
                    <CardDescription>Permanent Account Number (10 characters)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <PANInput
                        value={pan}
                        onChange={setPan}
                        onValidChange={setPanValid}
                        disabled={panVerified}
                    />

                    {panValid && !panVerified && (
                        <Button onClick={handleVerifyPan} disabled={verifyingPan} className="w-full">
                            {verifyingPan ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Verify PAN
                        </Button>
                    )}

                    {panVerified && (
                        <>
                            <Alert className="bg-green-500/10 border-green-500/20">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertDescription className="text-green-600">PAN verified successfully</AlertDescription>
                            </Alert>

                            {panAadhaarLinked === false && (
                                <Alert className="bg-yellow-500/10 border-yellow-500/20">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                    <AlertTitle className="text-yellow-600">PAN not linked with Aadhaar</AlertTitle>
                                    <AlertDescription className="text-yellow-600 text-sm">
                                        As per Income Tax rules, please link your PAN with Aadhaar within 30 days.
                                        <a href="https://www.incometax.gov.in/iec/foportal/help/how-to-link-aadhaar" target="_blank" rel="noopener noreferrer" className="underline ml-1 inline-flex items-center gap-1">
                                            How to link? <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {panAadhaarLinked === true && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                    <CheckCircle2 className="h-4 w-4" />
                                    PAN-Aadhaar linked
                                </div>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding/mobile-verify')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button onClick={handleContinue} disabled={!canContinue}>
                    Continue to Video KYC
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
