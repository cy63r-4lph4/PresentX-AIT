import { Route, Routes } from "react-router-dom";
import SuperAdmin from "./pages/SuperAdmin";
import { Dashboard, Feedback, Reports, ResetDeviceScreen, Settings, Timetable } from "./routes";
import { ToastContainer } from "react-toastify";
import Home from "./pages/Home";
import AdminLogin from "./pages/AdnimLogin";
import LecturerLogin from "./pages/LecturerLogin";
import { AuthProvider } from "./auth/AuthContex";
import ProtectedRoute from "./components/ProtectedRoutes";
import SuperLecturer from "./pages/SuperLecturer";
import MyTimetable from "./routes/MyTimetable";
import GenerateQRCode from "./routes/GenerateQRCode";
import Attendance from "./routes/Attendance";
import AttendanceReport from "./routes/AttendanceReport";
import CodeManagement from "./routes/CodeManagement";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/s" element={<AdminLogin />} />
        <Route path="/login/a" element={<LecturerLogin />} />

        <Route
          path="lecturer"
          element={
            <ProtectedRoute allowedRoles={["lecturer"]}>
              <SuperLecturer />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<Dashboard />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="timetable" element={<MyTimetable />} />
          <Route path="generate-token" element={<GenerateQRCode />} />
          <Route path="reports" element={<Reports />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="report" element={<AttendanceReport />} />
        </Route>

        <Route
          path="su"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <SuperAdmin />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<Dashboard />} />
          <Route path="feedback" element={<Feedback />} />
          <Route path="timetable" element={<Timetable />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
          <Route path="generate-token" element={<CodeManagement />} />
          <Route path="reset-device" element={<ResetDeviceScreen />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
};

export default App;
