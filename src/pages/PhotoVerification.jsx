import { useEffect, useState } from "react";
import {
  getPhotoVerifications,
  updatePhotoVerification,
} from "../api/PhotoVerification.api";
import PhotoVerificationModal from "../components/PhotoVerificationModal";
import "../styles/photoVerification.css";

export default function PhotoVerification() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPhotoVerifications().then((res) => {
      setList(res.data || []);
    });
  }, []);

  const handleAction = async (photoId, action) => {
    setLoading(true);

    const reason =
      action === "approve"
        ? "Photo verified successfully"
        : "Photo is blurred or not clear";

    try {
      await updatePhotoVerification({
        photo_id: photoId,
        action,
        reason,
      });

      setList((prev) =>
        prev.filter((item) => item.photo_id !== photoId)
      );
      setSelected(null);
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="photo-verification">
      <h2>Photo Verification</h2>
      <p>Compare profile photos with verification selfies.</p>

      <div className="pv-list">
        {list.map((item) => (
          <div className="pv-item" key={item.photo_id}>
            <div>
              <h4>{item.username}</h4>
              <span>
                Submitted{" "}
                {new Date(item.uploaded_at).toLocaleString()}
              </span>
            </div>

            <button onClick={() => setSelected(item)}>
              Verify
            </button>
          </div>
        ))}
      </div>

      <PhotoVerificationModal
        data={selected}
        onClose={() => setSelected(null)}
        onSubmit={handleAction}
        loading={loading}
      />
    </div>
  );
}