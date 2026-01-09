import { useEffect, useState } from "react";
import { getProfileById } from "../api/profile.api";
import "../styles/profileDetailsModal.css";

export default function ProfileDetailsModal({ profileId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileById(profileId);

      if (res.success) {
        setProfile(res.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-backdrop">
      <div className="profile-modal">
        <div className="modal-header">
          <h3>Profile Details</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {loading && <p className="loading">Loading...</p>}
        {error && <p className="error">{error}</p>}

        {profile && (
          <div className="profile-grid">
            <div><b>Username:</b> {profile.username}</div>
            <div><b>Email:</b> {profile.email}</div>
            <div><b>Gender:</b> {profile.gender}</div>
            <div><b>DOB:</b> {profile.dob}</div>
            <div><b>Country:</b> {profile.country}</div>
            <div><b>State:</b> {profile.state}</div>
            <div><b>City:</b> {profile.city}</div>
            <div><b>Verified:</b> {profile.is_user_verified ? "Yes" : "No"}</div>
          </div>
        )}
      </div>
    </div>
  );
}