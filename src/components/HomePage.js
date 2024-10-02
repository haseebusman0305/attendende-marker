import React from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function HomePage() {
  const resetStudents = () => {
    localStorage.removeItem('students')
    toast.success('Student data has been reset')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
      <h1 className="text-5xl font-bold mb-8 text-center animate-fade-in-down">Online Attendance Sheet Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/add-students"
          className="bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-100 transition duration-300 text-center animate-fade-in-up"
        >
          Add Students
        </Link>
        <Link
          to="/attendance"
          className="bg-white text-purple-600 px-8 py-4 rounded-lg text-xl font-semibold hover:bg-purple-100 transition duration-300 text-center animate-fade-in-up"
        >
          Mark Attendance
        </Link>
      </div>
      <button
        onClick={resetStudents}
        className="mt-8 bg-red-500 text-white px-6 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition duration-300 animate-fade-in-up"
      >
        Reset Student Data
      </button>
    </div>
  )
}