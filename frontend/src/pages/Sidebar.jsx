import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Sidebar = ({ onSelectChat }) => {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        const fetchChats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/get_user_chats/', { headers });
                setChats(response.data);
            } catch (error) {
                console.error("Error fetching user chats", error);
            }
        };

        fetchChats();
    }, []);

    return (
        <div className="sidebar">
            {chats.map(chat => (
                <div key={chat.chat_id} onClick={() => onSelectChat(chat.chat_id)}>
                    <h4>{chat.participants.map(p => p.username).join(', ')}</h4>
                    <p>{chat.last_message.content}</p>
                    <span>{new Date(chat.last_message.timestamp).toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
