// import React, { useState, useEffect, useRef  } from 'react';
// import { TextField, Button, Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
// import Cookies from 'js-cookie';
// import { useParams } from 'react-router-dom';

// function ChatRoom({roomName}) {
//   // const { roomName } = useParams(); // Correctly using roomName from URL params
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [ws, setWs] = useState(null);
//   const chatContainerRef = useRef(null);

//   // Fetch historical messages
//   useEffect(() => {
//     if (roomName) {
//       const fetchHistoricalMessages = async () => {
//         try {
//           const token = Cookies.get('access');
//           const response = await fetch(`http://localhost:8000/message-history/${roomName}/`, {
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json',
//             },
//           });
//           if (response.status === 404) {
//             const errorData = await response.json();
//             if (errorData.detail === 'No ChatRoom matches the given query.') {
//               setMessages([]); // No chat room found, show empty messages
//               return;
//             }
//           }

//           const data = await response.json();
//           if (Array.isArray(data.messages)) {
//             setMessages(data.messages);
//           } else {
//             console.error('Unexpected data format:', data);
//             setMessages([]); // Fallback to empty array if format is unexpected
//           }
//         } catch (error) {
//           console.error('Error fetching historical messages:', error);
//           setMessages([]); // Fallback to empty array in case of error
//         }
//       };

//       fetchHistoricalMessages();
//     }
//   }, [roomName]);

//   // Function to establish a new WebSocket connection
//   const connect = () => {
//     const token = Cookies.get('access');
//     const url = `ws://localhost:8001/ws/chat/${roomName}/?token=${token}`;

//     const socket = new WebSocket(url);
//     setWs(socket);

//     socket.onopen = () => {
//       console.log('WebSocket connection established');
//     };

//     socket.onclose = (e) => {
//       console.error('WebSocket connection closed:', e.reason);
//     };

//     socket.onerror = (error) => {
//       console.error('WebSocket error:', error);
//     };

//     socket.onmessage = (event) => {
//       const messageData = JSON.parse(event.data);
//       console.log('Message from server:', messageData);
//       if (messageData && messageData.message) {
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             content: messageData.message,
//             sent_by_me: messageData.sent_by_me,
//             timestamp: messageData.timestamp // Ensure timestamp is handled
//           }
//         ]);
//       }
//     };

//     // Cleanup function to close the WebSocket when the component unmounts
//     return () => {
//       socket.close();
//     };
//   };

//   useEffect(() => {
//     if (roomName) {
//       // Establish initial connection
//       const cleanup = connect();
      
//       // Cleanup function for when the component unmounts
//       return () => {
//         cleanup();
//       };
//     }
//   }, [roomName]);

//   useEffect(() => {
//     // Scroll to bottom whenever messages change
//     if (chatContainerRef.current) {
//       chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const handleSendMessage = () => {
//     if (ws) {
//       if (ws.readyState === WebSocket.OPEN) {
//         const messageData = { command: 'send_message', message: message };
//         ws.send(JSON.stringify(messageData));
//         setMessage(''); // Clear the input field

//         // Temporarily add the message to the state to reflect it in real-time
//         // setMessages((prevMessages) => [
//         //   ...prevMessages,
//         //   {
//         //     content: message,
//         //     sent_by_me: true,
//         //     timestamp: new Date().toISOString() // Use current time for sent messages
//         //   }
//         // ]);
//       } else {
//         console.error('WebSocket is not open. ReadyState:', ws.readyState);
//       }
//     } else {
//       console.error('WebSocket instance is not initialized.');
//     }
//   };

//   const formatTimestamp = (timestamp) => {
//     const date = new Date(timestamp);
//     return `${date.getHours()}:${date.getMinutes()}`;
//   };

//   return (
//     <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '20px', maxWidth: '600px' }}>
//       <Typography variant="h4" gutterBottom>
//         Chat Room: {roomName}
//       </Typography>
//       <div
//         ref={chatContainerRef}
//         style={{ height: '300px', overflowY: 'scroll', marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}
//       >
//       {/* <div style={{ height: '300px', overflowY: 'scroll', marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}> */}
//         <List>
//           {messages.map((msg, index) => (
//             <ListItem key={index} style={{ justifyContent: msg.sent_by_me ? 'flex-end' : 'flex-start' }}>
//               <ListItemText
//                 primary={msg.content}
//                 secondary={formatTimestamp(msg.timestamp)} // Display timestamp here
//                 style={{ textAlign: msg.sent_by_me ? 'right' : 'left' }}
//               />
//             </ListItem>
//           ))}
//         </List>
//       </div>
//       <TextField
//         fullWidth
//         variant="outlined"
//         label="Type your message here..."
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//         style={{ marginBottom: '20px' }}
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={handleSendMessage}
//         fullWidth
//       >
//         Send
//       </Button>
//     </Container>
//   );
// }

// export default ChatRoom;


import React, { useState, useEffect, useRef } from 'react';
import { TextField, Button, Container, Typography, Paper, List, ListItem, ListItemText } from '@mui/material';
import Cookies from 'js-cookie';

function ChatRoom({ roomName }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const chatContainerRef = useRef(null);

  // Fetch historical messages
  useEffect(() => {
    if (roomName) {
      const fetchHistoricalMessages = async () => {
        try {
          const token = Cookies.get('access');
          const response = await fetch(`http://localhost:8000/message-history/${roomName}/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();

          // Check if the data is an array (as expected)
          if (Array.isArray(data)) {
            // Format messages to ensure correct structure
            const formattedMessages = data.map(msg => ({
              content: msg.content,
              sent_by_me: msg.user === yourUserId, // Ensure you replace `yourUserId` with the actual ID of the logged-in user
              timestamp: msg.timestamp,
            }));
            setMessages(formattedMessages);
          } else {
            console.error('Unexpected data format:', data);
          }
        } catch (error) {
          console.error('Error fetching historical messages:', error);
        }
      };

      fetchHistoricalMessages();
    }
  }, [roomName]);

  // Function to establish a new WebSocket connection
  const connect = () => {
    const token = Cookies.get('access');
    const url = `ws://localhost:8001/ws/chat/${roomName}/?token=${token}`;

    const socket = new WebSocket(url);
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    socket.onclose = (e) => {
      console.error('WebSocket connection closed:', e.reason);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      console.log('Message from server:', messageData);
      if (messageData && messageData.message) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            content: messageData.message,
            sent_by_me: messageData.sent_by_me,
            timestamp: messageData.timestamp
          }
        ]);
      }
    };

    return () => {
      socket.close();
    };
  };

  useEffect(() => {
    if (roomName) {
      const cleanup = connect();
      return () => {
        cleanup();
      };
    }
  }, [roomName]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const messageData = { command: 'send_message', message: message };
      ws.send(JSON.stringify(messageData));
      setMessage('');
    } else {
      console.error('WebSocket is not open or instance is not initialized.');
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getHours()}:${date.getMinutes()}`;
  };

  return (
    <Container component={Paper} elevation={3} style={{ padding: '20px', marginTop: '20px', maxWidth: '600px' }}>
      <Typography variant="h4" gutterBottom>
        Chat Room: {roomName}
      </Typography>
      <div
        ref={chatContainerRef}
        style={{ height: '300px', overflowY: 'scroll', marginBottom: '20px', border: '1px solid #ddd', padding: '10px' }}
      >
        <List>
          {messages.map((msg, index) => (
            <ListItem key={index} style={{ justifyContent: msg.sent_by_me ? 'flex-end' : 'flex-start' }}>
              <ListItemText
                primary={msg.content}
                secondary={formatTimestamp(msg.timestamp)}
                style={{ textAlign: msg.sent_by_me ? 'right' : 'left' }}
              />
            </ListItem>
          ))}
        </List>
      </div>
      <TextField
        fullWidth
        variant="outlined"
        label="Type your message here..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginBottom: '20px' }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        fullWidth
      >
        Send
      </Button>
    </Container>
  );
}

export default ChatRoom;

