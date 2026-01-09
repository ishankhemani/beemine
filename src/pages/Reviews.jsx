
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

  /* 🔴 NEW STATES */
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    const res = await getAppReviewVerifications(1, 10);
    if (res?.success) setReviews(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleAction = async (review_id, action) => {
    const res = await updateAppReviewStatus({
      review_id,
      action,
      remarks: action === "approve" ? "Approved" : "Rejected",
    });
    alert(res.message);
    loadReviews();
  };

  /* 🔥 NEW: FETCH PROFILE */
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

      {reviews.map((r) => (
        <div key={r.review_id} className="review-card">
          {/* HEADER */}
          <div className="review-header">
            <div>
              {/* 🔥 CLICKABLE USERNAME */}
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

      {/* IMAGE MODAL */}
      {previewImage && (
        <div className="image-modal" onClick={() => setPreviewImage(null)}>
          <img src={previewImage} alt="Preview" />
        </div>
      )}

      {/* 🔥 PROFILE MODAL */}
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
              <div className="modal-grid">
                <div><b>Username:</b> {selectedProfile.username}</div>
                <div><b>Gender:</b> {selectedProfile.gender}</div>
                <div><b>DOB:</b> {selectedProfile.dob}</div>
                <div><b>Country:</b> {selectedProfile.country}</div>
                <div><b>State:</b> {selectedProfile.state}</div>
                <div><b>City:</b> {selectedProfile.city}</div>
                <div><b>Occupation:</b> {selectedProfile.occupation || "-"}</div>
                <div><b>Description:</b> {selectedProfile.description || "-"}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}