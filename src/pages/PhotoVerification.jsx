import { useEffect, useState } from "react";
import {
  getPhotoVerifications,
  updatePhotoVerification,
} from "../api/PhotoVerification.api";
import { getProfile } from "../api/profile.api";
import VerificationModal from "../components/VerificationModal";
import "../styles/photoVerification.css";

export default function PhotoVerification() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });

  // profile modal
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // lightbox
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  useEffect(() => {
    fetchPhotos(page);
  }, [page]);

  const fetchPhotos = async (pageNo) => {
    try {
      const res = await getPhotoVerifications(pageNo, 10);
      if (res?.success) {
        setList(res.data || []);
        setPagination(res.pagination || { page: pageNo, total_pages: 1 });
      }
    } catch (err) {
      console.error("Fetch photos error:", err);
    }
  };

  const openProfileModal = async (profile_id) => {
    try {
      setProfileLoading(true);
      const res = await getProfile(profile_id);
      if (res.success) setSelectedProfile(res.data);
    } catch (err) {
      alert("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAction = async (photoId, action) => {
    setLoading(true);
    try {
      await updatePhotoVerification({
        photo_id: photoId,
        action,
        reason:
          action === "approve"
            ? "Photo verified successfully"
            : "Photo rejected",
      });
      fetchPhotos(page);
      setSelected(null);
    } catch (err) {
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="photo-verification">
      <h2>Photo Verification</h2>
      <p>Compare profile photos with verification selfies.</p>

      {/* LIST */}
      <div className="pv-list">
        {list.map((item) => (
          <div className="pv-item" key={item.photo_id}>
            <div>
              <h4
                className="clickable"
                onClick={() => openProfileModal(item.profile_id)}
              >
                {item.username}
              </h4>
              <span>
                Submitted {new Date(item.uploaded_at).toLocaleString()}
              </span>
            </div>
            <button onClick={() => setSelected(item)}>Verify</button>
          </div>
        ))}
      </div>

      {/* PAGINATION - ALWAYS AT BOTTOM */}
      <div className="pv-pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>
          Page {pagination?.page || page} of {pagination?.total_pages || 1}
        </span>
        <button
          disabled={page === (pagination?.total_pages || 1)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

      {/* PHOTO VERIFICATION MODAL */}
      {selected && (
        <div className="pv-modal-backdrop">
          <div className="pv-modal">
            <div className="pv-modal-header">
              <h3>Photo Verification</h3>
              <button onClick={() => setSelected(null)}>✕</button>
            </div>

            <div className="pv-info">
              <p><b>Username:</b> {selected.username}</p>
              <p><b>Gender:</b> {selected.gender}</p>
              <p><b>DOB:</b> {selected.dob}</p>
              <p><b>Country:</b> {selected.country}</p>
              <p><b>State:</b> {selected.state}</p>
              <p><b>City:</b> {selected.city}</p>
              <p>
                <b>Uploaded At:</b>{" "}
                {new Date(selected.uploaded_at).toLocaleString()}
              </p>
            </div>

            <div className="photo-images">
              <div>
                <p>Uploaded Photo</p>
                <img
                  src={selected.photo_url}
                  alt="Verification"
                  onClick={() => setLightboxPhoto(selected.photo_url)}
                />
              </div>
              
            </div>

            <div className="photo-actions">
              <button
                className="reject"
                disabled={loading}
                onClick={() => handleAction(selected.photo_id, "reject")}
              >
                Reject
              </button>
              <button
                className="approve"
                disabled={loading}
                onClick={() => handleAction(selected.photo_id, "approve")}
              >
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FULL PROFILE MODAL */}
      {selectedProfile && (
        <div className="user-modal-backdrop">
          <div className="user-modal">
            <div className="modal-header">
              <h3>Profile Details</h3>
              <button onClick={() => setSelectedProfile(null)}>✕</button>
            </div>

            {profileLoading ? (
              <p>Loading profile...</p>
            ) : (
              <div className="modal-body">
                <div className="modal-grid">
                  <div><b>Profile ID:</b> {selectedProfile.profile_id}</div>
                  <div><b>User ID:</b> {selectedProfile.user_id}</div>
                  <div><b>Username:</b> {selectedProfile.username}</div>
                  <div><b>Email:</b> {selectedProfile.email}</div>
                  <div><b>Gender:</b> {selectedProfile.gender}</div>
                  <div><b>Interested Gender:</b> {selectedProfile.interested_gender}</div>
                  <div><b>DOB:</b> {selectedProfile.dob}</div>
                  <div><b>Age:</b> {selectedProfile.age}</div>
                  <div><b>Country:</b> {selectedProfile.country}</div>
                  <div><b>State:</b> {selectedProfile.state}</div>
                  <div><b>City:</b> {selectedProfile.city}</div>
                  <div><b>Marital Status:</b> {selectedProfile.marital_status}</div>
                  <div><b>Sexual Orientation:</b> {selectedProfile.sexual_orientation}</div>
                  <div><b>Occupation:</b> {selectedProfile.occupation || "-"}</div>
                  <div><b>Height:</b> {selectedProfile.height || "-"}</div>
                  <div><b>Income:</b> {selectedProfile.income}</div>
                  <div><b>Ethnicity:</b> {selectedProfile.ethnicity}</div>
                  <div><b>Body Shape:</b> {selectedProfile.body_shape}</div>
                  <div><b>Eye Color:</b> {selectedProfile.eye_color}</div>
                  <div><b>Hair Color:</b> {selectedProfile.hair_color}</div>
                  <div><b>Has Children:</b> {selectedProfile.has_children ? "Yes" : "No"}</div>
                  <div><b>Smoker:</b> {selectedProfile.smoker ? "Yes" : "No"}</div>
                  <div><b>Verified:</b> {selectedProfile.is_user_verified ? "Yes" : "No"}</div>
                  <div><b>Deleted:</b> {selectedProfile.is_deleted ? "Yes" : "No"}</div>
                  <div><b>Last Online:</b> {selectedProfile.last_online}</div>
                  <div><b>Created At:</b> {selectedProfile.user_created_at}</div>
                  <div><b>Description:</b> {selectedProfile.description || "-"}</div>
                  <div><b>Personality Traits:</b> {selectedProfile.personality_traits?.join(", ") || "-"}</div>
                  <div><b>Hobbies:</b> {selectedProfile.hobbies?.join(", ") || "-"}</div>
                  <div><b>Sports:</b> {selectedProfile.sports?.join(", ") || "-"}</div>
                  <div><b>Relationship Types:</b> {selectedProfile.relationship_types?.join(", ") || "-"}</div>
                  <div><b>Looking For:</b> {selectedProfile.i_am_looking_for?.join(", ") || "-"}</div>

                  {selectedProfile.photos?.length > 0 && (
                    <div className="photos-section">
                      <h4>Photos</h4>
                      <div className="photos-grid">
                        {selectedProfile.photos.map((p, i) => (
                          <img
                            key={i}
                            src={p.photo_url}
                            alt={`Photo ${i + 1}`}
                            onClick={() => setLightboxPhoto(p.photo_url)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxPhoto && (
        <div
          className="pv-image-lightbox"
          onClick={() => setLightboxPhoto(null)}
        >
          <img src={lightboxPhoto} alt="Preview" />
        </div>
      )}
    </div>
  );
}
