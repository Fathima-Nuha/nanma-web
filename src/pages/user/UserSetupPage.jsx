import React from 'react'
import { useLocation } from 'react-router-dom'
import AddFlatPage from './AddFlatPage'
import SelectApartmentPage from './SelectApartmentPage'

function UserSetupPage() {
  const { state } = useLocation()
alert("UserSetupPage state: " + JSON.stringify(state))
  const hasApartment = state?.hasApartment ?? false
  const appartment_details = state?.appartment_details ?? {}


  return hasApartment ? <SelectApartmentPage appartment_details={appartment_details} /> : <AddFlatPage />
}

export default UserSetupPage
