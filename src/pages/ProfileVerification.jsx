import { useEffect, useState } from "react";
import {
  getProfileVerifications,
  updateProfileVerification,
} from "../api/profileVerification.api";
import VerificationModal from "../components/VerificationModal";
import "../styles/profileVerification.css";

export default function ProfileVerification() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProfileVerifications()
      .then((res) => {
        setList(res.data || []);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
      });
  }, []);

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

      // Remove card after success
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

      <div className="pv-grid">
        {list.map((item) => (
          <div className="pv-card" key={item.verification_id}>
            <h4>{item.username}</h4>
            <p>
              {item.city}, {item.state}
            </p>
            <p>
              <b>Method:</b> {item.document_type}
            </p>

            <button onClick={() => setSelected(item)}>
              Verify
            </button>
          </div>
        ))}
      </div>

      <VerificationModal
        data={selected}
        onClose={() => setSelected(null)}
        onSubmit={handleAction}
        loading={loading}
      />
    </div>
  );
}