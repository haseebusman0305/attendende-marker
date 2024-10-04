import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import AddStudentsPage from './components/AddStudentsPage'
import AttendancePage from './components/AttendancePage';
import { Toaster } from 'react-hot-toast';
import './App.css';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-students" element={<AddStudentsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
        </Routes>
      </div>
    </Router>
  )
}