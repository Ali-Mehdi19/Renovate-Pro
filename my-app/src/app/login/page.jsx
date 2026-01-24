
import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import Login from '@/component/Login/Login'
import React from 'react'

 const login = () => {
  return (
    <>
    <Navbar/>
    <div className='mt-8'>

   <Login/>
    </div>
   <Footer/>
    </>
  )
}


export default login
