import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AWSInstancePage from './components/AWSInstancePage';
import CreateAlarmForm from './components/CreateAlarmForm';
import AWSLearningDashboard from './components/AWSLearningDashboard';
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/aws-dashboard" element={<AWSInstancePage />} />
        <Route path="/aws-learning" element={<AWSLearningDashboard />} />
        <Route path="/create-alarm/:instanceId" element={<CreateAlarmForm />} />
      </Routes>
    </Router>
  );
}

export default App;
