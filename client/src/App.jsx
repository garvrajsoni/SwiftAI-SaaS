import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Community from './pages/Community'
import BlogTittles from './pages/BlogTittles'
import GenerateImages from './pages/GenerateImages'
import ReviewResume from './pages/ReviewResume'
import RemoveBackground from './pages/RemoveBackground'
import WriteArticles from './pages/WriteArticles'
import RemoveObject from './pages/RemoveObject'
import { useAuth } from '@clerk/clerk-react'
import { useEffect } from 'react'


const App = () => {

  const {getToken} = useAuth()

  useEffect(()=>{getToken().then((token)=>console.log(token))
    ;},[])

  return (
    <div>
       <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ai" element={<Layout />} >
         <Route path="generate-images" element={<GenerateImages />} />
          <Route index element={<Dashboard />} />
          <Route path="community" element={<Community />} />
          <Route path="blog-titles" element={<BlogTittles />} />
          <Route path="review-resume" element={<ReviewResume />} />
          <Route path="remove-background" element={<RemoveBackground />} />
          <Route path="write-articles" element={<WriteArticles />} /> 
          <Route path ="remove-object" element={<RemoveObject />} />
        </Route>
    </Routes>
    </div>
  )
}

export default App
