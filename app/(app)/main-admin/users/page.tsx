"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ManageClubsModal from "@/components/main-admin/ManageClubsModal";
import { getUsers } from "@/lib/api/mainAdmin";
import { UserSummary } from "@/lib/types/mainAdmin";

import { getToken } from "@/lib/auth";

export default function MainAdminUsersPage() {

    const [users, setUsers] =
        useState<UserSummary[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [search, setSearch] =
        useState("");

    const [roleFilter, setRoleFilter] =
        useState("");
    
    const [selectedUser, setSelectedUser] =
    useState<UserSummary | null>(null);

    const [modalOpen, setModalOpen] =
    useState(false);

    const token =
        getToken() ?? "";

    useEffect(() => {

        loadUsers();

    }, [roleFilter]);

    async function loadUsers() {

        try {

            const data =
                await getUsers(
                    token,
                    roleFilter || undefined
                );

            setUsers(data);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }

    const filteredUsers =
        useMemo(() => {

            return users.filter(user =>

                user.name
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                user.email
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );

        }, [users, search]);

    if (loading) {

        return <div>Loading...</div>;

    }

    return (

        <>

            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">

                <h1 className="text-3xl font-bold mb-6">

                    User Management

                </h1>

                <div className="flex gap-4 mb-6">

                    <input

                        type="text"

                        placeholder="Search user..."

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        className="border rounded px-3 py-2 flex-1"

                    />

                    <select

                        value={roleFilter}

                        onChange={(e) =>
                            setRoleFilter(e.target.value)
                        }

                        className="border rounded px-3 py-2"

                    >

                        <option value="">
                            All Roles
                        </option>

                        <option value="STUDENT">
                            Student
                        </option>

                        <option value="ALUMNI">
                            Alumni
                        </option>

                        <option value="FACULTY">
                            Faculty
                        </option>

                        <option value="ADMIN">
                            Admin
                        </option>

                    </select>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full border">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="p-3 text-left">
                                    Name
                                </th>

                                <th className="p-3 text-left">
                                    Email
                                </th>

                                <th className="p-3 text-left">
                                    Role
                                </th>

                                <th className="p-3 text-left">
                                    Status
                                </th>

                                <th className="p-3 text-left">
                                    Club Manager
                                </th>

                                <th className="p-3 text-left">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredUsers.map(user => (

                                    <tr
                                        key={user.id}
                                        className="border-t"
                                    >

                                        <td className="p-3">
                                            {user.name}
                                        </td>

                                        <td className="p-3">
                                            {user.email}
                                        </td>

                                        <td className="p-3">
                                            {user.role}
                                        </td>

                                        <td className="p-3">
                                            {user.accountStatus}
                                        </td>

                                        <td className="p-3">

                                            {

                                                user.clubManager

                                                    ? "🟢 Yes"

                                                    : "—"

                                            }

                                        </td>

                                        <td className="p-3">

                                            <button

    onClick={() => {

        setSelectedUser(user);

        setModalOpen(true);

    }}

    className="
    bg-blue-600
    text-white
    px-3
    py-1
    rounded
    hover:bg-blue-700
    "

>

    Manage Clubs

</button>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

            </div>
            {

    selectedUser && (

        <ManageClubsModal

            open={modalOpen}

            onClose={() => {

                setModalOpen(false);

                setSelectedUser(null);

                loadUsers();

            }}

            userId={selectedUser.id}

            userName={selectedUser.name}

            token={token}

        />

    )

}
            <Footer />

        </>

    );

}