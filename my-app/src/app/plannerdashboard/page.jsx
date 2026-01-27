import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import PlannerDashboard from '@/component/PlannerDashBoard/PlannerDahboard'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
      <PlannerDashboard/>
      <Footer/>
    </div>
  )
}

export default page
