import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import { AiToolsData } from '../assets/assets'
import AITools from '../components/AITools'
import Testimonial from '../components/Testimonial'
import Plan from '../components/Plan'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const Home = () => {

  return (
    <div>
        <Navbar />
        <Hero />
        <AITools />
        <Testimonial/>
        <Plan/>
        <Footer/>
    </div>
  )
}

export default Home