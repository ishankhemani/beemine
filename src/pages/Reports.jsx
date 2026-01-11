import { useEffect, useState } from "react";
import { getReports, updateReport } from "../api/reports.api";
import { getProfile } from "../api/profile.api";
import "../styles/reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // pagination
  const [page, setPage] = useState(1);
  const limit = 10;
  const [totalPages, setTotalPages] = useState(1);

  // action modal
  const [selectedReport, setSelectedReport] = useState(null);
  const [action, setAction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // profile modal
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // lightboxes (SEPARATE)
  const [photoLightbox, setPhotoLightbox] = useState(null);
  const [evidenceLightbox, setEvidenceLightbox] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [page]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getReports(page, limit);
      setReports(res.reports || []);
      setTotalPages(Math.ceil((res.total || 1) / limit));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openProfile = async (profile_id) => {
    setProfileLoading(true);
    try {
      const res = await getProfile(profile_id);
      if (res.success) setProfile(res.data);
    } catch {
      alert("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const openActionModal = (report, type) => {
    setSelectedReport(report);
    setAction(type);
    setRemarks("");
  };

  const submitAction = async () => {
    if (!remarks.trim()) {
      alert("Remarks required");
      return;
    }
    setSubmitting(true);
    try {
      await updateReport({
        report_id: selectedReport.report_id,
        action,
        remarks,
      });
      setSelectedReport(null);
      fetchReports();
    } catch {
      alert("Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loading">Loading…</div>;

  return (
    <div className="reports-page">
      <h2>Reports Management</h2>

      <div className="reports-card">
        <table>
          <thead>
            <tr>
              <th>Reporter</th>
              <th>Reported</th>
              <th>Reason</th>
              <th>Details</th>
              <th>Evidence</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id}>
                <td>
                  <span
                    className="profile-link"
                    onClick={() => openProfile(r.reporter.profile_id)}
                  >
                    {r.reporter.username}
                  </span>
                </td>

                <td>
                  <span
                    className="profile-link danger"
                    onClick={() => openProfile(r.reported.profile_id)}
                  >
                    {r.reported.username}
                  </span>
                </td>

                <td>{r.reason}</td>
                <td>{r.details || "-"}</td>

                <td>
                  {r.evidence_url ? (
                    <img
                      src={r.evidence_url}
                      className="evidence-thumb"
                      alt="evidence"
                      onClick={() => setEvidenceLightbox(r.evidence_url)}
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td>{new Date(r.created_at).toLocaleString()}</td>

                <td>
                  <span className={`status ${r.status}`}>{r.status}</span>
                </td>

                <td className="actions">
                  {r.status === "pending" ? (
                    <>
                      <button onClick={() => openActionModal(r, "warn")}>Warn</button>
                      <button onClick={() => openActionModal(r, "ban")}>Ban</button>
                      <button onClick={() => openActionModal(r, "resolve")}>Resolve</button>
                      <button onClick={() => openActionModal(r, "dismiss")}>Dismiss</button>
                    </>
                  ) : (
                    <span className="muted">No actions</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pv-pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* ACTION MODAL */}
      {selectedReport && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Confirm {action.toUpperCase()}</h3>
            <p>
              Reported user: <b>{selectedReport.reported.username}</b>
            </p>
            <textarea
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={() => setSelectedReport(null)}>Cancel</button>
              <button onClick={submitAction} disabled={submitting}>
                {submitting ? "Submitting…" : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE MODAL — FULL DETAILS */}
      {profile && (
        <div className="user-modal-backdrop">
          <div className="user-modal">
            <div className="modal-header">
              <h3>Profile Details</h3>
              <button onClick={() => setProfile(null)}>✕</button>
            </div>

            {profileLoading ? (
              <p>Loading profile…</p>
            ) : (
              <div className="modal-body">
                <div className="modal-grid">

                  <div><b>Profile ID:</b> {profile.profile_id}</div>
                  <div><b>User ID:</b> {profile.user_id}</div>
                  <div><b>Username:</b> {profile.username}</div>
                  <div><b>Email:</b> {profile.email}</div>
                  <div><b>Gender:</b> {profile.gender}</div>
                  <div><b>Interested Gender:</b> {profile.interested_gender}</div>
                  <div><b>DOB:</b> {profile.dob}</div>
                  <div><b>Age:</b> {profile.age}</div>
                  <div><b>Country:</b> {profile.country}</div>
                  <div><b>State:</b> {profile.state}</div>
                  <div><b>City:</b> {profile.city}</div>
                  <div><b>Marital Status:</b> {profile.marital_status}</div>
                  <div><b>Sexual Orientation:</b> {profile.sexual_orientation}</div>
                  <div><b>Occupation:</b> {profile.occupation || "-"}</div>
                  <div><b>Height:</b> {profile.height || "-"}</div>
                  <div><b>Income:</b> {profile.income}</div>
                  <div><b>Ethnicity:</b> {profile.ethnicity}</div>
                  <div><b>Body Shape:</b> {profile.body_shape}</div>
                  <div><b>Eye Color:</b> {profile.eye_color}</div>
                  <div><b>Hair Color:</b> {profile.hair_color}</div>
                  <div><b>Has Children:</b> {profile.has_children ? "Yes" : "No"}</div>
                  <div><b>Smoker:</b> {profile.smoker ? "Yes" : "No"}</div>
                  <div><b>Verified:</b> {profile.is_user_verified ? "Yes" : "No"}</div>
                  <div><b>Deleted:</b> {profile.is_deleted ? "Yes" : "No"}</div>
                  <div><b>Last Online:</b> {profile.last_online}</div>
                  <div><b>Created At:</b> {profile.user_created_at}</div>
                  <div><b>Description:</b> {profile.description || "-"}</div>

                  <div><b>Personality Traits:</b> {profile.personality_traits?.join(", ") || "-"}</div>
                  <div><b>Hobbies:</b> {profile.hobbies?.join(", ") || "-"}</div>
                  <div><b>Sports:</b> {profile.sports?.join(", ") || "-"}</div>
                  <div><b>Relationship Types:</b> {profile.relationship_types?.join(", ") || "-"}</div>
                  <div><b>Looking For:</b> {profile.i_am_looking_for?.join(", ") || "-"}</div>
                </div>

                {/* PHOTOS */}
                {profile.photos?.length > 0 && (
                  <div className="photos-section">
                    <h4>Photos</h4>
                    <div className="photos-grid">
                      {profile.photos.map((p, i) => (
                        <img
                          key={i}
                          src={p.photo_url}
                          alt="profile"
                          onClick={() => setPhotoLightbox(p.photo_url)}
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

      {/* PROFILE PHOTO LIGHTBOX */}
      {photoLightbox && (
        <div className="photo-lightbox" onClick={() => setPhotoLightbox(null)}>
          <img src={photoLightbox} alt="zoom" />
        </div>
      )}

      {/* EVIDENCE LIGHTBOX */}
      {evidenceLightbox && (
        <div className="photo-lightbox" onClick={() => setEvidenceLightbox(null)}>
          <img src={evidenceLightbox} alt="evidence" />
        </div>
      )}
    </div>
  );
}
