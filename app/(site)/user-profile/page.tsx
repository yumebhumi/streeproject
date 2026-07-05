"use client";

import { useAuth, Incident } from "@/store/auth";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const { user, getUserIncidents } = useAuth();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.userName ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  useEffect(() => {
    const fetchIncidents = async () => {
      const fetchedIncidents = await getUserIncidents();
      setIncidents(fetchedIncidents || []);
    };

    fetchIncidents();
  }, [getUserIncidents]);

  return (
    <div className="user-profile">
      <h1>USER PROFILE</h1>
      <div className="profile-info">
        <div className="profile-image">
          <img
            src={
              user?.profileImage ||
              "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
            }
            alt="User Avatar"
          />
        </div>
        <div className="profile-details">
          <p><strong>User Name:</strong> {name}</p>
          <p><strong>Email:</strong> {email}</p>
        </div>
      </div>

      <div className="incidents-list">
        <h2>Incidents Reported</h2>
        <div className="grid-two-cols">
          {incidents.length > 0 ? (
            incidents.map((currElement, index) => {
              const { date, time, category, location, description } = currElement;
              const formattedDate = new Date(date).toISOString().slice(0, 10);

              return (
                <div className="incidents" key={index}>
                  <h3>{category}</h3>
                  <div className="grid-two-cols">
                    <small>{formattedDate}</small>
                    <small>{time}</small>
                  </div>
                  <p>{description}</p>
                  <div className="grid-two-cols">
                    <small>Latitude: {location.coordinates[0]} </small>
                    <small>Longitude: {location.coordinates[1]} </small>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No incidents reported.</p>
          )}
        </div>
      </div>
    </div>
  );
}
