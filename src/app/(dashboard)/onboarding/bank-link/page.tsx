"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, CheckCircle2, Building2, CreditCard, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateIFSC, validateAccountNumber } from "@/lib/validators/indian-patterns";
import { getBankByIFSC } from "@/lib/constants/indian-banks";

export default function BankLinkPage() {
    const router = useRouter();

    const [ifsc, setIfsc] = React.useState("");
    const [accountNumber, setAccountNumber] = React.useState("");
    const [confirmAccount, setConfirmAccount] = React.useState("");
    const [accountHolderName, setAccountHolderName] = React.useState("");
    const [accountType, setAccountType] = React.useState<'savings' | 'current'>('savings');
    const [verificationMethod, setVerificationMethod] = React.useState<'penny_drop' | 'upi' | 'cheque'>('penny_drop');

    const [bankName, setBankName] = React.useState("");
    const [branchName, setBranchName] = React.useState("");
    const [fetchingBank, setFetchingBank] = React.useState(false);

    const [verifying, setVerifying] = React.useState(false);
    const [verified, setVerified] = React.useState(false);
    const [nameMatchScore, setNameMatchScore] = React.useState<number | null>(null);

    const handleIfscChange = async (value: string) => {
        const cleanIfsc = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 11);
        setIfsc(cleanIfsc);

        if (cleanIfsc.length === 11 && validateIFSC(cleanIfsc)) {
            setFetchingBank(true);
            await new Promise(resolve => setTimeout(resolve, 800));

            const bank = getBankByIFSC(cleanIfsc);
            if (bank) {
                setBankName(bank.name);
                setBranchName(cleanIfsc.slice(5) + ' Branch');
            } else {
                setBankName('Unknown Bank');
                setBranchName(cleanIfsc.slice(5) + ' Branch');
            }
            setFetchingBank(false);
        } else {
            setBankName('');
            setBranchName('');
        }
    };

    const accountsMatch = accountNumber && confirmAccount && accountNumber === confirmAccount;
    const isFormValid = validateIFSC(ifsc) && validateAccountNumber(accountNumber) && accountsMatch && accountHolderName.length > 2;

    const handleVerify = async () => {
        setVerifying(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setVerified(true);
        setNameMatchScore(Math.floor(Math.random() * 15) + 85); // 85-100%
        setVerifying(false);
    };

    const handleContinue = () => {
        localStorage.setItem('onboarding_bank', JSON.stringify({
            ifsc,
            accountNumber,
            bankName,
            branchName,
            accountType,
            accountHolderName,
        }));
        router.push('/onboarding/review');
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold">Link Your Bank Account</h2>
                <p className="text-muted-foreground">बैंक खाता लिंक करें</p>
            </div>

            {/* Bank Details */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Bank Account Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* IFSC */}
                    <div className="space-y-2">
                        <Label htmlFor="ifsc">IFSC Code *</Label>
                        <div className="relative">
                            <Input
                                id="ifsc"
                                placeholder="SBIN0001234"
                                value={ifsc}
                                onChange={(e) => handleIfscChange(e.target.value)}
                                disabled={verified}
                                className="uppercase font-mono"
                            />
                            {fetchingBank && (
                                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
                            )}
                        </div>
                        {ifsc.length === 11 && !validateIFSC(ifsc) && (
                            <p className="text-xs text-destructive">Invalid IFSC format</p>
                        )}
                    </div>

                    {/* Auto-filled Bank Details */}
                    {bankName && (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label>Bank Name</Label>
                                <Input value={bankName} disabled className="bg-muted" />
                            </div>
                            <div className="space-y-2">
                                <Label>Branch</Label>
                                <Input value={branchName} disabled className="bg-muted" />
                            </div>
                        </div>
                    )}

                    {/* Account Number */}
                    <div className="space-y-2">
                        <Label htmlFor="account">Account Number *</Label>
                        <Input
                            id="account"
                            type="password"
                            inputMode="numeric"
                            placeholder="Enter account number"
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 18))}
                            disabled={verified}
                        />
                    </div>

                    {/* Confirm Account */}
                    <div className="space-y-2">
                        <Label htmlFor="confirmAccount">Confirm Account Number *</Label>
                        <Input
                            id="confirmAccount"
                            inputMode="numeric"
                            placeholder="Re-enter account number"
                            value={confirmAccount}
                            onChange={(e) => setConfirmAccount(e.target.value.replace(/\D/g, '').slice(0, 18))}
                            disabled={verified}
                        />
                        {confirmAccount && (
                            <p className={`text-xs ${accountsMatch ? 'text-green-600' : 'text-destructive'}`}>
                                {accountsMatch ? '✓ Account numbers match' : '✗ Account numbers do not match'}
                            </p>
                        )}
                    </div>

                    {/* Account Type */}
                    <div className="space-y-2">
                        <Label>Account Type *</Label>
                        <RadioGroup value={accountType} onValueChange={(v) => setAccountType(v as any)} disabled={verified}>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="savings" id="savings" />
                                    <Label htmlFor="savings" className="cursor-pointer">Savings Account</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <RadioGroupItem value="current" id="current" />
                                    <Label htmlFor="current" className="cursor-pointer">Current Account</Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </div>

                    {/* Account Holder Name */}
                    <div className="space-y-2">
                        <Label htmlFor="holderName">Account Holder Name *</Label>
                        <Input
                            id="holderName"
                            placeholder="As per bank records"
                            value={accountHolderName}
                            onChange={(e) => setAccountHolderName(e.target.value.toUpperCase())}
                            disabled={verified}
                            className="uppercase"
                        />
                        <p className="text-xs text-muted-foreground">Must match the name on your KYC documents</p>
                    </div>
                </CardContent>
            </Card>

            {/* Verification Method */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Verification Method
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <RadioGroup value={verificationMethod} onValueChange={(v) => setVerificationMethod(v as any)} disabled={verified}>
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <RadioGroupItem value="penny_drop" id="penny_drop" />
                            <Label htmlFor="penny_drop" className="cursor-pointer flex-1">
                                <p className="font-medium">Instant Verification (₹1 deposit)</p>
                                <p className="text-xs text-muted-foreground">We&apos;ll send ₹1 to verify your account</p>
                            </Label>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <RadioGroupItem value="upi" id="upi" />
                            <Label htmlFor="upi" className="cursor-pointer flex-1">
                                <p className="font-medium">UPI Verification</p>
                                <p className="text-xs text-muted-foreground">Approve a ₹1 collect request from your UPI app</p>
                            </Label>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg border">
                            <RadioGroupItem value="cheque" id="cheque" />
                            <Label htmlFor="cheque" className="cursor-pointer flex-1">
                                <p className="font-medium">Upload Cancelled Cheque</p>
                                <p className="text-xs text-muted-foreground">Manual verification (takes 1-2 business days)</p>
                            </Label>
                        </div>
                    </RadioGroup>

                    {!verified && (
                        <Button onClick={handleVerify} disabled={!isFormValid || verifying} className="w-full">
                            {verifying ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify Bank Account'
                            )}
                        </Button>
                    )}

                    {verified && (
                        <>
                            <Alert className="bg-green-500/10 border-green-500/20">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertDescription className="text-green-600">
                                    Bank account verified successfully
                                </AlertDescription>
                            </Alert>

                            {nameMatchScore && (
                                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted">
                                    <span>Name Match Score</span>
                                    <span className={`font-medium ${nameMatchScore >= 90 ? 'text-green-600' : 'text-yellow-600'}`}>
                                        {nameMatchScore}%
                                    </span>
                                </div>
                            )}

                            {nameMatchScore && nameMatchScore < 90 && (
                                <Alert className="bg-yellow-500/10 border-yellow-500/20">
                                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                    <AlertTitle className="text-yellow-600">Name Mismatch</AlertTitle>
                                    <AlertDescription className="text-yellow-600 text-sm">
                                        The account holder name doesn&apos;t exactly match your KYC name. This may require manual verification.
                                    </AlertDescription>
                                </Alert>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={() => router.push('/onboarding/address-verify')}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>
                <Button onClick={handleContinue} disabled={!verified}>
                    Continue to Review
                    <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    );
}
