# My Node Project: Auth, JWT, Socket.io, CRUD Chat App

## Overview

This project is a Node.js application that combines a real-time chat system using Socket.io with a bookstore management system. It uses MongoDB with Mongoose to perform CRUD operations for books, allowing users to add, view, update, and delete books while also communicating through live chat.

## Features

### Authentication
- User registration and login with JWT tokens
- Password hashing with bcrypt
- Protected routes

### Real-Time Chat
- Group messaging
- Private messaging
- Typing indicators
- User join/leave notifications
- Message persistence in MongoDB

### Message Management
- Edit messages
- Delete messages
- Reply to messages
- Message truncation and expansion
- Infinite scroll (though currently loads all messages at once)

### Admin Features
- Kick users
- Clear chat messages
- Clear all users
- Founder role management

### UI/UX
- Responsive design with CSS clamp
- Mobile-friendly layout
- Scroll to bottom button for new messages
- "No more messages" notification
- Expandable message text

### Database
- MongoDB with Mongoose
- Models: User, Message, Author, Book, Product, Image

### File Upload
- Cloudinary integration for image uploads
- Multer for handling file uploads

## Tech Stack

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Image hosting
- **Multer** - File upload middleware
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Socket.io-client** - Real-time client
- **React Router** - Routing

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/danieltn889/my-node-project-auth-jwt-socket-io-crud.git
   cd my-node-project-auth-jwt-socket-io-crud
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd react-frontend
   npm install
   cd ..
   ```

4. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_jwt_secret_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```
   - `PORT`: The port for the server (default 3000)
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secret key for JWT token signing
   - `CLOUDINARY_*`: Your Cloudinary credentials for image uploads (optional if not using image features)

5. Start MongoDB (if not running):
   ```bash
   mongod
   ```

6. Start the backend:
   ```bash
   npm run dev
   ```

7. Start the frontend (in a new terminal):
   ```bash
   cd react-frontend
   npm run dev
   ```

8. Open http://localhost:5173 in your browser.

## Usage

1. Register a new account or login.
2. Join the chat.
3. Send messages in the group chat.
4. Use the private message feature to chat with specific users.
5. Admins can kick users or clear the chat.
6. Scroll up to view older messages.
7. Use the menu (⋮) on messages to edit, delete, or reply.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/auth/users` - Get all users (admin)
- `DELETE /api/auth/users/:id` - Delete user (admin)

### Messages
- `GET /api/messages` - Get all messages
- `POST /api/messages` - Send message
- `PUT /api/messages/:id` - Edit message
- `DELETE /api/messages/:id` - Delete message

### Images
- `POST /api/images/upload` - Upload image

### Books/Authors/Products
- CRUD endpoints for books, authors, products (similar structure)

## Database Models

### User
- username: String
- email: String
- password: String (hashed)
- role: String (user/founder)

### Message
- userName: String
- text: String
- timestamp: Date
- replyTo: ObjectId
- replyText: String
- replyUser: String
- id: String (custom ID)

### Author
- name: String
- bio: String

### Book
- title: String
- author: ObjectId
- description: String

### Product
- name: String
- price: Number
- description: String

### Image
- url: String
- publicId: String

## Socket Events

### Client to Server
- `join` - Join chat with user data
- `ChatMessage` - Send group message
- `privateMessage` - Send private message
- `editMessage` - Edit message
- `deleteMessage` - Delete message
- `typing` - Start typing
- `stopTyping` - Stop typing
- `leave` - Leave chat
- `kickUser` - Kick user (admin)
- `clearUsers` - Clear users (admin)
- `clearMessages` - Clear messages (admin)
- `loadMoreMessages` - Load older messages

### Server to Client
- `userJoined` - User joined notification
- `userLeft` - User left notification
- `userList` - List of online users
- `isFounder` - Founder status
- `loadMessages` - Initial messages
- `ChatMessage` - New group message
- `privateMessage` - New private message
- `messagesUpdate` - Messages updated
- `messageEdited` - Message edited
- `typingUsers` - Typing users list
- `message` - System message
- `olderMessages` - Older messages loaded

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

ISC