import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/backenInt';

export default function RoomSelector() {
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  

if (!userId) {
  console.warn("⚠️ No userId found in localStorage");
}

  useEffect(() => {
    API.get('/rooms')
      .then((res) => setRooms(res.data))
      .catch((err) => console.error('Failed to fetch rooms:', err));
  }, []);

  const handleJoinRoom = (room) => {
    navigate(`/chat/${room._id}`);
  };

  const handleCreateRoom = async () => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  console.log("Creating room with userId:", userId); // 🔍 Important Debug

  if (!userId || !token) {
    alert("Missing user credentials. Please login again.");
    navigate("/");
    return;
  }

  try {
    const res = await API.post(
      "/rooms",
      {
       name: roomName.trim(),
       description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    navigate(`/chat/${res.data._id}`);
  } catch (err) {
    console.error("Error creating room:", err);
    alert(err.response?.data?.error || "Failed to create room");
  }
};


  return (
    <div className="min-h-screen bg-gray-200 text-gray-700 p-4">
      <button
        onClick={() => navigate('/')}
        className="bg-gray-400 text-pink-600 px-4 py-2 rounded hover:bg-gray-600 mb-6">
        Back to Login
      </button>

      <div className="max-w-3xl mx-auto bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold text-pink-700 mb-4 text-center">
          Convo Cloud — Room Selector
        </h1>

          <div className="mb-6">
          <h2 className="text-xl text-pink-700 font-semibold mb-2">📋 Available Rooms:</h2>
          {rooms.length === 0 ? (
            <p className="text-gray-500">No rooms available yet. Create one below 👇</p>
          ) : (
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room._id}>
                  <button
                    onClick={() => handleJoinRoom(room)}
                    className="text-gray-600 hover:underline">
                    🔹 {room.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Create Room */}
        <div>
          <h2 className="text-xl text-pink-700 font-semibold mb-2">➕ Create a New Room</h2>
          <p className="text-sm text-gray-600 mb-2">Set a unique name and short description.</p>
          <input
            className="w-full border p-2 rounded mb-2"
            placeholder="Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <input
            className="w-full border p-2 rounded mb-4"
            placeholder="Room Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button
            onClick={handleCreateRoom}
            className="bg-pink-700 text-white px-4 py-2 rounded hover:bg-pink-900 w-full"
          >
            Create Room
          </button>
        </div>
      </div>
    </div>
  );
}
