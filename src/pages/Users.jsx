

import { useEffect, useState } from "react";
import { getUsers } from "../api/Users.api";
import { getProfile } from "../api/profile.api";
import "../styles/users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("");
  const [verified, setVerified] = useState("");
  const [ageGap, setAgeGap] = useState("");
  const [stateSort, setStateSort] = useState("");

  /* 🔴 IMPORTANT STATES */
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [page, search, gender, verified, ageGap, stateSort]);

  const getState = (location = "") =>
    location.split(",").map((s) => s.trim())[1] || "";

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await getUsers({
        page,
        limit,
        search,
        gender,
        verified,
      });

      if (res.success) {
        let data = [...(res.data || [])];

        /* AGE GAP FILTER */
        if (ageGap) {
          data = data.filter((u) => {
            if (ageGap === "18-24") return u.age >= 18 && u.age <= 24;
            if (ageGap === "25-30") return u.age >= 25 && u.age <= 30;
            if (ageGap === "31-40") return u.age >= 31 && u.age <= 40;
            if (ageGap === "40+") return u.age > 40;
            return true;
          });
        }

        /* STATE SORT */
        if (stateSort === "az") {
          data.sort((a, b) =>
            getState(a.location).localeCompare(getState(b.location))
          );
        }

        if (stateSort === "za") {
          data.sort((a, b) =>
            getState(b.location).localeCompare(getState(a.location))
          );
        }

        setUsers(data);
        setTotal(res.total || 0);
      }
    } catch (err) {
      console.error("Users API error:", err);
    } finally {
      setLoading(false);
    }
  };

  /* 🔥 THIS IS THE MISSING LOGIC YOU DID NOT HAVE */
  const openProfileModal = async (profile_id) => {
    try {
      setProfileLoading(true);

      const res = await getProfile(profile_id);

      if (res.success) {
        setSelectedProfile(res.data); // FULL PROFILE DATA
      }
    } catch (err) {
      console.error("Get Profile error:", err);
      alert("Failed to load profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="users-page">
      {/* HEADER */}
      <div className="users-header">
        <h2>Users Management</h2>
        <p>Filter users by age group and state</p>
      </div>

      {/* FILTER BAR */}
      <div className="users-filters">
        <input
          placeholder="Search username or email"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />

        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Gender</option>
          <option value="Man">Man</option>
          <option value="Woman">Woman</option>
        </select>

        <select value={verified} onChange={(e) => setVerified(e.target.value)}>
          <option value="">Status</option>
          <option value="1">Verified</option>
          <option value="0">Unverified</option>
        </select>

        <select value={ageGap} onChange={(e) => setAgeGap(e.target.value)}>
          <option value="">Age Group</option>
          <option value="18-24">18 – 24</option>
          <option value="25-30">25 – 30</option>
          <option value="31-40">31 – 40</option>
          <option value="40+">40+</option>
        </select>

        <select value={stateSort} onChange={(e) => setStateSort(e.target.value)}>
          <option value="">Sort by State</option>
          <option value="az">State A → Z</option>
          <option value="za">State Z → A</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="users-card">
        {loading ? (
          <div className="users-loading">Loading users…</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Gender</th>
                <th>Age</th>
                <th>State</th>
                <th>Status</th>
                <th>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u.profile_id}
                  onClick={() => openProfileModal(u.profile_id)}
                  style={{ cursor: "pointer" }}
                >
                  <td>
                    <strong>{u.username}</strong>
                    <div className="sub">{u.email}</div>
                  </td>
                  <td>{u.gender}</td>
                  <td>{u.age}</td>
                  <td>{getState(u.location)}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.is_user_verified ? "green" : "gray"
                      }`}
                    >
                      {u.is_user_verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>{u.last_online}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} of {totalPages || 1}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>

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
              <div className="modal-grid">
                <div><b>Username:</b> {selectedProfile.username}</div>
                <div><b>Gender:</b> {selectedProfile.gender}</div>
                <div><b>DOB:</b> {selectedProfile.dob}</div>
                <div><b>Country:</b> {selectedProfile.country}</div>
                <div><b>State:</b> {selectedProfile.state}</div>
                <div><b>City:</b> {selectedProfile.city}</div>
                <div><b>Height:</b> {selectedProfile.height || "-"}</div>
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