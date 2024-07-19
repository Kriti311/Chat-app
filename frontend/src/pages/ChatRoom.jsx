// ChatRoom.jsx

import React, { useEffect, useState } from 'react';
import { TextField, Button, List, ListItem, Typography, Box } from '@mui/material';

const ChatRoom = ({ roomName }) => {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const chatSocket = new WebSocket(`ws://${window.location.host}/ws/chat/${roomName}/`);

    useEffect(() => {
        chatSocket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            setMessages(prevMessages => [...prevMessages, data.message]);
        };

        chatSocket.onclose = (e) => {
            console.error('Chat socket closed unexpectedly');
        };

        return () => {
            chatSocket.close();
        };
    }, [roomName]);

    const handleSendMessage = () => {
        if (message) {
            chatSocket.send(JSON.stringify({ message }));
            setMessage('');
        }
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Chat Room: {roomName}
            </Typography>
            <List style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <ListItem key={index}>{msg}</ListItem>
                ))}
            </List>
            <TextField
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                label="Type a message"
                variant="outlined"
                fullWidth
                style={{ marginBottom: '8px' }}
            />
            <Button onClick={handleSendMessage} variant="contained" color="primary" fullWidth>
                Send
            </Button>
        </Box>
    );
};

export default ChatRoom;

