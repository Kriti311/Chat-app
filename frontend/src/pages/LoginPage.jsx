// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/LoginPage.css';

// function LoginPage() {
//   return (
//     <div className="login-page">
//       <h1>Login</h1>
//       <form>
//         <input type="text" placeholder="Username" />
//         <input type="password" placeholder="Password" />
//         <button type="submit">Login</button>
//       </form>
//       <p>
//         Don't have an account? <Link to="/signup">Sign Up</Link>
//       </p>
//     </div>
//   );
// }

// export default LoginPage;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

// const LoginPage = () => {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8000/login/', {
//                 username: email,
//                 // first_name: firstName,
//                 // last_name: lastName,
//                 password: password,
//             });
//             console.log('User login', response.data);
//         } catch (error) {
//             console.error('Error user login:', error);
//         }
//     };

//     return (
//         <Container component="main" maxWidth="xs" sx={{ height: '90vh' }}>
//             <Box 
//                 sx={{ 
//                     display: 'flex', 
//                     flexDirection: 'column', 
//                     justifyContent: 'center', 
//                     height: '100%' 
//                 }}
//             >
//                 <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
//                     <Typography variant="h4" align="center" gutterBottom>
//                         Login
//                     </Typography>
//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="Username"
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                         />
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="Password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             sx={{ marginTop: 2 }}
//                         >
//                             Login
//                         </Button>
//                     </form>
//                     <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
//                         Don't have an account? <Link to="/signup">Sign Up</Link>
//                     </Typography>
//                 </Paper>
//             </Box>
//         </Container>
//     );
// };

// // export default LoginPage;
// import React, { useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8000/login/', {
//                 email: email,
//                 password: password,
//             });
//             console.log('User login', response.data);
//         } catch (error) {
//             console.error('Error user login:', error);
//         }
//     };

//     return (
//         <Container component="main" maxWidth="xs" sx={{ height: '90vh' }}>
//             <Box 
//                 sx={{ 
//                     display: 'flex', 
//                     flexDirection: 'column', 
//                     justifyContent: 'center', 
//                     height: '100%' 
//                 }}
//             >
//                 <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
//                     <Typography variant="h4" align="center" gutterBottom>
//                         Login
//                     </Typography>
//                     <form onSubmit={handleSubmit}>
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="Email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//                         <TextField
//                             variant="outlined"
//                             margin="normal"
//                             required
//                             fullWidth
//                             label="Password"
//                             type="password"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                         />
//                         <Button
//                             type="submit"
//                             fullWidth
//                             variant="contained"
//                             color="primary"
//                             sx={{ marginTop: 2 }}
//                         >
//                             Login
//                         </Button>
//                     </form>
//                     <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
//                         Don't have an account? <Link to="/signup">Sign Up</Link>
//                     </Typography>
//                 </Paper>
//             </Box>
//         </Container>
//     );
// };

// export default LoginPage;


import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/login/', {
                email: email,
                password: password,
            });
            
            console.log('User login', response.data);
            // cookies.set = `access=${response.data.access}; HttpOnly`;
            // document.cookie = `refresh=${response.data.refresh}; HttpOnly`;
            Cookies.set('access', response.data.access);
            Cookies.set('refresh', response.data.refresh);
            // setUser(data.user);
            // Redirect to the chat page or any other page
            navigate('/chats');
        } catch (error) {
            console.error('Error user login:', error);
            alert('Invalid credentials');
        }
    };

    return (
        <Container component="main" maxWidth="xs" sx={{ height: '90vh' }}>
            <Box 
                sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'center', 
                    height: '100%' 
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 2 }}
                        >
                            Login
                        </Button>
                    </form>
                    <Typography variant="body2" align="center" sx={{ marginTop: 2 }}>
                        Don't have an account? <Link to="/signup">Sign Up</Link>
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;

