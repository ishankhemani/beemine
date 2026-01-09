import { useEffect, useState } from "react";
import { getReports, updateReport } from "../api/reports.api";
import { getProfile } from "../api/profile.api";
import "../styles/reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ACTION MODAL STATES */
  const [selectedReport, setSelectedReport] = useState(null);
  const [action, setAction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* 🔴 PROFILE MODAL STATES */
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    setLoading(true);
    getReports()
      .then((res) => {
        setReports(res.reports || []);
      })
      .finally(() => setLoading(false));
  };

  /* 🔥 FETCH PROFILE DETAILS */
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

  const openActionModal = (report, actionType) => {
    setSelectedReport(report);
    setAction(actionType);
    setRemarks("");
  };

  const handleSubmitAction = async () => {
    if (!remarks.trim()) {
      alert("Remarks are required");
      return;
    }

    try {
      setSubmitting(true);

      await updateReport({
        report_id: selectedReport.report_id,
        action,
        remarks,
      });

      setReports((prev) =>
        prev.map((r) =>
          r.report_id === selectedReport.report_id
            ? { ...r, status: action }
            : r
        )
      );

      closeActionModal();
    } catch (err) {
      alert("Failed to update report");
    } finally {
      setSubmitting(false);
    }
  };

  const closeActionModal = () => {
    setSelectedReport(null);
    setAction("");
    setRemarks("");
  };

  if (loading) {
    return <div className="page-loading">Loading reports…</div>;
  }

  return (
    <div className="reports-page">
      <h2>Reports Management</h2>
      <p>Review and take action on reported users.</p>

      <div className="reports-card">
        <table>
          <thead>
            <tr>
              <th>Reporter</th>
              <th>Reported User</th>
              <th>Reason</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((r) => (
              <tr key={r.report_id}>
                {/* 🔥 REPORTER */}
                <td>
                  <span
                    className="profile-link"
                    onClick={() => openProfileModal(r.reporter.profile_id)}
                  >
                    {r.reporter.username}
                  </span>
                </td>

                {/* 🔥 REPORTED */}
                <td className="reported-user">
                  <span
                    className="profile-link danger"
                    onClick={() => openProfileModal(r.reported.profile_id)}
                  >
                    {r.reported.username}
                  </span>
                </td>

                <td>
                  <span className="reason">⚠ {r.reason}</span>
                </td>

                <td>{new Date(r.created_at).toLocaleString()}</td>

                <td>
                  <span className={`status ${r.status}`}>{r.status}</span>
                </td>

                <td className="actions">
                  {["resolved", "dismissed"].includes(r.status) ? (
                    <span className="muted">No actions</span>
                  ) : (
                    <>
                      <button
                        className="warn"
                        onClick={() => openActionModal(r, "warn")}
                      >
                        Warn
                      </button>

                      <button
                        className="ban"
                        onClick={() => openActionModal(r, "ban")}
                      >
                        Ban
                      </button>

                      <button
                        className="resolve"
                        onClick={() => openActionModal(r, "resolve")}
                      >
                        Resolve
                      </button>

                      <button
                        className="dismiss"
                        onClick={() => openActionModal(r, "dismiss")}
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <div className="empty-state">No reports found</div>
        )}
      </div>

      {/* ACTION MODAL */}
      {selectedReport && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>
              Confirm action: <span>{action.toUpperCase()}</span>
            </h3>

            <p>
              Reported user:{" "}
              <strong>{selectedReport.reported.username}</strong>
            </p>

            <textarea
              placeholder="Enter remarks (required)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <div className="modal-actions">
              <button onClick={closeActionModal} disabled={submitting}>
                Cancel
              </button>
              <button
                className="confirm"
                onClick={handleSubmitAction}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔥 PROFILE DETAILS MODAL */}
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