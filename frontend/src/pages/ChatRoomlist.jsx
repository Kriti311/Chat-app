// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import ChatListPage from './ChatListPage';
// import ChatRoom from './ChatRoom';

// const ChatRoomList = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [socket, setSocket] = useState(null);
//     const [roomName, setRoomName] = useState(null);
//     const navigate = useNavigate();
//     const [selectedChat,setSelectedChat] = useState(false);

//     useEffect(() => {
//         const token = Cookies.get('access');
//         if (!token) {
//             console.error('No authentication token found');
//             return;
//         }

//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         };

//         // Fetch the list of users
//         // axios.get('http://localhost:8000/users/', { headers })
//         axios.get('http://localhost:8000/user-rooms/', { headers })
//             .then(response => {
//                 console.log("user-rooms: ",response.data)
//                 setUsers(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching users:', error);
//             });

//         // Fetch the current user
//         axios.get('http://localhost:8000/user_info/', { headers })
//             .then(response => {
//                 setCurrentUser(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching current user:', error);
//             });
//     }, []);

//     useEffect(() => {
//         if (currentUser && roomName) {
//             const token = Cookies.get('access');
//             const wsUrl = `ws://localhost:8001/ws/chat/${roomName}/?token=${token}`;
//             const ws = new WebSocket(wsUrl);

//             ws.onopen = () => {
//                 console.log("WebSocket connection established");
//             };

//             ws.onmessage = (event) => {
//                 const data = JSON.parse(event.data);
//                 console.log("WebSocket message received:", data);
//                 // if (data.command === 'redirect_to_chat') {
//                 //     navigate(`/chat/${data.room_name}`);
//                 // }
//             };

//             ws.onclose = () => {
//                 console.log("WebSocket connection closed");
//             };

//             setSocket(ws);

//             return () => {
//                 ws.close();
//                 console.log("WebSocket connection closed from cleanup");
//             };
//         }
//     }, [currentUser, roomName, navigate]);

//     const handleUserClick = (userId) => {
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             console.log('Sending message to WebSocket:', {
//                 command: 'create_room',
//                 from_user_id: currentUser.id,
//                 to_user_id: userId
//             });
//             socket.send(JSON.stringify({
//                 command: 'create_room',
//                 from_user_id: currentUser.id,
//                 to_user_id: userId
//             }));
//         } else {
//             console.error('WebSocket is not open. Cannot send message.');
//         }
//     };

//     const handleRoomName = (name) => {
//         setRoomName(name);
//     };

//     if (!currentUser) return <div>Loading...</div>;

//     const filteredUsers = users.filter(user => user.id !== currentUser.id);

//     return (
//         <div style={{ display: 'flex' }}>
//             <div style={{ width: '30%', padding: '10px', borderRight: '1px solid #ddd' }}>
//                 <Typography variant="h6">Users</Typography>
//                 <List>
//                     {filteredUsers.map(user => (
//                         <ListItem
//                             button
//                             onClick={() => {
//                                 // const newRoomName = `${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`
//                                 handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
//                                 // handleRoomName(`chat_${currentUser.id}_${user.id}`); // Assuming room name format
//                                 handleUserClick(user.id);
//                                 setSelectedChat(true);
//                             }}
//                             key={user.id}
//                         >
//                             <ListItemText primary={`${user.first_name} ${user.last_name}`} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </div>
//             {selectedChat && <ChatRoom roomName={roomName}/>}
//         </div>
//     );
// };

// export default ChatRoomList;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography, TextField, Container, Paper } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import ChatRoom from './ChatRoom';

// const ChatRoomList = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [socket, setSocket] = useState(null);
//     const [roomName, setRoomName] = useState(null);
//     const [selectedChat, setSelectedChat] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = Cookies.get('access');
//         if (!token) {
//             console.error('No authentication token found');
//             return;
//         }

//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         };

//         axios.get('http://localhost:8000/user-rooms/', { headers })
//             .then(response => {
//                 console.log("user-rooms: ", response.data);
//                 setUsers(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching users:', error);
//             });

//         // Fetch the current user
//         axios.get('http://localhost:8000/user_info/', { headers })
//             .then(response => {
//                 setCurrentUser(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching current user:', error);
//             });
//     }, []);

//     useEffect(() => {
//         if (currentUser && roomName) {
//             const token = Cookies.get('access');
//             const wsUrl = `ws://localhost:8001/ws/chat/${roomName}/?token=${token}`;
//             const ws = new WebSocket(wsUrl);

//             ws.onopen = () => {
//                 console.log("WebSocket connection established");
//             };

//             ws.onmessage = (event) => {
//                 const data = JSON.parse(event.data);
//                 console.log("WebSocket message received:", data);
//             };

//             ws.onclose = () => {
//                 console.log("WebSocket connection closed");
//             };

//             setSocket(ws);

//             return () => {
//                 ws.close();
//                 console.log("WebSocket connection closed from cleanup");
//             };
//         }
//     }, [currentUser, roomName, navigate]);

//     const handleUserClick = (userId) => {
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             console.log('Sending message to WebSocket:', {
//                 command: 'create_room',
//                 from_user_id: currentUser.id,
//                 to_user_id: userId
//             });
//             socket.send(JSON.stringify({
//                 command: 'create_room',
//                 from_user_id: currentUser.id,
//                 to_user_id: userId
//             }));
//         } else {
//             console.error('WebSocket is not open. Cannot send message.');
//         }
//     };

//     const handleRoomName = (name) => {
//         setRoomName(name);
//     };

//     const handleSearch = async () => {
//         try {
//             const token = Cookies.get('access');
//             const response = await fetch(`http://localhost:8000/search-users/?q=${searchQuery}`, {
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             const data = await response.json();
//             setSearchResults(data);
//         } catch (error) {
//             console.error('Error searching for users:', error);
//             setSearchResults([]);
//         }
//     };

//     if (!currentUser) return <div>Loading...</div>;

//     const filteredUsers = users.filter(user => user.id !== currentUser.id);

//     return (
//         <div style={{ display: 'flex' }}>
//             <div style={{ width: '30%', padding: '10px', borderRight: '1px solid #ddd' }}>
//                 {/* <Typography variant="h6">Users</Typography> */}
//                 <TextField
//                     fullWidth
//                     variant="outlined"
//                     label="Search"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     style={{ marginBottom: '20px' }}
//                     onKeyPress={(e) => {
//                         if (e.key === 'Enter') {
//                             handleSearch();
//                         }
//                     }}
//                 />
//                 <List>
//                     {searchResults.map(user => (
//                         <ListItem
//                             button
//                             onClick={() => {
//                                 handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
//                                 handleUserClick(user.id);
//                                 setSelectedChat(true);
//                             }}
//                             key={user.id}
//                         >
//                             <ListItemText primary={`${user.first_name} ${user.last_name}`} />
//                         </ListItem>
//                     ))}
//                 </List>
//                 {/* <Typography variant="h6">Chat Rooms</Typography> */}
//                 <List>
//                     {filteredUsers.map(user => (
//                         <ListItem
//                             button
//                             onClick={() => {
//                                 handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
//                                 handleUserClick(user.id);
//                                 setSelectedChat(true);
//                             }}
//                             key={user.id}
//                         >
//                             <ListItemText primary={`${user.first_name} ${user.last_name}`} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </div>
//             {selectedChat && <ChatRoom roomName={roomName} />}
//         </div>
//     );
// };

// export default ChatRoomList;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { List, ListItem, ListItemText, Typography, TextField, Container, Paper } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';
// import ChatRoom from './ChatRoom';

// const ChatRoomList = () => {
//     const [users, setUsers] = useState([]);
//     const [currentUser, setCurrentUser] = useState(null);
//     const [socket, setSocket] = useState(null);
//     const [roomName, setRoomName] = useState(null);
//     const [selectedChat, setSelectedChat] = useState(false);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [searchResults, setSearchResults] = useState([]);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = Cookies.get('access');
//         if (!token) {
//             console.error('No authentication token found');
//             return;
//         }

//         const headers = {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//         };

//         axios.get('http://localhost:8000/user-rooms/', { headers })
//             .then(response => {
//                 console.log("user-rooms: ", response.data);
//                 setUsers(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching users:', error);
//             });

//         // Fetch the current user
//         axios.get('http://localhost:8000/user_info/', { headers })
//             .then(response => {
//                 setCurrentUser(response.data);
//             })
//             .catch(error => {
//                 console.error('Error fetching current user:', error);
//             });
//     }, []);

//     useEffect(() => {
//         if (currentUser && roomName) {
//             const token = Cookies.get('access');
//             const wsUrl = `ws://localhost:8001/ws/chat/${roomName}/?token=${token}`;
//             const ws = new WebSocket(wsUrl);

//             ws.onopen = () => {
//                 console.log("WebSocket connection established");
//             };

//             ws.onmessage = (event) => {
//                 const data = JSON.parse(event.data);
//                 console.log("WebSocket message received:", data);
//             };

//             ws.onclose = () => {
//                 console.log("WebSocket connection closed");
//             };

//             setSocket(ws);

//             return () => {
//                 ws.close();
//                 console.log("WebSocket connection closed from cleanup");
//             };
//         }
//     }, [currentUser, roomName, navigate]);

//     useEffect(() => {
//         const handleSearch = async () => {
//             if (searchQuery.trim() === '') {
//                 setSearchResults([]);
//                 return;
//             }

//             try {
//                 const token = Cookies.get('access');
//                 const response = await fetch(`http://localhost:8000/search-users/?q=${searchQuery}`, {
//                     headers: {
//                         'Authorization': `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });
//                 const data = await response.json();
//                 setSearchResults(data);
//             } catch (error) {
//                 console.error('Error searching for users:', error);
//                 setSearchResults([]);
//             }
//         };

//         const delayDebounceFn = setTimeout(() => {
//             handleSearch();
//         }, 300); // Delay the search by 300ms

//         return () => clearTimeout(delayDebounceFn);
//     }, [searchQuery]);

//     const handleUserClick = (userId) => {
//         if (socket && socket.readyState === WebSocket.OPEN) {
//             console.log('Sending message to WebSocket:', {
//                 command: 'create_room',
//                 from_user_id: currentUser.id,
//                 to_user_id: userId
//             });
//             socket.send(JSON.stringify({
//                 command: 'create_room',
//                 from_user_id: currentUser.id,
//                 to_user_id: userId
//             }));
//         } else {
//             console.error('WebSocket is not open. Cannot send message.');
//         }
//     };

//     const handleRoomName = (name) => {
//         setRoomName(name);
//     };

//     if (!currentUser) return <div>Loading...</div>;

//     const filteredUsers = users.filter(user => user.id !== currentUser.id);

//     return (
//         <div style={{ display: 'flex' }}>
//             <div style={{ width: '30%', padding: '10px', borderRight: '1px solid #ddd' }}>
//                 {/* <Typography variant="h6">Users</Typography> */}
//                 <TextField
//                     fullWidth
//                     variant="outlined"
//                     label="Search"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     style={{ marginBottom: '20px' }}
//                 />
//                 <List>
//                     {searchResults.map(user => (
//                         <ListItem
//                             button
//                             onClick={() => {
//                                 handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
//                                 handleUserClick(user.id);
//                                 setSelectedChat(true);
//                                 setSearchQuery('');
//                             }}
//                             key={user.id}
//                         >
//                             <ListItemText primary={`${user.first_name} ${user.last_name}`} />
//                         </ListItem>
//                     ))}
//                 </List>
//                 {/* <Typography variant="h6">Chat Rooms</Typography> */}
//                 <List>
//                     {filteredUsers.map(user => (
//                         <ListItem
//                             button
//                             onClick={() => {
//                                 handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
//                                 handleUserClick(user.id);
//                                 setSelectedChat(true);
//                             }}
//                             key={user.id}
//                         >
//                             <ListItemText primary={`${user.first_name} ${user.last_name}`} />
//                         </ListItem>
//                     ))}
//                 </List>
//             </div>
//             {selectedChat && <ChatRoom roomName={roomName} />}
//         </div>
//     );
// };

// export default ChatRoomList;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import ChatRoom from './ChatRoom';

const ChatRoomList = () => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [roomName, setRoomName] = useState(null);
    const [selectedChat, setSelectedChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = Cookies.get('access');
        if (!token) {
            console.error('No authentication token found');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        axios.get('http://localhost:8000/user-rooms/', { headers })
            .then(response => {
                console.log("user-rooms: ", response.data);
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });

        // Fetch the current user
        axios.get('http://localhost:8000/user_info/', { headers })
            .then(response => {
                setCurrentUser(response.data);
            })
            .catch(error => {
                console.error('Error fetching current user:', error);
            });
    }, []);

    useEffect(() => {
        if (currentUser && roomName) {
            const token = Cookies.get('access');
            const wsUrl = `ws://localhost:8001/ws/chat/${roomName}/?token=${token}`;
            const ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connection established");
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log("WebSocket message received:", data);
            };

            ws.onclose = () => {
                console.log("WebSocket connection closed");
            };

            setSocket(ws);

            return () => {
                ws.close();
                console.log("WebSocket connection closed from cleanup");
            };
        }
    }, [currentUser, roomName, navigate]);

    useEffect(() => {
        const handleSearch = async () => {
            if (searchQuery.trim() === '') {
                setSearchResults([]);
                return;
            }

            try {
                const token = Cookies.get('access');
                const response = await axios.get(`http://localhost:8000/search-users/?q=${searchQuery}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error searching for users:', error);
                setSearchResults([]);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            handleSearch();
        }, 300); // Delay the search by 300ms

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const handleUserClick = (userId) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            console.log('Sending message to WebSocket:', {
                command: 'create_room',
                from_user_id: currentUser.id,
                to_user_id: userId
            });
            socket.send(JSON.stringify({
                command: 'create_room',
                from_user_id: currentUser.id,
                to_user_id: userId
            }));
        } else {
            console.error('WebSocket is not open. Cannot send message.');
        }
    };

    const handleRoomName = (name) => {
        setRoomName(name);
    };

    if (!currentUser) return <div>Loading...</div>;

    const filteredUsers = users.filter(user => user.id !== currentUser.id);

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '30%', padding: '10px', borderRight: '1px solid #ddd' }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ marginBottom: '20px' }}
                />
                <List>
                    {searchResults.map(user => (
                        <ListItem
                            button
                            onClick={() => {
                                handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
                                handleUserClick(user.id);
                                setSelectedChat(true);
                                setSearchQuery(''); // Clear the search bar when a user is clicked
                            }}
                            key={user.id}
                        >
                            <ListItemText primary={`${user.first_name} ${user.last_name}`} />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="h6">Chats</Typography>
                <List>
                    {filteredUsers.map(user => (
                        <ListItem
                            button
                            onClick={() => {
                                handleRoomName(`${Math.min(currentUser.id, user.id)}_${Math.max(currentUser.id, user.id)}`);
                                handleUserClick(user.id);
                                setSelectedChat(true);
                                setSearchQuery(''); 
                            }}
                            key={user.id}
                        >
                            <ListItemText 
                            primary={`${user.first_name} ${user.last_name}`} 
                            secondary={user.last_message || "No messages yet"} 
                            />
                        </ListItem>
                    ))}
                </List>
            </div>
            {selectedChat && <ChatRoom roomName={roomName} />}
        </div>
    );
};

export default ChatRoomList;
