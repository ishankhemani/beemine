import { useEffect, useState } from "react";
import { getProfileById } from "../api/profile.api";
import "../styles/profileDetailsModal.css";

export default function ProfileDetailsModal({ profileId, onClose }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (profileId) fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getProfileById(profileId);

      if (res?.success) {
        setProfile(res.data); // ✅ EXACT DATA OBJECT
      } else {
        setError("Failed to fetch profile");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-modal-overlay">
      <div className="profile-modal">
        {/* HEADER */}
        <div className="profile-modal-header">
          <h3>Profile Details</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="profile-modal-body">
          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          {profile && (
            <>
              {/* LEFT INFO */}
              <div className="profile-info">
                <Info label="Profile ID" value={profile.profile_id} />
                <Info label="User ID" value={profile.user_id} />
                <Info label="Username" value={profile.username} />
                <Info label="Email" value={profile.email} />
                <Info label="Gender" value={profile.gender} />
                <Info label="Interested Gender" value={profile.interested_gender} />
                <Info label="DOB" value={profile.dob} />
                <Info label="Age" value={profile.age} />
                <Info label="Country" value={profile.country} />
                <Info label="State" value={profile.state} />
                <Info label="City" value={profile.city} />
                <Info label="Marital Status" value={profile.marital_status} />
                <Info label="Sexual Orientation" value={profile.sexual_orientation} />
                <Info label="Occupation" value={profile.occupation} />
                <Info label="Height" value={profile.height} />
                <Info label="Income" value={profile.income} />
                <Info label="Ethnicity" value={profile.ethnicity} />
                <Info label="Body Shape" value={profile.body_shape} />
                <Info label="Eye Color" value={profile.eye_color} />
                <Info label="Hair Color" value={profile.hair_color} />
                <Info label="Has Children" value={profile.has_children ? "Yes" : "No"} />
                <Info label="Smoker" value={profile.smoker ? "Yes" : "No"} />
                <Info label="Verified" value={profile.is_user_verified ? "Yes" : "No"} />
                <Info label="Deleted" value={profile.is_deleted ? "Yes" : "No"} />
                <Info label="Last Online" value={profile.last_online} />
                <Info label="Created At" value={profile.user_created_at} />
              </div>

              {/* RIGHT SIDE */}
              <div className="profile-description">
                <Section title="About">
                  <p>{profile.description || "—"}</p>
                </Section>

                <Section title="Personality Traits">
                  <TagList items={profile.personality_traits} />
                </Section>

                <Section title="Hobbies">
                  <TagList items={profile.hobbies} />
                </Section>

                <Section title="Sports">
                  <TagList items={profile.sports} />
                </Section>

                <Section title="Relationship Types">
                  <TagList items={profile.relationship_types} />
                </Section>

                <Section title="Looking For">
                  <TagList items={profile.i_am_looking_for} />
                </Section>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="profile-modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Info({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{String(value)}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section">
      <h4>{title}</h4>
      {children}
    </div>
  );
}

function TagList({ items }) {
  if (!Array.isArray(items) || items.length === 0) return <p>—</p>;

  return (
    <div className="tag-list">
      {items.map((item, index) => (
        <span key={index} className="tag">{item}</span>
      ))}
    </div>
  );
}
