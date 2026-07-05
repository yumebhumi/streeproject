"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";
import Link from "next/link";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface ContactMessage {
  _id: string;
  userName: string;
  email: string;
  message: string;
}

export default function AdminContacts() {
  const { token } = useAuth();
  const [contacts, setContacts] = useState<ContactMessage[]>([]);

  const getAllUsersContacts = async () => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/getAllContactMessages`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const data = await response.json();
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts: ", error);
    }
  };

  const deleteContacts = async (id: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/deleteContactMessage/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (response.ok) {
        getAllUsersContacts();
      }
    } catch (error) {
      console.error("Error deleting contact: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      getAllUsersContacts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <section className="admin-users-section">
      <div className="container">
        <h1>Contacts Data</h1>
      </div>
      <div className="container admin-users">
        <table>
          <thead>
            <tr>
              <th className="contact-name-col">User Name</th>
              <th className="contact-email-col">Email</th>
              <th className="contact-msg-col">Message</th>
              <th className="contact-msg-col">Edit</th>
              <th className="contact-msg-col">Delete</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact, index) => (
              <tr key={index}>
                <td>{contact.userName}</td>
                <td>{contact.email}</td>
                <td>{contact.message}</td>
                <td>
                  <Link href={`/admin/contacts/${contact._id}/edit`} className="edit-delete">
                    <button className="edit-delete">Edit</button>
                  </Link>
                </td>
                <td>
                  <button className="edit-delete" onClick={() => deleteContacts(contact._id)}>
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
