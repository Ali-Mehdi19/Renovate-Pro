import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import SurveyorAuth from '@/component/SurveyorLogin/SurveyorLogin'
import React from 'react'

const page = () => {
  return (
    <div>
      <Navbar/>
      <SurveyorAuth/>
      <Footer/>
    </div>
  )
}

export default page
