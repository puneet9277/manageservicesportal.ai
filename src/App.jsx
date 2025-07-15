import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginForm';
import Dashboard from './pages/Dashboard';
import AWSInstancePage from './pages/AWSInstancePage';
import CreateAlarmForm from './pages/CreateAlarmForm';
import AWSLearningDashboard from './pages/AWSLearningDashboard';
import ServicesRunningPage from './pages/ServicesRunningPage';
import BillingPage from './pages/BillingPage';
import CloudTrailPage from './pages/CloudTrailPage';
import CloudWatchTrailPage from './pages/CloudWatchTrailPage';
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
        <Route path="/services-running" element={<ServicesRunningPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/cloudtrail" element={<CloudTrailPage />} />
        <Route path="/cloudwatch-trail" element={<CloudWatchTrailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
