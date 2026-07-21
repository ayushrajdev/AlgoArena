import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import ProblemDescription from './pages/Description/ProblemDescription';
// import ProblemList from './pages/ProblemList/ProblemList';
// import LandingPage from './pages/Home/LandingPage';
// import Login from './pages/Login/Login';
// import Register from './pages/Register/Register';
// import ProfilePage from './pages/Profile/Profile';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/Home/LandingPage';
import ProblemList from './pages/ProblemList/ProblemList';
import ProblemDescription from './pages/Description/ProblemDescription';
import socket from './socket';
import { useEffect } from 'react';

function App() {
    useEffect(() => {
        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <div className="min-h-[100vh]">
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<RegisterPage />} />

                        <Route element={<ProtectedRoute />}>
                            <Route path="/problems" element={<ProblemList />} />
                            <Route
                                path="/problems/:problemId"
                                element={<ProblemDescription />}
                            />
                            <Route path="/profile" element={<ProfilePage />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </div>
    );
}

export default App;
