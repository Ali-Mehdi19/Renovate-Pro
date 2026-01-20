import AppointmentBooking from '@/component/Booking_survey/booking'
import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <div className="pt-16">
      <AppointmentBooking/>

        </div>
      <Footer/>
    </div>
  )
}

export default page
