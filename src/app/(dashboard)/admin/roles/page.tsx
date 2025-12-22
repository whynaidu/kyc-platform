"use client";

import * as React from "react";
import { Plus, Edit, Users, Shield } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Role, PermissionModule } from "@/types";

const modules: { id: PermissionModule; label: string }[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "kyc", label: "KYC Verification" },
    { id: "video_kyc", label: "Video KYC" },
    { id: "users", label: "User Management" },
    { id: "agents", label: "Agent Management" },
    { id: "analytics", label: "Analytics" },
    { id: "settings", label: "Settings" },
    { id: "roles", label: "Roles & Permissions" },
];

const initialRoles: Role[] = [
    {
        id: "admin",
        name: "Administrator",
        description: "Full access to all features and settings",
        userCount: 3,
        createdAt: new Date(),
        permissions: modules.map(m => ({ module: m.id, actions: ["view", "create", "edit", "delete"] })),
    },
    {
        id: "agent",
        name: "Verification Agent",
        description: "Can process KYC verifications and video calls",
        userCount: 12,
        createdAt: new Date(),
        permissions: [
            { module: "dashboard", actions: ["view"] },
            { module: "kyc", actions: ["view", "create", "edit"] },
            { module: "video_kyc", actions: ["view", "create", "edit"] },
            { module: "analytics", actions: ["view"] },
        ],
    },
    {
        id: "user",
        name: "Standard User",
        description: "Can complete their own KYC verification",
        userCount: 40,
        createdAt: new Date(),
        permissions: [
            { module: "dashboard", actions: ["view"] },
            { module: "kyc", actions: ["view", "create"] },
            { module: "video_kyc", actions: ["view", "create"] },
        ],
    },
];

export default function AdminRolesPage() {
    const [roles] = React.useState<Role[]>(initialRoles);
    const [showEditDialog, setShowEditDialog] = React.useState(false);
    const [showCreateDialog, setShowCreateDialog] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState<Role | null>(null);
    const [newRole, setNewRole] = React.useState({ name: "", description: "" });
    const [permissions, setPermissions] = React.useState<Record<PermissionModule, boolean>>({
        dashboard: true,
        kyc: false,
        video_kyc: false,
        users: false,
        agents: false,
        analytics: false,
        settings: false,
        roles: false,
    });

    const handleEditRole = (role: Role) => {
        setSelectedRole(role);
        const perms: Record<PermissionModule, boolean> = {} as Record<PermissionModule, boolean>;
        modules.forEach(m => {
            perms[m.id] = role.permissions.some(p => p.module === m.id);
        });
        setPermissions(perms);
        setShowEditDialog(true);
    };

    const handleSavePermissions = () => {
        toast.success("Permissions updated", {
            description: `${selectedRole?.name} permissions have been saved.`,
        });
        setShowEditDialog(false);
    };

    const handleCreateRole = () => {
        if (!newRole.name) {
            toast.error("Please enter a role name");
            return;
        }
        toast.success("Role created", {
            description: `${newRole.name} has been created.`,
        });
        setShowCreateDialog(false);
        setNewRole({ name: "", description: "" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
                    <p className="text-muted-foreground">
                        Manage user roles and their permissions.
                    </p>
                </div>
                <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Role
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create New Role</DialogTitle>
                            <DialogDescription>
                                Define a new user role with specific permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="roleName">Role Name</Label>
                                <Input
                                    id="roleName"
                                    placeholder="e.g., Senior Agent"
                                    value={newRole.name}
                                    onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="roleDesc">Description</Label>
                                <Textarea
                                    id="roleDesc"
                                    placeholder="Describe this role's responsibilities..."
                                    value={newRole.description}
                                    onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleCreateRole}>Create Role</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Role Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                    <Card key={role.id}>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                    <Shield className="h-5 w-5 text-primary" />
                                </div>
                                <Button variant="ghost" size="icon" onClick={() => handleEditRole(role)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle className="mt-2">{role.name}</CardTitle>
                            <CardDescription>{role.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Users className="h-4 w-4" />
                                <span>{role.userCount} users</span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {role.permissions.slice(0, 4).map((perm) => (
                                    <Badge key={perm.module} variant="secondary" className="text-xs capitalize">
                                        {perm.module.replace("_", " ")}
                                    </Badge>
                                ))}
                                {role.permissions.length > 4 && (
                                    <Badge variant="secondary" className="text-xs">
                                        +{role.permissions.length - 4} more
                                    </Badge>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Permissions Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit Permissions</DialogTitle>
                        <DialogDescription>
                            Configure module access for {selectedRole?.name}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        {modules.map((module) => (
                            <div key={module.id} className="flex items-center justify-between">
                                <Label htmlFor={module.id} className="cursor-pointer">
                                    {module.label}
                                </Label>
                                <Switch
                                    id={module.id}
                                    checked={permissions[module.id]}
                                    onCheckedChange={(checked) =>
                                        setPermissions({ ...permissions, [module.id]: checked })
                                    }
                                />
                            </div>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSavePermissions}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
