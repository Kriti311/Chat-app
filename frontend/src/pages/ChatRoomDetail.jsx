// src/components/ChatRoomDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { List, ListItem, ListItemText, TextField, Button } from '@mui/material';

const ChatRoomDetail = () => {
    const { room_name } = useParams();
    const [chatRoom, setChatRoom] = useState({});
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        axios.get(`http://localhost:8000/rooms/${room_name}/`)
            .then(response => {
                setChatRoom(response.data.chat_room);
                setMessages(response.data.messages);
            });
    }, [room_name]);

    const handleSendMessage = () => {
        // Implement send message functionality here
        setNewMessage('');
    };

    return (
        <div>
            <h2>{chatRoom.name}</h2>
            <List>
                {messages.map(message => (
                    <ListItem key={message.id}>
                        <ListItemText primary={message.content} secondary={message.timestamp} />
                    </ListItem>
                ))}
            </List>
            <TextField
                label="New Message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                fullWidth
            />
            <Button onClick={handleSendMessage} variant="contained" color="primary">
                Send
            </Button>
        </div>
    );
};

export default ChatRoomDetail;
