# Uber Clone

A full-stack Uber clone built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS.

## Features

### Rider Features
- User authentication (signup/login)
- Request rides with location selection
- Real-time ride tracking
- View ride history
- Rate drivers
- Multiple payment methods
- Profile management

### Driver Features
- Driver registration and verification
- Accept/reject ride requests
- Real-time navigation
- Earnings tracking
- Profile and vehicle management
- Availability toggle

### Common Features
- Real-time location tracking
- In-app messaging
- Rating system
- Payment integration
- Profile management
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Socket.io for real-time features
- Winston for logging

### Frontend
- React.js
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Google Maps API integration
- Font Awesome icons
- Context API for state management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Google Maps API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/uber-clone.git
cd uber-clone
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Create a .env file in the server directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/uber-clone
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

4. Install client dependencies:
```bash
cd ../client
npm install
```

5. Create a .env file in the client directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Running the Application

1. Start the server:
```bash
cd server
npm run dev
```

2. Start the client:
```bash
cd client
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

### Server Structure
```
server/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Mongoose models
├── routes/         # API routes
├── utils/          # Utility functions
└── server.js       # Entry point
```

### Client Structure
```
client/
├── public/         # Static files
└── src/
    ├── components/ # Reusable components
    ├── contexts/   # Context providers
    ├── pages/      # Page components
    ├── App.jsx     # Main component
    └── index.js    # Entry point
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user

### Rides
- POST /api/rides/request - Request new ride
- PUT /api/rides/:id/accept - Accept ride (drivers)
- PUT /api/rides/:id/status - Update ride status
- GET /api/rides/history - Get ride history

### Users
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile
- PUT /api/users/location - Update driver location
- GET /api/users/drivers/nearby - Get nearby drivers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Uber for inspiration
- Google Maps API
- Tailwind CSS
- Font Awesome
- All other open-source libraries used in this project