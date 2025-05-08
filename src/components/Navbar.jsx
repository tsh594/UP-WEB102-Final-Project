import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import UserMenu from './UserMenu';
import { FaBookMedical, FaQuestionCircle, FaComments } from 'react-icons/fa';
import './../index.css'; // Adjust path if needed

const Navbar = ({ onChatToggle }) => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left side - Logo and main links */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="navbar-brand">
            <span className="logo" aria-label="Logo"></span>
            <span>MediConnect</span>
          </Link>

          <NavLink 
            to="/medical-flashcards"
            className={({ isActive }) => "navbar-link" + (isActive ? " active" : "")}
          >
            <FaBookMedical />
            <span>References</span>
          </NavLink>

          <NavLink 
            to="/medical-questions"
            className={({ isActive }) => "navbar-link questions-link" + (isActive ? " active" : "")}
          >
            <FaQuestionCircle />
            <span>Questions</span>
          </NavLink>
        </div>

        {/* Right side - User menu and chat toggle */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={onChatToggle}
            className="navbar-link ai-assistant-btn"
          >
            <FaComments />
            <span>AI Assistant</span>
          </button>

          <UserMenu user={user} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;