import Footer from '@/component/layout/Footer'
import Navbar from '@/component/layout/Navbar'
import Register from '@/component/Register/Register'
import React from 'react'

const register = () => {
    return (
        <>
        <Navbar/>
        <div className='mt-8'>

            <Register />
        </div>
         <Footer/>
        </>
    )
}


export default register