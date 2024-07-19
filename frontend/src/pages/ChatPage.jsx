// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { Box, Typography } from '@mui/material';
// import MessageComponent from './MessageComponent.jsx';
// import '../styles/ChatPage.css';

// function ChatPage() {
//   const { id } = useParams(); // Get the recipient ID from the URL params

//   return (
//     <Box className="chat-page" sx={{ padding: 2 }}>
//       <Typography variant="h4">Chat with User ID: {id}</Typography>
//       <div className="messages">
//         <MessageComponent recipientId={id} />
//       </div>
//     </Box>
//   );
// }

// export default ChatPage;

// // ChatRoom.js
// import React from 'react';
// import { Box, Typography } from '@mui/material';

// const ChatRoom = ({ senderId, receiverId }) => {
//     return (
//         <Box sx={{ marginTop: 2, padding: 2, border: '1px solid', borderRadius: 1 }}>
//             <Typography variant="h5" gutterBottom>
//                 Chat Room
//             </Typography>
//             <Typography variant="body1">Sender ID: {senderId}</Typography>
//             <Typography variant="body1">Receiver ID: {receiverId}</Typography>
//             {/* Add your chat message UI and logic here */}
//         </Box>
//     );
// };

// export default ChatRoom;


// ChatPage.jsx

import React from 'react';
import { useParams } from 'react-router-dom';
import ChatRoom from './ChatRoom'; // Import your ChatRoom component

const ChatPage = () => {
    const { id } = useParams(); // Get the chat room ID from URL

    return (
        <div>
            <h2>Chat Room ID: {id}</h2>
            <ChatRoom roomName={id} /> {/* Pass room name or ID to ChatRoom */}
        </div>
    );
};

export default ChatPage;
