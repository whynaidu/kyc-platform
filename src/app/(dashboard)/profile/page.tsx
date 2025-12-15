"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Shield,
    Edit,
    Camera,
    CheckCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { getCurrentUser } from "@/lib/auth";
import { AuthUser } from "@/types";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editForm, setEditForm] = React.useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    React.useEffect(() => {
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            setEditForm({
                name: currentUser.name,
                email: currentUser.email,
                phone: "+1 (555) 123-4567",
                address: "123 Main Street, San Francisco, CA 94102",
            });
        }
    }, []);

    const handleSave = () => {
        toast.success("Profile updated", {
            description: "Your profile has been saved successfully.",
        });
        setIsEditing(false);
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and preferences.
                </p>
            </div>

            {/* Profile Header Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="relative group">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="text-3xl">
                                    {user.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute bottom-0 right-0 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Camera className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl font-bold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-3">
                                <Badge variant="secondary" className="capitalize">{user.role}</Badge>
                                {user.kycStatus === "verified" && (
                                    <Badge className="bg-green-500/10 text-green-500">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        KYC Verified
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <Button onClick={() => setIsEditing(true)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Personal Information
                    </CardTitle>
                    <CardDescription>Your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">Full Name</Label>
                            <p className="font-medium">{editForm.name}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">Email</Label>
                            <p className="font-medium">{editForm.email}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">Phone</Label>
                            <p className="font-medium">{editForm.phone}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">Address</Label>
                            <p className="font-medium">{editForm.address}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Account Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Account Information
                    </CardTitle>
                    <CardDescription>Your account details and security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">User ID</Label>
                            <p className="font-medium font-mono text-sm">{user.id}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">Role</Label>
                            <p className="font-medium capitalize">{user.role}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">Member Since</Label>
                            <p className="font-medium">{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-muted-foreground text-sm">KYC Status</Label>
                            <Badge
                                className={
                                    user.kycStatus === "verified"
                                        ? "bg-green-500/10 text-green-500"
                                        : user.kycStatus === "pending"
                                            ? "bg-yellow-500/10 text-yellow-500"
                                            : "bg-red-500/10 text-red-500"
                                }
                            >
                                {user.kycStatus}
                            </Badge>
                        </div>
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                        <Button variant="outline">Change Password</Button>
                        <Button variant="outline">Two-Factor Auth</Button>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your personal information.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={editForm.name}
                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                value={editForm.phone}
                                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                value={editForm.address}
                                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
