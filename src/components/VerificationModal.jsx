

import "../styles/profileVerification.css";

export default function VerificationModal({
  data,
  onClose,
  onSubmit,
  loading,
}) {
  if (!data) return null;

  return (
    <div className="pv-modal-backdrop">
      <div className="pv-modal">
        <div className="pv-modal-header">
          <h3>Profile Verification</h3>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="pv-images">
          <div>
            <p>Selfie</p>
            <img src={data.selfie_url} alt="Selfie" />
          </div>
          <div>
            <p>Document</p>
            <img src={data.document_url} alt="Document" />
          </div>
        </div>

        <div className="pv-info">
          <p><b>Username:</b> {data.username}</p>
          <p><b>Email:</b> {data.email}</p>
          <p><b>Gender:</b> {data.gender}</p>
          <p><b>DOB:</b> {data.dob}</p>
          <p>
            <b>Location:</b> {data.city}, {data.state}, {data.country}
          </p>
          <p><b>Document Type:</b> {data.document_type}</p>
        </div>

        <div className="pv-ratings">
  <div>
    <label>Selfie Clarity</label>
    <select>
      <option>Excellent</option>
      <option>Good</option>
      <option>Average</option>
    </select>
  </div>

  <div>
    <label>Document Clarity</label>
    <select>
      <option>Excellent</option>
      <option>Good</option>
      <option>Average</option>
    </select>
  </div>

  <div>
    <label>Face Match</label>
    <select>
      <option>Matched</option>
      <option>Partially Matched</option>
      <option>Not Matched</option>
    </select>
  </div>
</div>

        <div className="pv-actions">
          <button
            className="approve"
            disabled={loading}
            onClick={() =>
              onSubmit(data.verification_id, "approved")
            }
          >
            {loading ? "Processing..." : "Verify"}
          </button>

          <button
            className="reject"
            disabled={loading}
            onClick={() =>
              onSubmit(data.verification_id, "rejected")
            }
          >
            {loading ? "Processing..." : "Reject"}
          </button>
        </div>
      </div>
    </div>
  );
}