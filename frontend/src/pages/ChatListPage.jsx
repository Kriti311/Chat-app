// import React from 'react';
// import { Link } from 'react-router-dom';
// import '../styles/ChatList.css';

// function ChatListPage() {
//   // This will be replaced with actual chat list data
//   const chats = [
//     { id: 1, name: 'Chat 1' },
//     { id: 2, name: 'Chat 2' },
//   ];

//   return (
//     <div className="chat-list-page">
//       <h1>Your Chats</h1>
//       <ul>
//         {chats.map(chat => (
//           <li key={chat.id}>
//             <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ChatListPage;
// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import '../styles/ChatList.css';
// import { Button, Box } from '@mui/material';

// function ChatListPage() {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     navigate('/logout');
//   };

//   // This will be replaced with actual chat list data
//   const chats = [
//     { id: 1, name: 'Chat 1' },
//     { id: 2, name: 'Chat 2' },
//   ];

//   return (
//     <div className="chat-list-page">
//       <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//         <h1>Your Chats</h1>
//         <div>
//           <Button variant="contained" color="primary" onClick={() => navigate('/profile')}>
//             Update Profile
//           </Button>
//           <Button variant="contained" color="secondary" onClick={handleLogout} sx={{ ml: 2 }}>
//             Logout
//           </Button>
//         </div>
//       </Box>
//       <ul>
//         {chats.map(chat => (
//           <li key={chat.id}>
//             <Link to={`/chat/${chat.id}`}>{chat.name}</Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default ChatListPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
// import ChatRoom from './ChatPage';

// const ChatList = () => {
//     const [chats, setChats] = useState([]);
//     const [selectedChat, setSelectedChat] = useState(null);
//     const senderId = "123";  // Replace with actual sender ID from your authentication system

//     useEffect(() => {
//         axios.get('http://localhost:8000/get_user_chats/')
//             .then(response => {
//                 setChats(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching chats:', error);
//             });
//     }, []);

//     const handleChatSelect = (chat) => {
//         setSelectedChat(chat);
//     };

//     return (
//         <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
//             <Typography variant="h4" gutterBottom>
//                 Chat List
//             </Typography>
//             <List>
//                 {chats.map(chat => (
//                     <ListItem button key={chat.chat_id} onClick={() => handleChatSelect(chat)}>
//                         <ListItemText primary={chat.receiver_name} />
//                     </ListItem>
//                 ))}
//             </List>
//             {selectedChat && (
//                 <ChatRoom senderId={senderId} receiverId={selectedChat.receiver_id} />
//             )}
//         </Box>
//     );
// };

// export default ChatList;

// ChatList.jsx

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography } from '@mui/material';

// const ChatList = ({ onChatSelect }) => {
//     const [chats, setChats] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:8000/get_user_chats/')
//             .then(response => {
//                 setChats(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching chats:', error);
//             });
//     }, []);

//     return (
//         <div>
//             <Typography variant="h6" gutterBottom>
//                 Chat List
//             </Typography>
//             <List>
//                 {chats.map(chat => (
//                     <ListItem button key={chat.chat_id} onClick={() => onChatSelect(chat)}>
//                         <ListItemText primary={chat.receiver_name} />
//                     </ListItem>
//                 ))}
//             </List>
//         </div>
//     );
// };

// export default ChatList;

// ChatListPage.jsx or App.jsx

// import React, { useState } from 'react';
// import CreateChatRoom from './CreateChatRoom';
// import ChatList from './ChatPage'; // Assuming you have a ChatList component

// const ChatListPage = () => {
//     const [chats, setChats] = useState([]);

//     const handleRoomCreated = (newRoom) => {
//         setChats((prevChats) => [...prevChats, newRoom]);
//     };

//     return (
//         <div>
//             <ChatList chats={chats} />
//         </div>
//     );
// };

// export default ChatListPage;


// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography, Container, Paper } from '@mui/material';

// const ChatListPage = () => {
//     const [chats, setChats] = useState([]);

//     useEffect(() => {
//         const fetchChats = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/get_user_chats/'); // Adjust the endpoint as needed
//                 setChats(response.data);
//             } catch (error) {
//                 console.error('Error fetching chat rooms:', error);
//             }
//         };

//         fetchChats();
//     }, []);

//     return (
//         <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
//             <Typography variant="h4" gutterBottom>
//                 Chat List
//             </Typography>
//             <List>
//                 {chats.map(chat => (
//                     <ListItem button component={Link} to={`/chat/${chat.room_name}/`} key={chat.id}>
//                         <ListItemText primary={chat.name} />
//                     </ListItem>
//                 ))}
//             </List>
//         </Container>
//     );
// };

// export default ChatListPage;


// // ChatListPage.jsx
// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography, Container, Paper } from '@mui/material';

// const ChatListPage = () => {
//     const [users, setUsers] = useState([]);

//     useEffect(() => {
//         const fetchUsers = async () => {
//             try {
//                 const response = await axios.get('http://localhost:8000/get_user_chats/'); // New endpoint for users
//                 setUsers(response.data);
//             } catch (error) {
//                 console.error('Error fetching users:', error);
//             }
//         };

//         fetchUsers();
//     }, []);

//     return (
//         <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
//             <Typography variant="h4" gutterBottom>
//                 Available Users
//             </Typography>
//             <List>
//                 {users.map(user => (
//                     <ListItem button component={Link} to={`/chat/${user.username}/`} key={user.id}>
//                         <ListItemText primary={user.username} />
//                     </ListItem>
//                 ))}
//             </List>
//         </Container>
//     );
// };

// export default ChatListPage;


import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, Container, Paper } from '@mui/material';

const ChatListPage = () => {
    const [users, setUsers] = useState([]);
    const history = useHistory();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get_user_chats/'); // Endpoint to fetch users
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const startChat = async (userId) => {
        try {
            const response = await axios.post('http://localhost:8000/create-chat-room/', { user2_id: userId });
            const roomName = response.data.room_name;
            // Redirect to the chat room page
            history.push(`/chat/${roomName}/`);
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    return (
        <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
            <Typography variant="h4" gutterBottom>
                Available Users
            </Typography>
            <List>
                {users.map(user => (
                    <ListItem button onClick={() => startChat(user.id)} key={user.id}>
                        <ListItemText primary={user.username} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default ChatListPage;
