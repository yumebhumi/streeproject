"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EditUser() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [user, setUser] = useState({ userName: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/admin/getUser/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details: ", error);
      }
    };

    if (token) fetchUser();
  }, [id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${backendUrl}/api/admin/updateUser/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        router.push("/admin/users");
      }
    } catch (error) {
      console.error("Error updating user details: ", error);
    }
  };

  return (
    <section className="edit-user-section">
      <div className="container">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <label>
            User Name:
            <input
              type="text"
              name="userName"
              value={user.userName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Update User</button>
        </form>
      </div>
    </section>
  );
}
