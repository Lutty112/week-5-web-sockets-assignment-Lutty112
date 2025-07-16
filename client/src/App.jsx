import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import RoomSelector from './pages/RoomSelector';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './utils/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/rooms" element={
              <ProtectedRoute>
                <RoomSelector />
              </ProtectedRoute>
            } 
          />
          <Route path="/chat/:roomId" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <ToastContainer />
      </Router>
    </AuthProvider>
  );
}
