"use client";

import * as React from "react";
import {
    Search,
    Plus,
    MoreHorizontal,
    Edit,
    Trash,
    Download,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { mockUsers } from "@/lib/mock-data";
import { User, UserRole, KYCStatus } from "@/types";

function getRoleBadge(role: UserRole) {
    switch (role) {
        case "admin":
            return <Badge className="bg-purple-500/10 text-purple-500">Admin</Badge>;
        case "agent":
            return <Badge className="bg-blue-500/10 text-blue-500">Agent</Badge>;
        default:
            return <Badge variant="secondary">User</Badge>;
    }
}

function getKYCStatusBadge(status: KYCStatus) {
    switch (status) {
        case "verified":
            return <Badge className="bg-green-500/10 text-green-500">Verified</Badge>;
        case "pending":
            return <Badge className="bg-yellow-500/10 text-yellow-500">Pending</Badge>;
        case "failed":
            return <Badge variant="destructive">Failed</Badge>;
        case "in_progress":
            return <Badge className="bg-blue-500/10 text-blue-500">In Progress</Badge>;
        default:
            return <Badge variant="secondary">Not Started</Badge>;
    }
}

export default function AdminUsersPage() {
    const [users] = React.useState<User[]>(mockUsers);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [showAddDialog, setShowAddDialog] = React.useState(false);
    const [newUser, setNewUser] = React.useState({
        name: "",
        email: "",
        role: "user" as UserRole,
    });

    const filteredUsers = React.useMemo(() => {
        if (!searchQuery) return users;
        const query = searchQuery.toLowerCase();
        return users.filter(
            u => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
        );
    }, [users, searchQuery]);

    const handleAddUser = () => {
        if (!newUser.name || !newUser.email) {
            toast.error("Please fill in all required fields");
            return;
        }
        toast.success("User added", {
            description: `${newUser.name} has been added successfully.`,
        });
        setShowAddDialog(false);
        setNewUser({ name: "", email: "", role: "user" });
    };

    const handleDeleteUser = (user: User) => {
        toast.success("User deleted", {
            description: `${user.name} has been removed.`,
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Users</h1>
                    <p className="text-muted-foreground">
                        Manage all platform users.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New User</DialogTitle>
                                <DialogDescription>
                                    Create a new user account.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="John Doe"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Select
                                        value={newUser.role}
                                        onValueChange={(value: UserRole) => setNewUser({ ...newUser, role: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User</SelectItem>
                                            <SelectItem value="agent">Agent</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleAddUser}>Add User</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Users</CardTitle>
                            <CardDescription>{filteredUsers.length} users found</CardDescription>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search users..."
                                className="pl-8"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>KYC Status</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.slice(0, 20).map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar} alt={user.name} />
                                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-xs text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                                    <TableCell>{getKYCStatusBadge(user.kycStatus)}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {user.createdAt.toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive"
                                                    onClick={() => handleDeleteUser(user)}
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
