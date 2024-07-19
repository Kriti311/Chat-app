import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, Paper, Typography, Box } from '@mui/material';

const MessageComponent = ({ recipientId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, [recipientId]);

    const fetchMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/direct-messages/${recipientId}/`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage) return;

        try {
            await axios.post('http://localhost:8000/direct-messages/send/', {
                recipient_id: recipientId,
                content: newMessage,
            });
            setNewMessage('');
            fetchMessages();  // Refresh messages after sending
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <Box sx={{ width: '100%', padding: 2 }}>
            <Typography variant="h6">Chat with User ID: {recipientId}</Typography>
            <Paper elevation={3} sx={{ padding: 2, maxHeight: '400px', overflowY: 'auto', marginBottom: 2 }}>
                {messages.map((message) => (
                    <Box key={message.id} sx={{ textAlign: message.sender === recipientId ? 'left' : 'right', marginBottom: 1 }}>
                        <Typography variant="body2" color={message.sender === recipientId ? 'primary' : 'secondary'}>
                            <strong>{message.sender}:</strong> {message.content} <em>{new Date(message.timestamp).toLocaleString()}</em>
                        </Typography>
                    </Box>
                ))}
            </Paper>
            <form onSubmit={sendMessage}>
                <TextField
                    fullWidth
                    variant="outlined"
                    label="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    required
                    sx={{ marginBottom: 1 }}
                />
                <Button type="submit" variant="contained" color="primary">Send</Button>
            </form>
        </Box>
    );
};

export default MessageComponent;
