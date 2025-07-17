import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../services/backenInt';
import ImageUploader from '../components/ImageUploader';
import MessageBubble from '../components/MessageBubble';
import UserSidebar from '../components/UserSidebar';
import { toast } from 'react-toastify';
import API from '../services/backenInt';
import ChatArt from '../assets/ChatArt.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from  '../context/AuthContext';


export default function Chat() {
  const { roomId } = useParams();
  const username = localStorage.getItem('username');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 20;
  const navigate = useNavigate();
  const { logout } = useAuth();
  

  const currentUser = { _id: localStorage.getItem('userId') || 'me' };

  const fetchMessages = async () => {
  setLoadingMore(true);
  const res = await API.get(`/messages/room/${roomId}?skip=${page * limit}&limit=${limit}`);

  setMessages((prev) => {
    const combined = [...res.data, ...prev];
    const unique = Array.from(new Map(combined.map(msg => [msg._id, msg])).values());
    return unique;
  });

  setPage((p) => p + 1);
  setLoadingMore(false);
};

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
   fetch(`${API}/api/messages`)
    socket.emit('joinRoom', { username, roomId });

    socket.on('newMessage', (msg) => {
  if (!msg._id) return; 

  setMessages((prev) => {
    const exists = prev.some((m) => m._id === msg._id);
    return exists ? prev : [...prev, msg];
  });

  if (!document.hasFocus() && msg.sender._id !== currentUser._id) {
    setUnreadCount((prev) => prev + 1);
    new Audio('/notify.mp3').play();
    toast.info(`New message from ${msg.sender.username}`);
    new Notification(msg.sender.username, { body: msg.content });
  }
});


    socket.on('typing', (user) => {
      setTypingUsers((prev) => [...new Set([...prev, user])]);
    });

    socket.on('stopTyping', (user) => {
      setTypingUsers((prev) => prev.filter((u) => u !== user));
    });

   
    socket.on('userJoined', ({ user }) => {
    setOnlineUsers((prev) => {
    const uniqueUsers = [...prev, user].filter(
      (v, i, a) => a.findIndex(u => u._id === v._id) === i
    );
    return uniqueUsers;
  });
});

    const onFocus = () => setUnreadCount(0);
    window.addEventListener('focus', onFocus);

    return () => {
      socket.off('newMessage');
      socket.off('typing');
      socket.off('stopTyping');
      socket.off('userJoined');
      socket.off('userOffline');
      window.removeEventListener('focus', onFocus);
    };
  }, [roomId]);

 const handleSend = () => {
  if (message.trim()) {
    socket.emit(
      'sendMessage',
      {
        content: message,
        sender: localStorage.getItem('userId'),
        room: roomId,
      },
      (response) => {
        console.log('Delivered ✅', response?.id);
      }
    );
    setMessage('');
    socket.emit('stopTyping');
  }
};


  const handleTyping = () => {
    socket.emit('typing');
  };

  const handleSearch = async () => {
    const res = await API.get(`/messages/search?room=${roomId}&term=${message}`);
    setMessages(res.data);
  };

  const handleImageUpload = (url) => {
    socket.emit('sendMessage', { content: url, type: 'image' });
  };

  const handleScroll = (e) => {
    if (e.target.scrollTop === 0 && !loadingMore) {
      fetchMessages();
    }
  };

 const handleLogout = () => {
  console.log('Logout clicked');
  logout();
  navigate('/');
};

  const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        toast.success('Notifications enabled!');
      } else if (permission === 'denied') {
        toast.error('You blocked notifications. Enable them in browser settings.');
      }
    });
  } else if (Notification.permission === 'denied') {
    toast.error('You blocked notifications. Enable them in browser settings.');
  } else {
    toast.info('Notifications are already allowed.');
  }
};

const handleNotificationClick = () => {
  console.log('Notification button clicked');
  requestNotificationPermission();
};

  return (
    <div>
      <header className="bg-white p-4 flex items-center justify-between shadow w-full">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-pink-600">Convo Cloud</h1>
          <span className="text-sm font-medium text-pink-700 bg-gray-300 px-2 py-1 rounded">
            Room: {roomId}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
             className="bg-gray-400 text-pink-700 px-3 py-1 rounded text-sm"
             onClick={() => {
              logout(); 
              navigate('/'); 
               }}>
              Logout
          </button>
          <button
            className="bg-gray-400 text-pink-700 px-3 py-1 rounded text-sm"
            onClick={requestNotificationPermission}>
              🔔 Enable Notifications
          </button>
          <button
            onClick={() => navigate("/rooms")}
            className="bg-gray-400 text-pink-700 px-3 py-1 rounded text-sm">
              ⬅ Rooms
          </button>
        </div>
      </header>
      <UserSidebar users={onlineUsers} />

      <main className="flex-1 overflow-y-auto p-2" onScroll={handleScroll}>
        <div className="h-[60vh] overflow-y-scroll bg-white rounded shadow p-4 mb-2"
          style={{
              backgroundImage: `url(${ChatArt})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              minHeight: "100vh",
            }} >
              <div className="absolute inset-0 bg-gray opacity-40 z-0 pointer-events-none"/>
              <div className="relative z-10"></div>
          {messages.map((msg) => (
            <MessageBubble
              key={msg._id}
              message={msg}
              currentUser={currentUser._id}
              onReact={(messageId, emoji) => {
                socket.emit('addReaction', { messageId, emoji });
              }}
            />
          ))}

          {typingUsers.length > 0 && (
            <div className="text-sm italic text-coral-500">
              {typingUsers.join(', ')} typing...
            </div>
          )}
        </div>
    
        <div className="flex gap-2 mt-2">
          <input
            className="flex-1 border p-2 rounded"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleTyping}
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="bg-gray-400 text-pink-700 px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </main>

      <footer className="p-2 bg-white shadow flex flex-col gap-2">
        <ImageUploader onUpload={handleImageUpload} />
      </footer>
    </div>
  );
}
