"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { MdMyLocation } from "react-icons/md";
import { useAuth } from "@/store/auth";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

const containerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "row",
  paddingTop: "40px",
  minHeight: "100vh",
  width: "100vw",
  position: "relative",
  zIndex: 1,
};

const formContainerStyles: React.CSSProperties = {
  flex: 2,
  padding: "20px",
  color: "#fff",
};

const mapContainerStyles: React.CSSProperties = {
  flex: 5,
  borderRadius: "8px",
  overflow: "hidden",
};

const formStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const fieldContainer: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
};

const labelStyles: React.CSSProperties = {
  fontSize: "10px",
  marginBottom: "5px",
  color: "#555",
};

const textareaStyles: React.CSSProperties = {
  padding: "10px",
  fontSize: "14px",
  borderRadius: "4px",
  height: "100px",
};

const smallButtonStyles: React.CSSProperties = {
  padding: "5px 10px",
  fontSize: "14px",
  borderRadius: "4px",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const inputStyles: React.CSSProperties = {
  padding: "10px",
  fontSize: "10px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  flex: "1",
};

const buttonStyles: React.CSSProperties = {
  padding: "8px",
  fontSize: "9px",
  borderRadius: "4px",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const submitButtonStyles: React.CSSProperties = {
  padding: "10px 20px",
  fontSize: "15px",
  borderRadius: "8px",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const locationTextStyles: React.CSSProperties = {
  fontSize: "12px",
  color: "grey",
};

export default function IncidentFormClient() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("mistreatment");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submitMessage, setSubmitMessage] = useState("");
  const { user, token } = useAuth();

  useEffect(() => {
    if (user?.userName) {
      setName(user.userName);
    }
  }, [user]);

  const detectLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });
  };

  const setToday = () => {
    const today = new Date();
    setDate(today.toISOString().split("T")[0]);
  };

  const setNow = () => {
    const now = new Date();
    setTime(now.toTimeString().split(" ")[0].slice(0, 5));
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (event) => {
        setLatitude(event.latlng.lat);
        setLongitude(event.latlng.lng);
      },
    });

    return null;
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitMessage("");

    if (latitude === null || longitude === null) {
      alert("Please select a valid location on the map.");
      return;
    }

    const newIncident = {
      name,
      description,
      category,
      date,
      time,
      isAnonymous,
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      await axios.post(`${backendUrl}/api/incidents/addIncident`, newIncident, config);
      setSubmitMessage("Incident submitted. It will appear on the map after admin review.");
      setDescription("");
      setCategory("mistreatment");
      setDate("");
      setTime("");
      setLatitude(null);
      setLongitude(null);
      setIsAnonymous(true);
    } catch (error) {
      console.error("Error saving incident:", error);
      setSubmitMessage("Unable to submit incident right now. Please try again.");
    }
  };

  return (
    <div style={containerStyles}>
      <div style={formContainerStyles} className="bg-white shadow-lg">
        <h2 style={{ textAlign: "center" }} className="m-3 text-xl text-gray-900">Report an Incident</h2>
        <form onSubmit={onSubmit} style={formStyles}>
          <div style={fieldContainer}>
            <label style={labelStyles}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isAnonymous}
              style={inputStyles}
              className="border border-white bg-gray-800 outline-none focus:border-pink-400 focus:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <label className="rounded-md border border-pink-200 bg-pink-50 p-3 text-sm text-gray-700">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
              />
              <span>Submit anonymously</span>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Your report is stored with your account for moderation, but your name will stay hidden when this is enabled.
            </p>
          </label>

          <div style={fieldContainer}>
            <label style={labelStyles}>Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              style={textareaStyles}
              className="border border-white bg-gray-800 outline-none focus:bg-gray-900"
            />
          </div>

          <div style={fieldContainer}>
            <label style={labelStyles}>Category</label>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
              style={inputStyles}
              className="bg-gray-800 focus:bg-gray-900"
            >
              <option value="mistreatment">Mistreatment</option>
              <option value="hooligans">Hooligans</option>
              <option value="cat-calling">Cat-calling</option>
              <option value="shady-area">Shady Area</option>
            </select>
          </div>

          <div style={fieldContainer}>
            <label style={labelStyles}>Date</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
                style={{ ...inputStyles, flex: "1" }}
                className="bg-gray-800 focus:bg-gray-900"
              />
              <button type="button" onClick={setToday} style={smallButtonStyles} className="bg-pink-500">
                Today
              </button>
            </div>
          </div>

          <div style={fieldContainer}>
            <label style={labelStyles}>Time</label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
                style={{ ...inputStyles, flex: "1" }}
                className="bg-gray-800 focus:bg-gray-900"
              />
              <button type="button" onClick={setNow} style={smallButtonStyles} className="bg-pink-500">
                Now
              </button>
            </div>
          </div>

          <div style={fieldContainer}>
            <label style={labelStyles}>Location</label>
            <button
              type="button"
              onClick={detectLocation}
              style={buttonStyles}
              className="bg-pink-500"
            >
              Detect My Location <MdMyLocation className="mx-1 inline-block text-xl hover:bg-pink-600" />
            </button>
            <p style={locationTextStyles} className="m-0 mt-1 text-xs">
              {latitude && longitude
                ? `Latitude: ${latitude}, Longitude: ${longitude}`
                : "Click on the map to set a location"}
            </p>
          </div>

          {submitMessage ? (
            <p className={`rounded-md p-3 text-sm ${submitMessage.startsWith("Incident submitted") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
              {submitMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={!latitude || !longitude}
            style={submitButtonStyles}
            className="bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit
          </button>
        </form>
      </div>

      <div style={mapContainerStyles}>
        <MapContainer
          center={[29.95488, 76.819534]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          />
          <MapClickHandler />
          {latitude && longitude ? <Marker position={[latitude, longitude]} /> : null}
        </MapContainer>
      </div>
    </div>
  );
}
