import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import MpinPage from '../pages/auth/MpinPage'
import OtpPage from '../pages/auth/OtpPage'
import MpinVerifyPage from '../pages/auth/MpinVerifyPage'
import PortalSelectPage from '../pages/auth/PortalSelectPage'
import SelectApartmentPage from '../pages/user/SelectApartmentPage'
import AddFlatPage from '../pages/user/AddFlatPage'
import UserSetupPage from '../pages/user/UserSetupPage'
import UserDashboardPage from '../pages/user/UserDashboardPage'
import DashboardPage from '../pages/admin/DashboardPage'
import ApartmentGroupPage from '../pages/admin/ApartmentGroupPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/mpin" element={<MpinPage />} />
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/mpin-verify" element={<MpinVerifyPage />} />
      <Route path="/portal-select" element={<PortalSelectPage />} />
      <Route path="/user-setup" element={<UserSetupPage />} />
      <Route path="/add-flat" element={<AddFlatPage />} />
      <Route path="/user/dashboard" element={<UserDashboardPage />} />
      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/apartment-group" element={<ApartmentGroupPage />} />
    </Routes>
  )
}

export default AppRouter