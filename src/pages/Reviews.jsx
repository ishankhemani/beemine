
import { useEffect, useState } from "react";
import {
  getAppReviewVerifications,
  updateAppReviewStatus,
} from "../api/appReviewVerification.api";
import { getProfile } from "../api/profile.api";
import "../styles/Reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1 });
  const limit = 10;

  const loadReviews = async (pageNo = 1) => {
    setLoading(true);
    try {
      const res = await getAppReviewVerifications(pageNo, limit);
      if (res?.success) {
        setReviews(res.data || []);
        setPagination(res.pagination || { page: pageNo, total_pages: 1 });
      } else {
        setReviews([]);
        setPagination({ page: pageNo, total_pages: 1 });
      }
    } catch (err) {
      console.error("Error loading reviews:", err);
      setReviews([]);
      setPagination({ page: pageNo, total_pages: 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews(page);
  }, [page]);

  const handleAction = async (review_id, action) => {
    try {
      const res = await updateAppReviewStatus({
        review_id,
        action,
        remarks: action === "approve" ? "Approved" : "Rejected",
      });
      alert(res.message);
      loadReviews(page);
    } catch (err) {
      console.error("Error updating review:", err);
      alert("Failed to update review status");
    }
  };

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

  if (loading) return <p className="loading">Loading reviews...</p>;

  return (
    <div className="reviews-page">
      <h1 className="page-title">Review Verification</h1>

      {(reviews || []).map((r) => (
        <div key={r.review_id} className="review-card">
          {/* HEADER */}
          <div className="review-header">
            <div>
              <h3
                className="username clickable"
                onClick={() => openProfileModal(r.profile_id)}
              >
                {r.username}
              </h3>
              <span className={`status ${r.status}`}>
                {r.status.replace("_", " ")}
              </span>
            </div>

            {r.status === "in_review" && (
              <div className="review-actions">
                <button
                  className="btn approve"
                  onClick={() => handleAction(r.review_id, "approve")}
                >
                  Grant Coins
                </button>
                <button
                  className="btn reject"
                  onClick={() => handleAction(r.review_id, "reject")}
                >
                  Reject
                </button>
              </div>
            )}
          </div>

          {/* BODY */}
          <div className="review-body">
            <div className="review-text">
              {r.review_text || "No text review provided"}
            </div>

            {/* ✅ REWARD COINS (NUMBER) */}
            <div className="reward-coins">
              <b>Reward Coins:</b>{" "}
              <span>{r.reward_coins ?? 0}</span>
            </div>

            {r.screenshot_url && (
              <div className="image-wrapper">
                <img
                  src={r.screenshot_url}
                  alt="Review Screenshot"
                  className="review-thumbnail"
                  onClick={() => setPreviewImage(r.screenshot_url)}
                />
              </div>
            )}
          </div>

          <div className="review-footer">{r.created_at}</div>
        </div>
      ))}

      {/* PAGINATION */}
      <div className="reviews-pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {pagination.page} of {pagination.total_pages}
        </span>
        <button
          disabled={page === pagination.total_pages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

      {/* IMAGE LIGHTBOX */}
      {previewImage && (
        <div className="photo-lightbox" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" />
        </div>
      )}

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
          {/* KEEP ALL YOUR ORIGINAL GRID FIELDS */}
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
          </div>

          {/* PHOTOS GRID - ONLY CHANGE IS CLICK LIGHTBOX */}
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
                    title={photo.is_profile ? "Profile Photo" : photo.is_private ? "Private Photo" : "Public Photo"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  </div>
)}


      {/* PHOTO LIGHTBOX */}
      {lightboxPhoto && (
        <div className="photo-lightbox active" onClick={() => setLightboxPhoto(null)}>
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
