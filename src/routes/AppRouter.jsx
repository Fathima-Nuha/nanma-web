import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/auth/LoginPage'
import MpinPage from '../pages/auth/MpinPage'
import OtpPage from '../pages/auth/OtpPage'
import MpinVerifyPage from '../pages/auth/MpinVerifyPage'
import PortalSelectPage from '../pages/auth/PortalSelectPage'
import SelectApartmentPage from '../pages/user/SelectApartmentPage'
import AddFlatPage from '../pages/user/AddFlatPage'
import UserSetupPage from '../pages/user/UserSetupPage'
import UserLayout from '../components/layout/UserLayout'
import UserDashboardPage from '../pages/user/UserDashboardPage'
import ServicesPage from '../pages/user/ServicesPage'
import CreateServiceRequestPage from '../pages/user/CreateServiceRequestPage'
import CreateCommunityServiceRequestPage from '../pages/user/CreateCommunityServiceRequestPage'
import ComplaintsPage from '../pages/user/ComplaintsPage'
import ComplaintDetailPage from '../pages/user/ComplaintDetailPage'
import CreateComplaintPage from '../pages/user/CreateComplaintPage'
import EditComplaintPage from '../pages/user/EditComplaintPage'
import UtilityScanPage from '../pages/user/UtilityScanPage'
import FacilitiesPage from '../pages/user/FacilitiesPage'
import FacilityBookingPage from '../pages/user/FacilityBookingPage'
import FacilityBookingEditPage from '../pages/user/FacilityBookingEditPage'
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

      {/* User routes — all share the sidebar + topbar shell */}
      <Route element={<UserLayout />}>
        <Route path="/user/dashboard" element={<UserDashboardPage />} />
        <Route path="/user/services" element={<ServicesPage />} />
        <Route path="/user/services/create" element={<CreateServiceRequestPage />} />
        <Route path="/user/services/create-community" element={<CreateCommunityServiceRequestPage />} />
        <Route path="/user/complaints" element={<ComplaintsPage />} />
        <Route path="/user/complaints/create" element={<CreateComplaintPage />} />
        <Route path="/user/complaints/:id" element={<ComplaintDetailPage />} />
        <Route path="/user/complaints/:id/edit" element={<EditComplaintPage />} />
        <Route path="/user/utility" element={<UtilityScanPage />} />
        <Route path="/user/facilities" element={<FacilitiesPage />} />
        <Route path="/user/facilities/book" element={<FacilityBookingPage />} />
        <Route path="/user/facilities/booking/:id" element={<FacilityBookingEditPage />} />
      </Route>

      <Route path="/admin/dashboard" element={<DashboardPage />} />
      <Route path="/admin/apartment-group" element={<ApartmentGroupPage />} />
    </Routes>
  )
}

export default AppRouter