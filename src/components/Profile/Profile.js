
import React, { useState, useEffect } from 'react';
import './Profile.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import Nav from '../Nav/Nav';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Edit from './Edit'; 
import { get } from 'mongoose';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false); 
  const history = useHistory();
  const [events, setEvents] = useState([]);
  const [loggedIn, setLoggedIn] = useState([]);

  useEffect(() => {
    const Logged = async () => {
      try {
        const token = Cookies.get('token');
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        console.log("User ID:", userId);
        const response = await axios.get(`http://localhost:8800/users/${userId}`);
        const event = await axios.get(`http://localhost:8800/events/myevent/${userId}`);
        setEvents(event.data);
        console.log(event.data);
        setUserData(response.data.user);
        // console.log(userData.myevents);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    Logged();

  }, []);
  

  const handleEditProfile = () => {
    setShowModal(true); 
  };

  const handleCloseModal = () => {
    setShowModal(false); 
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Nav />
      <div className="profile-container">
        <div className="profile-header">
          <FontAwesomeIcon icon={faUserCircle} className='profile-picture' />
          <div className="profile-info">
            <h2 className='pname'>{userData.pname}</h2>
            <p>@{userData.username}</p>
            <button onClick={handleEditProfile}>Edit Profile</button>
          </div>
        </div>
        <div className="profile-bio">
          <p className='pname'>{userData.bio}</p>
        </div>
        <div className="profile-posts">
          {events.map((event, index) => (
            
            <div key={index} className="profile-post">
              {console.log(event)}
              <h3>{event.eventName}</h3>
              <p>{event.eventDate}</p>
              <p>{event.eventTime}</p>
              <p>{event.eventVenue}</p>
              <p>{event.maxPeople}</p>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      </div>
      {showModal && <Edit handleClose={handleCloseModal} userId={loggedIn}/>} 
    </div>
  );
};

export default Profile;
