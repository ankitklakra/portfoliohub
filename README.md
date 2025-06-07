# PortfolioHub

PortfolioHub is a modern web application that allows users to create and manage their professional portfolios. Built with React and Firebase, it provides a seamless experience for showcasing projects, hackathons, and professional achievements.

## 🌟 Live Demo

Check out the live application: [PortfolioHub](https://projmasys.web.app)

## ✨ Features

- **User Authentication**
  - Secure email/password authentication
  - Protected routes
  - User profile management

- **Portfolio Management**
  - Upload and manage different types of projects:
    - Web Projects
    - AI/ML Projects
    - Android Projects
  - Showcase hackathon achievements
  - Document positions of responsibility

- **Project Showcase**
  - Add project details including:
    - Title and description
    - Technologies used
    - Deployment links
    - GitHub repository links
    - Project images

- **Responsive Design**
  - Mobile-first approach
  - Beautiful dark theme
  - Smooth animations
  - Intuitive user interface

## 🛠️ Technologies Used

- **Frontend**
  - React.js
  - React Router
  - Framer Motion
  - React Icons
  - Custom CSS

- **Backend**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage

## 🔧 Environment Variables

To protect sensitive configuration (like Firebase API keys), create a `.env` file in the project root with the following variables:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Make sure to add `.env` to your `.gitignore` file to keep your secrets secure.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/ankitklakra/portfoliohub.git
cd portfoliohub
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Create a Firebase project and add your configuration
   - Create a new project in Firebase Console
   - Enable Authentication, Firestore, and Storage
   - Add your Firebase configuration to `src/firebase.js`

4. Start the development server
```bash
npm start
# or
yarn start
```

## 📱 Features in Detail

### Project Upload
- Upload different types of projects
- Add detailed descriptions
- Include deployment and GitHub links
- Upload project images
- Specify technologies used

### Hackathon Section
- Document hackathon participation
- Add achievements and awards
- Include organization details
- Specify dates and duration

### Positions of Responsibility
- Add professional roles
- Document achievements
- Include organization details
- Specify tenure

### Profile Management
- Update personal information
- Add social media links
- Upload profile picture
- Customize bio

## 🔒 Security

- Firebase Authentication for secure user management
- Protected routes for authenticated users
- Secure file uploads to Firebase Storage
- Data validation and sanitization

## 🎨 UI/UX Features

- Modern dark theme
- Smooth animations and transitions
- Responsive design for all devices
- Intuitive navigation
- Loading states and error handling
- Form validation and feedback

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Firebase for backend services
- React community for amazing tools and libraries
- All contributors who have helped shape this project

Made with ❤️ by ankitklakra