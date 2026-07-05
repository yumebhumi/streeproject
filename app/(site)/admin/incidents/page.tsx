"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/store/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

interface AdminIncident {
  _id: string;
  category: string;
  description: string;
  date: string;
  time: string;
  status: string;
  isAnonymous: boolean;
  name?: string;
  user?: { userName?: string; email?: string };
  location: { type: string; coordinates: number[] };
}

export default function AdminIncidents() {
  const { token } = useAuth();
  const [incidents, setIncidents] = useState<AdminIncident[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const getAllUsersIncidents = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/admin/getAllIncidents`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setIncidents(data);
    } catch (error) {
      console.error("Error fetching incidents: ", error);
    }
  };

  const updateIncidentStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(
        `${backendUrl}/api/admin/updateIncident/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        },
      );
      if (response.ok) {
        getAllUsersIncidents();
      }
    } catch (error) {
      console.error("Error updating incident: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      getAllUsersIncidents();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredIncidents = incidents.filter((incident) =>
    statusFilter === "all" ? true : incident.status === statusFilter,
  );

  return (
    <section className="admin-users-section bg-slate-50">
      <div className="container flex items-center justify-between gap-4">
        <div>
          <h1>Incident Moderation Queue</h1>
          <p className="mt-2 text-sm text-slate-600">
            Review submitted reports and decide which ones become visible on the public map.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="submitted">Submitted</option>
          <option value="published">Published</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <div className="container admin-users">
        <table>
          <thead>
            <tr>
              <th className="username-column">Reporter</th>
              <th className="category-column">Category</th>
              <th className="description-column">Description</th>
              <th className="date-column">Date</th>
              <th className="time-column">Status</th>
              <th className="location-column">Location</th>
              <th className="update-column">Moderate</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((incident, index) => {
              const reporterName = incident.isAnonymous
                ? "Anonymous"
                : incident.name || incident.user?.userName || "Unknown";
              return (
                <tr key={index}>
                  <td>{reporterName}</td>
                  <td>{incident.category}</td>
                  <td>{incident.description}</td>
                  <td>{incident.date.split("T")[0]}</td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        incident.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : incident.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </td>
                  <td>
                    {incident.location.coordinates[0]}, {incident.location.coordinates[1]}
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="edit-delete"
                        onClick={() => updateIncidentStatus(incident._id, "published")}
                        disabled={incident.status === "published"}
                      >
                        Publish
                      </button>
                      <button
                        className="edit-delete"
                        onClick={() => updateIncidentStatus(incident._id, "rejected")}
                        disabled={incident.status === "rejected"}
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
