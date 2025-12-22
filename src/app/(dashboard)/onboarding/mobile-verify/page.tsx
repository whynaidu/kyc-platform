"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Phone, Mail, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OTPInput } from "@/components/onboarding/otp-input";
import { validateMobile } from "@/lib/validators/indian-patterns";

export default function MobileVerifyPage() {
    const router = useRouter();

    // Form State
    const [mobile, setMobile] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [mobileOtp, setMobileOtp] = React.useState("");
    const [emailOtp, setEmailOtp] = React.useState("");

    // OTP State
    const [mobileOtpSent, setMobileOtpSent] = React.useState(false);
    const [emailOtpSent, setEmailOtpSent] = React.useState(false);
    const [mobileVerified, setMobileVerified] = React.useState(false);
    const [emailVerified, setEmailVerified] = React.useState(false);

    // Timer State
    const [mobileResendTimer, setMobileResendTimer] = React.useState(0);
    const [emailResendTimer, setEmailResendTimer] = React.useState(0);

    // Loading State
    const [sendingMobileOtp, setSendingMobileOtp] = React.useState(false);
    const [sendingEmailOtp, setSendingEmailOtp] = React.useState(false);
    const [verifyingMobile, setVerifyingMobile] = React.useState(false);
    const [verifyingEmail, setVerifyingEmail] = React.useState(false);

    // Consent State
    const [termsAccepted, setTermsAccepted] = React.useState(false);
    const [privacyAccepted, setPrivacyAccepted] = React.useState(false);
    const [aadhaarConsent, setAadhaarConsent] = React.useState(false);

    // Define handlers before useEffect to avoid "used before defined" error
    const handleVerifyMobileOtp = React.useCallback(async () => {
        setVerifyingMobile(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setMobileVerified(true);
        setVerifyingMobile(false);
    }, []);

    const handleVerifyEmailOtp = React.useCallback(async () => {
        setVerifyingEmail(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setEmailVerified(true);
        setVerifyingEmail(false);
    }, []);

    const handleSendMobileOtp = async () => {
        if (!validateMobile(mobile)) return;

        setSendingMobileOtp(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMobileOtpSent(true);
        setMobileResendTimer(45);
        setSendingMobileOtp(false);
    };

    const handleSendEmailOtp = async () => {
        if (!email.includes('@')) return;

        setSendingEmailOtp(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setEmailOtpSent(true);
        setEmailResendTimer(45);
        setSendingEmailOtp(false);
    };

    // Timer Effect
    React.useEffect(() => {
        if (mobileResendTimer > 0) {
            const timer = setTimeout(() => setMobileResendTimer(mobileResendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [mobileResendTimer]);

    React.useEffect(() => {
        if (emailResendTimer > 0) {
            const timer = setTimeout(() => setEmailResendTimer(emailResendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [emailResendTimer]);

    // Auto-verify when OTP is complete
    React.useEffect(() => {
        if (mobileOtp.length === 6 && mobileOtpSent && !mobileVerified) {
            handleVerifyMobileOtp();
        }
    }, [mobileOtp, mobileOtpSent, mobileVerified, handleVerifyMobileOtp]);

    React.useEffect(() => {
        if (emailOtp.length === 6 && emailOtpSent && !emailVerified) {
            handleVerifyEmailOtp();
        }
    }, [emailOtp, emailOtpSent, emailVerified, handleVerifyEmailOtp]);

    const canContinue = mobileVerified && emailVerified && termsAccepted && privacyAccepted && aadhaarConsent;

    const handleContinue = () => {
        // Save to localStorage for demo
        localStorage.setItem('onboarding_mobile', mobile);
        localStorage.setItem('onboarding_email', email);
        router.push('/onboarding/identity-verify');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Verify Your Contact Details</h2>
                <p className="text-muted-foreground">अपना संपर्क विवरण सत्यापित करें</p>
            </div>

            {/* Mobile Number */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Mobile Number / मोबाइल नंबर
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <div className="flex items-center px-3 bg-muted rounded-md border text-sm font-medium">
                            +91
                        </div>
                        <Input
                            type="tel"
                            placeholder="98765 43210"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            disabled={mobileVerified}
                            className="flex-1"
                        />
                        {!mobileOtpSent && (
                            <Button
                                onClick={handleSendMobileOtp}
                                disabled={mobile.length !== 10 || !validateMobile(mobile) || sendingMobileOtp}
                            >
                                {sendingMobileOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                            </Button>
                        )}
                    </div>

                    {mobileOtpSent && !mobileVerified && (
                        <div className="space-y-3">
                            <Label>Enter OTP / ओटीपी दर्ज करें</Label>
                            <OTPInput
                                value={mobileOtp}
                                onChange={setMobileOtp}
                                disabled={verifyingMobile}
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {mobileResendTimer > 0
                                        ? `Resend in ${mobileResendTimer}s`
                                        : <Button variant="link" className="p-0 h-auto" onClick={handleSendMobileOtp}>Resend OTP</Button>
                                    }
                                </span>
                                {verifyingMobile && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                        </div>
                    )}

                    {mobileVerified && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-600">Mobile verified successfully</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Email */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address / ईमेल पता
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={emailVerified}
                            className="flex-1"
                        />
                        {!emailOtpSent && (
                            <Button
                                onClick={handleSendEmailOtp}
                                disabled={!email.includes('@') || sendingEmailOtp}
                            >
                                {sendingEmailOtp ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send OTP'}
                            </Button>
                        )}
                    </div>

                    {emailOtpSent && !emailVerified && (
                        <div className="space-y-3">
                            <Label>Enter OTP / ओटीपी दर्ज करें</Label>
                            <OTPInput
                                value={emailOtp}
                                onChange={setEmailOtp}
                                disabled={verifyingEmail}
                            />
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {emailResendTimer > 0
                                        ? `Resend in ${emailResendTimer}s`
                                        : <Button variant="link" className="p-0 h-auto" onClick={handleSendEmailOtp}>Resend OTP</Button>
                                    }
                                </span>
                                {verifyingEmail && <Loader2 className="h-4 w-4 animate-spin" />}
                            </div>
                        </div>
                    )}

                    {emailVerified && (
                        <Alert className="bg-green-500/10 border-green-500/20">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-600">Email verified successfully</AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Consents */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base">Consent & Agreements</CardTitle>
                    <CardDescription>सहमति और समझौते</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                        />
                        <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                            I agree to the <a href="#" className="text-primary underline">Terms & Conditions</a>
                        </Label>
                    </div>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="privacy"
                            checked={privacyAccepted}
                            onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                        />
                        <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                            I agree to the <a href="#" className="text-primary underline">Privacy Policy</a>
                        </Label>
                    </div>

                    <div className="flex items-start gap-3">
                        <Checkbox
                            id="aadhaar"
                            checked={aadhaarConsent}
                            onCheckedChange={(checked) => setAadhaarConsent(checked as boolean)}
                        />
                        <Label htmlFor="aadhaar" className="text-sm leading-relaxed cursor-pointer">
                            I hereby voluntarily consent to submit my Aadhaar number, demographic data, and biometric data for authentication as per UIDAI guidelines.
                            <span className="block text-muted-foreground mt-1">
                                मैं यूआईडीएआई दिशानिर्देशों के अनुसार प्रमाणीकरण के लिए अपना आधार नंबर, जनसांख्यिकीय डेटा और बायोमेट्रिक डेटा जमा करने के लिए सहमति देता हूं।
                            </span>
                        </Label>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button onClick={handleContinue} disabled={!canContinue}>
                    Continue to Identity
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
