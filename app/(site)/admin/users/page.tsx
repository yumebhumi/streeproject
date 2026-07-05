"use client";

import React, { useEffect, useState } from "react";
import { useAuth, AuthUser } from "@/store/auth";
import Link from "next/link";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function AdminUsers() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);

  const getAllUsersData = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/getAllUsers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users data: ", error);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/deleteUser/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        getAllUsersData();
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      getAllUsersData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <section className="admin-users-section">
      <div className="container">
        <h2>Users Data</h2>
      </div>
      <div className="container admin-users">
        <table>
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.userName}</td>
                <td>{user.email}</td>
                <td>
                  <Link href={`/admin/users/${user._id}/edit`} className="edit-delete">
                    <button className="edit-delete">Edit</button>
                  </Link>
                </td>
                <td>
                  <button className="edit-delete" onClick={() => deleteUser(user._id as string)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
