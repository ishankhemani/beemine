import "../styles/photoVerification.css";

export default function PhotoVerificationModal({
  data,
  onClose,
  onSubmit,
  loading,
}) {
  if (!data) return null;

  return (
    <div className="pv-modal-backdrop">
      <div className="pv-modal large">
        <div className="pv-modal-header">
          <h3>Photo Verification</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="pv-compare">
          <div className="pv-photo-box">
            <p>Profile Photo</p>
            <img src={data.photo_url} alt="Profile" />
          </div>

          <div className="pv-photo-box highlight">
            <p>Verification Selfie</p>
            <img src={data.photo_url} alt="Selfie" />
            <span className="match-badge">Match: 98%</span>
          </div>
        </div>

        <div className="pv-info">
          <p><b>Username:</b> {data.username}</p>
          <p><b>Email:</b> {data.email}</p>
          <p><b>Gender:</b> {data.gender}</p>
          <p>
            <b>Location:</b> {data.city}, {data.state},{" "}
            {data.country}
          </p>
        </div>

        <div className="pv-actions">
          <button
            className="reject"
            disabled={loading}
            onClick={() =>
              onSubmit(data.photo_id, "reject")
            }
          >
            Reject
          </button>

          <button
            className="approve"
            disabled={loading}
            onClick={() =>
              onSubmit(data.photo_id, "approve")
            }
          >
            Verify Match
          </button>
        </div>
      </div>
    </div>
  );
}