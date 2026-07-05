"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/store/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

export default function EditIncident() {
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const [incident, setIncident] = useState({
    description: "",
    category: "mistreatment",
    date: "",
    time: "",
    latitude: "" as number | string,
    longitude: "" as number | string,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchIncident = async () => {
      try {
        const response = await fetch(
          `${backendUrl}/api/admin/getIncident/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );
        const data = await response.json();
        setIncident({
          description: data.description,
          category: data.category,
          date: data.date.split("T")[0],
          time: data.time,
          latitude: data.location.coordinates[1],
          longitude: data.location.coordinates[0],
        });
      } catch (error) {
        console.error("Error fetching incident details: ", error);
      }
    };

    if (token) fetchIncident();
  }, [id, token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setIncident((prevIncident) => ({ ...prevIncident, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedIncident = {
      ...incident,
      location: {
        type: "Point",
        coordinates: [incident.longitude, incident.latitude],
      },
    };
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/updateIncident/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedIncident),
        },
      );
      if (response.ok) {
        router.push("/admin/incidents");
      }
    } catch (error) {
      console.error("Error updating incident details: ", error);
    }
  };

  return (
    <section className="edit-incident-section">
      <div className="container">
        <h2>Edit Incident</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Description:
            <textarea
              name="description"
              value={incident.description}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Category:
            <select
              name="category"
              value={incident.category}
              onChange={handleInputChange}
              required
            >
              <option value="mistreatment">Mistreatment</option>
              <option value="hooligans">Hooligans</option>
              <option value="cat-calling">Cat-calling</option>
              <option value="shady-area">Shady Area</option>
            </select>
          </label>
          <label>
            Date:
            <input
              type="date"
              name="date"
              value={incident.date}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Time:
            <input
              type="time"
              name="time"
              value={incident.time}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Latitude:
            <input
              type="text"
              name="latitude"
              value={incident.latitude}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Longitude:
            <input
              type="text"
              name="longitude"
              value={incident.longitude}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit">Update Incident</button>
        </form>
      </div>
    </section>
  );
}
