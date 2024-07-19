// // import React from 'react';
// // import { Link } from 'react-router-dom';
// // import '../styles/SignupPage.css';

// // function SignupPage() {
// //   return (
// //     <div className="signup-page">
// //       <h1>Sign Up</h1>
// //       <form>
// //         <input type="text" placeholder="Username" />
// //         <input type="email" placeholder="Email" />
// //         <input type="password" placeholder="Password" />
// //         <button type="submit">Sign Up</button>
// //       </form>
// //       <p>
// //         Already have an account? <Link to="/">Login</Link>
// //       </p>
// //     </div>
// //   );
// // }

// // export default SignupPage;

// import React, { useState } from 'react';
// import axios from 'axios';
// import '../styles/SignupPage.css';

// const SignupPage = () => {
//     const [email, setEmail] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8000/api/register/', {
//                 email: email,
//                 first_name: firstName,
//                 last_name: lastName,
//                 password: password,
//             });
//             console.log('User registered:', response.data);
//         } catch (error) {
//             console.error('Error registering user:', error);
//         }
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
//             <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
//             <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
//             <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
//             <button type="submit">Register</button>
//         </form>
//     );
// };

// export default SignupPage;

// import React, { useState } from 'react';
// import axios from 'axios';
// import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

// const SignupPage = () => {
//     const [email, setEmail] = useState('');
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [password, setPassword] = useState('');

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post('http://localhost:8000/api/register/', {
//                 email: email,
//                 first_name: firstName,
//                 last_name: lastName,
//                 password: password,
//             });
//             console.log('User registered:', response.data);
//         } catch (error) {
//             console.error('Error registering user:', error);
//         }
//     };

//     return (
//         <Container component="main" maxWidth="xs" sx={{height: '100vh' }}>
//             <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
//                 <Typography variant="h4" align="center" gutterBottom>
//                     Sign Up
//                 </Typography>
//                 <form onSubmit={handleSubmit}>
//                     <TextField
//                         variant="outlined"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                     <TextField
//                         variant="outlined"
//                         margin="normal"
//                         fullWidth
//                         label="First Name"
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                     />
//                     <TextField
//                         variant="outlined"
//                         margin="normal"
//                         fullWidth
//                         label="Last Name"
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                     />
//                     <TextField
//                         variant="outlined"
//                         margin="normal"
//                         required
//                         fullWidth
//                         label="Password"
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                     <Button
//                         type="submit"
//                         fullWidth
//                         variant="contained"
//                         color="primary"
//                         sx={{ marginTop: 2 }}
//                     >
//                         Register
//                     </Button>
//                 </form>
//             </Paper>
//         </Container>
//     );
// };

// export default SignupPage;
import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

const SignupPage = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/register/', {
                email: email,
                first_name: firstName,
                last_name: lastName,
                password: password,
            });
            console.log('User registered:', response.data);
            navigate('/chats');
        } catch (error) {
            console.error('Error registering user:', error);
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
                        Sign Up
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
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
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
                            Register
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default SignupPage;
