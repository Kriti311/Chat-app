// import React, { useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const LogoutPage = () => {
//     const navigate = useNavigate();

//     useEffect(() => {
//         const logout = async () => {
//             try {
//                 await axios.post('http://localhost:8000/logout/');
//                 console.log('User logged out');
//                 // Clear tokens from cookies
//                 document.cookie = 'access=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//                 document.cookie = 'refresh=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
//                 // Redirect to the login page
//                 navigate('/login');
//             } catch (error) {
//                 console.error('Error logging out:', error);
//                 alert('Error logging out. Please try again.');
//             }
//         };

//         logout();
//     }, [navigate]);

//     return null;
// };

// export default LogoutPage;

import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const LogoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            const access_token = Cookies.get('access');
            const refresh_token = Cookies.get('refresh');
            try {
                await axios.post(
                    'http://localhost:8000/logout/', 
                    { refresh_token: refresh_token }, 
                    { headers: { Authorization: `Bearer ${access_token}` } }
                );
                console.log('User logged out');
                // Clear tokens from cookies
                Cookies.remove('access');
                Cookies.remove('refresh');
                // Redirect to the login page
                navigate('/');
            } catch (error) {
                console.error('Error logging out:', error);
                alert('Error logging out. Please try again.');
            }
        };

        logout();
    }, [navigate]);

    return null;
};

export default LogoutPage;
