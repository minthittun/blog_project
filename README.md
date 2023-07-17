# Blog Website
This project was created with [React](https://react.dev), [Node.js](https://www.python.org/)
## About this project
This is a blog application built using React and Node.js, following a microservice architecture. It consists of two services: the Blog Service and the Chat Service. The Blog Service is responsible for managing blog posts and uses Node.js and PostgreSQL, while the Chat Service enables real-time chat functionality and utilizes Node.js, Socket.IO, and MongoDB.
## Directory structure
    ├── blog_frontend
        ├── Dockerfile
    ├── blog_service
        ├── Dockerfile
    ├── chat_service
        ├── Dockerfile
    ├── docker-compose.yml
## Usage (Recommanded)

### 1. Navigate to the project directory:
```
cd blog_project
```

### 2. To run the application, execute the following command in the root directory:

**Important! Please make sure that ports 5432, 3000, 3001, and 27017 are not being used on your local machine.**

```
docker-compose up
```
### 3. Browser http://localhost
## Manual Installation
To get started with the Blog App, follow the steps below:
### 1. Clone the repository to your local machine:
```
https://github.com/minthittun/blog_project.git
```
### 2. Navigate to the project directory:
```
cd blog_project
```
### 3. Install the dependencies for both services. Run the following command in the root directory as well as in the blog_frontend, chat-service and blog-service directories:
```
npm install
```
### 4. Database configuration for blog service
#### blog_service folder structure

Update the database server credentials in config.json

    ├── blog_service
        ├── config
            ├── config.json
    

### 5. Database configuration for blog service
### chat_service folder structure

Update the database server connection string in database.js

    ├── chat_service
        ├── database.js
### 6. Run commands
Backend services
```
npm start or nodemon start
```
Frontend
```
npm run dev
```