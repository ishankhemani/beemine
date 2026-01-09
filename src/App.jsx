import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Revenue from "./pages/Revenue";
import Reviews from "./pages/Reviews";
import ProfileVerification from "./pages/ProfileVerification";

import AdminLayout from "./layouts/AdminLayout";
import Persistant from "./components/Persistant";
import PhotoVerification from "./pages/PhotoVerification";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route path="/" element={<Login />} />

        {/* PROTECTED ADMIN AREA */}
        <Route element={<Persistant />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route
              path="/profile-verification"
              element={<ProfileVerification />}
            />
            <Route path="/photo-verification" element={<PhotoVerification/>}/>
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
