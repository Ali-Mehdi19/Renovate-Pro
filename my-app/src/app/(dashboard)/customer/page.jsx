import CustomerDashboard from '@/component/CustomerDashboard/Customer_Dashboard'
import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <CustomerDashboard/>
      <Footer/>      
    </div>
  )
}

export default page
