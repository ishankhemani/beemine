import { useEffect, useState } from "react";
import {
  getProfileVerifications,
  updateProfileVerification,
} from "../api/profileVerification.api";
import { getProfile } from "../api/profile.api";
import VerificationModal from "../components/VerificationModal";
import "../styles/profileVerification.css";

export default function ProfileVerification() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // Full Profile Modal States
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
  const limit = 10;

  const fetchVerifications = async (pageNo = 1) => {
    try {
      const res = await getProfileVerifications(pageNo, limit);
      if (res?.success) {
        setList(res.data || []);
        setPagination(res.pagination || { page: pageNo, total_pages: 1 });
      } else {
        setList([]);
        setPagination({ page: pageNo, total_pages: 1 });
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setList([]);
      setPagination({ page: pageNo, total_pages: 1 });
    }
  };

  useEffect(() => {
    fetchVerifications(page);
  }, [page]);

  const openProfileModal = async (profile_id) => {
    try {
      setProfileLoading(true);
      const res = await getProfile(profile_id);
      if (res.success) setSelectedProfile(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAction = async (verificationId, action) => {
    if (!verificationId) return;

    setLoading(true);
    const remarks =
      action === "approved"
        ? "Selfie clear, document verified, face matched"
        : "Document unclear or face mismatch";

    try {
      await updateProfileVerification({
        verification_id: verificationId,
        action,
        remarks,
      });

      setList((prev) =>
        prev.filter((item) => item.verification_id !== verificationId)
      );
      setSelected(null);
    } catch (err) {
      console.error("FULL ERROR OBJECT:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-verification">
      <h2>Profile Verification</h2>
      <p>Review pending profile verification requests.</p>

      {/* ===============================
          VERIFICATION CARDS GRID
      ================================ */}
      <div className="pv-grid">
  {list.map((item) => (
    <div className="pv-card" key={item.verification_id}>
      {/* DOCUMENT PREVIEW */}
      <div className="pv-doc-preview">
        {item.document_url ? (
          <img src={item.document_url} alt="Document" />
        ) : (
          <div className="pv-doc-placeholder">No Document</div>
        )}
      </div>

      {/* USER INFO */}
      <h4
        className="profile-link clickable"
        onClick={() => openProfileModal(item.profile_id)}
      >
        {item.username}
      </h4>

      <p>
        {item.city}, {item.state}
      </p>

      <p>
        <b>Method:</b> {item.document_type}
      </p>

      <button onClick={() => setSelected(item)}>Verify</button>
    </div>
  ))}
</div>


      {/* ===============================
          PAGINATION
      ================================ */}
      <div className="pv-pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Prev
        </button>

        <span>
          Page {pagination.page} of {pagination.total_pages}
        </span>

        <button
          disabled={page === pagination.total_pages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* ===============================
          VERIFICATION MODAL
      ================================ */}
      <VerificationModal
        data={selected}
        onClose={() => setSelected(null)}
        onSubmit={handleAction}
        loading={loading}
      />

      {/* PROFILE MODAL */}
      {selectedProfile && (
        <div className="user-modal-backdrop">
          <div className="user-modal">
            <div className="modal-header">
              <h3>Profile Details</h3>
              <button onClick={() => setSelectedProfile(null)}>✕</button>
            </div>

            {profileLoading ? (
              <div>Loading profile…</div>
            ) : (
              <div className="modal-body">
                <div className="modal-grid">
                  <div>
                    <b>Profile ID:</b> {selectedProfile.profile_id}
                  </div>
                  <div>
                    <b>User ID:</b> {selectedProfile.user_id}
                  </div>
                  <div>
                    <b>Username:</b> {selectedProfile.username}
                  </div>
                  <div>
                    <b>Email:</b> {selectedProfile.email}
                  </div>
                  <div>
                    <b>Gender:</b> {selectedProfile.gender}
                  </div>
                  <div>
                    <b>Interested Gender:</b>{" "}
                    {selectedProfile.interested_gender}
                  </div>
                  <div>
                    <b>DOB:</b> {selectedProfile.dob}
                  </div>
                  <div>
                    <b>Age:</b> {selectedProfile.age}
                  </div>
                  <div>
                    <b>Country:</b> {selectedProfile.country}
                  </div>
                  <div>
                    <b>State:</b> {selectedProfile.state}
                  </div>
                  <div>
                    <b>City:</b> {selectedProfile.city}
                  </div>
                  <div>
                    <b>Marital Status:</b> {selectedProfile.marital_status}
                  </div>
                  <div>
                    <b>Sexual Orientation:</b>{" "}
                    {selectedProfile.sexual_orientation}
                  </div>
                  <div>
                    <b>Occupation:</b> {selectedProfile.occupation || "-"}
                  </div>
                  <div>
                    <b>Height:</b> {selectedProfile.height || "-"}
                  </div>
                  <div>
                    <b>Income:</b> {selectedProfile.income}
                  </div>
                  <div>
                    <b>Ethnicity:</b> {selectedProfile.ethnicity}
                  </div>
                  <div>
                    <b>Body Shape:</b> {selectedProfile.body_shape}
                  </div>
                  <div>
                    <b>Eye Color:</b> {selectedProfile.eye_color}
                  </div>
                  <div>
                    <b>Hair Color:</b> {selectedProfile.hair_color}
                  </div>
                  <div>
                    <b>Has Children:</b>{" "}
                    {selectedProfile.has_children ? "Yes" : "No"}
                  </div>
                  <div>
                    <b>Smoker:</b> {selectedProfile.smoker ? "Yes" : "No"}
                  </div>
                  <div>
                    <b>Verified:</b>{" "}
                    {selectedProfile.is_user_verified ? "Yes" : "No"}
                  </div>
                  <div>
                    <b>Deleted:</b>{" "}
                    {selectedProfile.is_deleted ? "Yes" : "No"}
                  </div>
                  <div>
                    <b>Last Online:</b> {selectedProfile.last_online}
                  </div>
                  <div>
                    <b>Created At:</b> {selectedProfile.user_created_at}
                  </div>
                  <div>
                    <b>Description:</b> {selectedProfile.description || "-"}
                  </div>
                  <div>
                    <b>Personality Traits:</b>{" "}
                    {selectedProfile.personality_traits?.join(", ") || "-"}
                  </div>
                  <div>
                    <b>Hobbies:</b> {selectedProfile.hobbies?.join(", ") || "-"}
                  </div>
                  <div>
                    <b>Sports:</b> {selectedProfile.sports?.join(", ") || "-"}
                  </div>
                  <div>
                    <b>Relationship Types:</b>{" "}
                    {selectedProfile.relationship_types?.join(", ") || "-"}
                  </div>
                  <div>
                    <b>Looking For:</b>{" "}
                    {selectedProfile.i_am_looking_for?.join(", ") || "-"}
                  </div>

                  {/* PHOTOS GRID */}
                  {selectedProfile.photos?.length > 0 && (
                    <div className="photos-section">
                      <h4>Photos</h4>
                      <div className="photos-grid">
                        {selectedProfile.photos.map((photo, idx) => (
                          <img
                            key={idx}
                            src={photo.photo_url}
                            alt={`Photo ${idx + 1}`}
                            onClick={() => setLightboxPhoto(photo.photo_url)}
                            title={
                              photo.is_profile
                                ? "Profile Photo"
                                : photo.is_private
                                ? "Private Photo"
                                : "Public Photo"
                            }
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

      {/* PHOTO LIGHTBOX */}
      {lightboxPhoto && (
        <div
          className="photo-lightbox active"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            className="close-btn"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxPhoto(null);
            }}
          >
            &times;
          </button>
          <img src={lightboxPhoto} alt="enlarged photo" />
        </div>
      )}
    </div>
  );
}
