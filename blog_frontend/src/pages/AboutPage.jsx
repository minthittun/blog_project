import React from 'react'


function AboutPage() {

  return (
    <div className='main-content-padding fade-in'>

      
      <h1 className="text-large-ex text-bold">About this project</h1> <br />
      <p style={{textAlign: 'justify'}}>
        This is a blog application built using React and Node.js, following a microservice architecture. It consists of two services: the Blog Service and the Chat Service. The Blog Service is responsible for managing blog posts and uses Node.js and PostgreSQL, while the Chat Service enables real-time chat functionality and utilizes Node.js, Socket.IO, and MongoDB.
      </p>
      
    </div>
  )
}

export default AboutPage