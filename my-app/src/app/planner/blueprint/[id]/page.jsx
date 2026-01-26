import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import BlueprintViewer from '@/component/Planner_BluePrint/Planner_BluePrint'
import React from 'react'

const page = () => {
  return (
    <div>
        <Navbar/>
        <div className='mt-17'>
      <BlueprintViewer/>

        </div>
      <Footer/>
    </div>
  )
}

export default page
