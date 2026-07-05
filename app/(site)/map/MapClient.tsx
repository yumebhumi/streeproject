"use client";

import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useAuth, Incident } from "@/store/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const categoryLabels: Record<string, string> = {
  mistreatment: "Mistreatment",
  hooligans: "Hooligans",
  "cat-calling": "Cat-calling",
  "shady-area": "Shady Area",
};

const formatDate = (value: string) => new Date(value).toLocaleDateString();

export default function MapClient() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [category, setCategory] = useState("");
  const { token } = useAuth();

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
        const response = await axios.get<Incident[]>(
          `${backendUrl}/api/incidents/getAllIncidents`,
          config,
        );
        setIncidents(response.data);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    if (token) {
      fetchIncidents();
    }
  }, [token]);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((incident) =>
      category ? incident.category === category : true,
    );
  }, [category, incidents]);

  const summary = useMemo(() => {
    const counts = filteredIncidents.reduce<Record<string, number>>(
      (accumulator, incident) => {
        accumulator[incident.category] =
          (accumulator[incident.category] || 0) + 1;
        return accumulator;
      },
      {},
    );

    const topCategory = Object.entries(counts).sort(
      (left, right) => right[1] - left[1],
    )[0];
    const latestIncident = [...filteredIncidents].sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime(),
    )[0];

    return {
      total: filteredIncidents.length,
      topCategory: topCategory ? categoryLabels[topCategory[0]] : "No data",
      latestDate: latestIncident ? formatDate(latestIncident.date) : "No reports",
    };
  }, [filteredIncidents]);

  return (
    <div className="relative z-10 flex min-h-screen flex-col bg-slate-50 px-4 pb-8 pt-[84px]">
      <div className="mx-auto w-full max-w-6xl">
        <div className="mb-6">
          <h2 className="text-4xl font-semibold text-slate-900">Published Incident Map</h2>
          <p className="mt-2 text-sm text-slate-600">
            Only admin-reviewed reports appear here. Submitted and rejected reports stay off the public map.
          </p>
        </div>

        <div className="mb-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Published incidents</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.total}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Most common category</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.topCategory}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Latest report date</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{summary.latestDate}</p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">
          <label className="text-sm font-medium text-slate-700" htmlFor="category-filter">
            Filter by category
          </label>
          <select
            id="category-filter"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-md border border-slate-300 p-2 text-sm"
          >
            <option value="">All published incidents</option>
            <option value="mistreatment">Mistreatment</option>
            <option value="hooligans">Hooligans</option>
            <option value="cat-calling">Cat-calling</option>
            <option value="shady-area">Shady Area</option>
          </select>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            Showing published reports only
          </span>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-[480px] border-b border-slate-200">
            <MapContainer center={[29.95488, 76.819534]} zoom={15} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
              />
              {filteredIncidents.map((incident) => (
                <Marker
                  key={incident._id}
                  position={[
                    incident.location.coordinates[1],
                    incident.location.coordinates[0],
                  ]}
                  eventHandlers={{ click: () => setSelectedIncident(incident) }}
                >
                  <Popup>{categoryLabels[incident.category] || incident.category}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          <div className="p-5">
            {selectedIncident ? (
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Incident details</h3>
                <p className="mt-3 text-sm text-slate-700"><strong>Description:</strong> {selectedIncident.description}</p>
                <p className="mt-2 text-sm text-slate-700"><strong>Category:</strong> {categoryLabels[selectedIncident.category] || selectedIncident.category}</p>
                <p className="mt-2 text-sm text-slate-700"><strong>Date:</strong> {formatDate(selectedIncident.date)}</p>
                <p className="mt-2 text-sm text-slate-700"><strong>Time:</strong> {selectedIncident.time}</p>
                <p className="mt-2 text-sm text-slate-700"><strong>Reported by:</strong> {selectedIncident.isAnonymous ? "Anonymous" : selectedIncident.name || "Anonymous"}</p>
                <p className="mt-2 text-sm text-slate-700"><strong>Status:</strong> Published</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Select a marker to view incident details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
