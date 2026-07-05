"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EditContact() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [contact, setContact] = useState({ userName: "", email: "", message: "" });
  const router = useRouter();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/admin/getContactMessage/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setContact(data);
      } catch (error) {
        console.error("Error fetching contact details: ", error);
      }
    };

    if (token) fetchContact();
  }, [id, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setContact((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/updateContactMessage/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contact),
        },
      );
      if (response.ok) {
        router.push("/admin/contacts");
      }
    } catch (error) {
      console.error("Error updating contact details: ", error);
    }
  };

  return (
    <section className="edit-user-section">
      <div className="container">
        <h2>Edit Contact</h2>
        <form onSubmit={handleSubmit}>
          <label>
            User Name:
            <input
              type="text"
              name="userName"
              value={contact.userName}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Message:
            <input
              type="text"
              name="message"
              value={contact.message}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Update Contact</button>
        </form>
      </div>
    </section>
  );
}
