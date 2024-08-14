// CreateChatRoom.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';
import PropTypes from 'prop-types';

const CreateChatRoom = ({ onRoomCreated = () => {} }) => {
    const [roomName, setRoomName] = useState('');
    const [participants, setParticipants] = useState('');

    const handleCreateRoom = async () => {
        try {
            const response = await axios.post('http://localhost:8000/create_chat_room/', {
                name: roomName,
                participants: participants.split(',').map(id => id.trim()),
            });
            onRoomCreated(response.data);
            setRoomName('');
            setParticipants('');
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };

    return (
        <Box>
            <TextField
                label="Chat Room Name"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Participant IDs (comma separated)"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                fullWidth
                margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleCreateRoom}>
                Create Chat Room
            </Button>
        </Box>
    );
};
CreateChatRoom.propTypes = {
    onRoomCreated: PropTypes.func
};
export default CreateChatRoom;
