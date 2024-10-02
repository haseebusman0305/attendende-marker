import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

export default function AddStudentsPage() {
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('students')
    return savedStudents ? JSON.parse(savedStudents) : []
  })
  const [newStudent, setNewStudent] = useState({ name: '', agNumber: '' })

  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newStudent.name && newStudent.agNumber) {
      if (!/^\d{4}-ag-\d{4}$/.test(newStudent.agNumber)) {
        toast.error('AG Number must be in the format YYYY-ag-XXXX')
        return
      }
      setStudents([...students, { ...newStudent, id: Date.now() }])
      setNewStudent({ name: '', agNumber: '' })
      toast.success('Student added successfully')
    } else {
      toast.error('Please fill in all fields')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl animate-fade-in-up">
        <div className="md:flex">
          <div className="p-8 w-full">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold mb-1">
              Add New Student
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={newStudent.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label htmlFor="agNumber" className="block text-sm font-medium text-gray-700">
                  AG Number (YYYY-ag-XXXX)
                </label>
                <input
                  type="text"
                  name="agNumber"
                  id="agNumber"
                  value={newStudent.agNumber}
                  onChange={handleInputChange}
                  placeholder="e.g. 2022-ag-7693"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                >
                  Add Student
                </button>
              </div>
            </form>
            <div className="mt-6">
              <Link
                to="/"
                className="text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}