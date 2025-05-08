import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './auth/AuthContext';
import { PostsProvider } from './context/PostsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import VerifyPending from './pages/VerifyPending';
import VerifySuccess from './pages/VerifySuccess';
import MedicalFlashcardsPage from './pages/MedicalFlashcardsPage';
import MedicalQuestionsPage from './pages/MedicalQuestionsPage';
import DeepSeekChatPage from './pages/DeepSeekChatPage';
import DeepSeekChat from './components/DeepSeekChat';
import { FaUserMd, FaTimes, FaCommentMedical } from 'react-icons/fa';
import './index.css';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();
  return user ? element : <Navigate to="/login" replace />;
};

function App() {
  const [showChat, setShowChat] = useState(false);
  const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY;

  return (
    <React.StrictMode>
      <AuthProvider>
        <PostsProvider>
          {/* Floating Chat Container - Positioned above navbar */}
          <div className="floating-chat-container">
            {showChat && (
              <div className="floating-chat-window">
                <div className="chat-header">
                  <FaUserMd className="header-icon" />
                  <h2>Medical AI Assistant</h2>
                  <button 
                    onClick={() => setShowChat(false)}
                    className="chat-close-button"
                    aria-label="Close chat"
                  >
                    <FaTimes />
                  </button>
                </div>
                <div className="chat-content">
                  <DeepSeekChat apiKey={DEEPSEEK_API_KEY} />
                </div>
              </div>
            )}
            <button 
              onClick={() => setShowChat(!showChat)}
              className="floating-chat-button"
              aria-label={showChat ? "Close chat" : "Open chat"}
            >
              {showChat ? <FaTimes /> : <FaCommentMedical />}
            </button>
          </div>

          {/* Main App Structure */}
          <div className="app-wrapper">
            <Navbar onChatToggle={() => setShowChat(!showChat)} />
            
            <main className="main-content">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/posts/:id" element={
                  <ErrorBoundary>
                    <PostPage />
                  </ErrorBoundary>
                } />
                <Route path="/verify-pending" element={<VerifyPending />} />
                <Route path="/verify-success" element={<VerifySuccess />} />
                <Route path="/medical-flashcards" element={
                  <ErrorBoundary>
                    <MedicalFlashcardsPage />
                  </ErrorBoundary>
                } />
                <Route path="/medical-questions" element={
                  <ErrorBoundary>
                    <MedicalQuestionsPage />
                  </ErrorBoundary>
                } />

                {/* Protected Routes */}
                <Route path="/profile" element={
                  <ErrorBoundary>
                    <ProtectedRoute element={<ProfilePage />} />
                  </ErrorBoundary>
                } />
                <Route path="/posts/new" element={
                  <ErrorBoundary>
                    <ProtectedRoute element={<CreatePostPage />} />
                  </ErrorBoundary>
                } />
                <Route path="/posts/:id/edit" element={
                  <ErrorBoundary>
                    <ProtectedRoute element={<EditPostPage />} />
                  </ErrorBoundary>
                } />
                <Route path="/deepseek-chat" element={
                  <ErrorBoundary>
                    <ProtectedRoute element={<DeepSeekChatPage />} />
                  </ErrorBoundary>
                } />

                {/* 404 Page */}
                <Route path="*" element={
                  <div className="not-found-container">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                  </div>
                } />
              </Routes>
            </main>

            <Footer />
          </div>

          {/* Toast Notifications */}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'var(--medical-blue)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
              },
            }}
          />
        </PostsProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}

export default App;
