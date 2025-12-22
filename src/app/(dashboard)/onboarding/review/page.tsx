"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit2, CheckCircle2, Shield, Calendar, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { maskAadhaar } from "@/lib/validators/aadhaar";
import { maskAccountNumber } from "@/lib/validators/indian-patterns";

export default function ReviewPage() {
    const router = useRouter();
    const [confirmed, setConfirmed] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    // Load saved data
    const [data, setData] = React.useState<{
        mobile: string;
        email: string;
        aadhaar: string;
        pan: string;
        kycType: string;
        address: Record<string, string>;
        bank: Record<string, string>;
    } | null>(null);

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const mobile = localStorage.getItem('onboarding_mobile') || '+91 9876543210';
            const email = localStorage.getItem('onboarding_email') || 'user@example.com';
            const aadhaar = localStorage.getItem('onboarding_aadhaar') || '234567890123';
            const pan = localStorage.getItem('onboarding_pan') || 'ABCPS1234K';
            const kycType = localStorage.getItem('onboarding_kyc_type') || 'full_kyc';
            const address = JSON.parse(localStorage.getItem('onboarding_address') || '{}');
            const bank = JSON.parse(localStorage.getItem('onboarding_bank') || '{}');

            setData({ mobile, email, aadhaar, pan, kycType, address, bank });
        }
    }, []);

    const handleSubmit = async () => {
        setSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        router.push('/onboarding/success');
    };

    if (!data) {
        return <div className="flex items-center justify-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    const isFullKyc = data.kycType === 'full_kyc';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Review & Submit</h2>
                <p className="text-muted-foreground">समीक्षा और सबमिट करें</p>
            </div>

            <p className="text-sm text-muted-foreground">
                Please review all your information before submitting. Click on any section to expand and verify.
            </p>

            {/* Review Sections */}
            <Accordion type="single" collapsible className="space-y-2" defaultValue="personal">
                {/* Personal Info */}
                <AccordionItem value="personal" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Personal Information</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Mobile</span>
                                <span>{data.mobile}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span>{data.email}</span>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push('/onboarding/mobile-verify')}>
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Identity Documents */}
                <AccordionItem value="identity" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Identity Documents</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Aadhaar</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono">{maskAadhaar(data.aadhaar)}</span>
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">PAN</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono">{data.pan}</span>
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">PAN-Aadhaar</span>
                                <Badge className="text-xs bg-green-500">Linked</Badge>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push('/onboarding/identity-verify')}>
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Video KYC */}
                <AccordionItem value="video" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Video KYC</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <Badge className="bg-green-500">Completed</Badge>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Session Date</span>
                                <span>{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Verified By</span>
                                <span>Priya Singh (Agent #1234)</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Address */}
                <AccordionItem value="address" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Address</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                        <div className="space-y-2 text-sm">
                            {data.address.locality && (
                                <p>
                                    {[data.address.flatNo, data.address.building, data.address.street, data.address.locality, data.address.landmark].filter(Boolean).join(', ')}
                                </p>
                            )}
                            <p>
                                {[data.address.city, data.address.district, data.address.state].filter(Boolean).join(', ')}
                                {data.address.pincode && ` - ${data.address.pincode}`}
                            </p>
                            {!data.address.locality && <p className="text-muted-foreground">Address from Aadhaar</p>}
                        </div>
                        <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push('/onboarding/address-verify')}>
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </Button>
                    </AccordionContent>
                </AccordionItem>

                {/* Bank Account */}
                <AccordionItem value="bank" className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <span>Bank Account</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Bank</span>
                                <span>{data.bank.bankName || 'HDFC Bank'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-muted-foreground">Account</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono">{maskAccountNumber(data.bank.accountNumber || '50100123456789')}</span>
                                    <Badge variant="secondary" className="text-xs">Verified</Badge>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" className="mt-3" onClick={() => router.push('/onboarding/bank-link')}>
                            <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </Button>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* KYC Summary */}
            <Card className="bg-primary/5 border-primary/20">
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Your KYC Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm">KYC Type</span>
                        <Badge variant={isFullKyc ? 'default' : 'secondary'}>
                            {isFullKyc ? 'Full KYC (Video-based)' : 'OTP-based eKYC (Limited)'}
                        </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm">Risk Category</span>
                        <Badge className="bg-green-500">Low Risk</Badge>
                    </div>
                    <hr />
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>Maximum Balance: {isFullKyc ? 'Unlimited' : '₹1,00,000'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>KYC Validity: {isFullKyc ? '10 years' : '1 year'}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Final Confirmation */}
            <div className="flex items-start gap-3 p-4 rounded-lg border">
                <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(checked) => setConfirmed(checked as boolean)}
                />
                <Label htmlFor="confirm" className="text-sm cursor-pointer">
                    I confirm that all the information provided is correct and complete. I understand that providing false information may result in my application being rejected.
                </Label>
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding/bank-link')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button onClick={handleSubmit} disabled={!confirmed || submitting} size="lg">
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Submitting...
                        </>
                    ) : (
                        'Submit Application'
                    )}
                </Button>
            </div>
        </div>
    );
}
