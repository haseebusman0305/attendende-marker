import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AttendancePage() {
    const [currentSheet, setCurrentSheet] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        try {
            const savedStudents = localStorage.getItem('students');
            const students = savedStudents
                ? JSON.parse(savedStudents).map(student => ({ ...student, status: '' }))
                : [];

            const newSheet = { id: Date.now(), date, students };
            setCurrentSheet(newSheet);
        } catch (error) {
            toast.error('Error loading students: ' + error.message);
        }
    }, [date]);

    const handleStatusChange = (id, status) => {
        try {
            if (currentSheet) {
                const updatedStudents = currentSheet.students.map(student =>
                    student.id === id ? { ...student, status } : student
                );
                setCurrentSheet({ ...currentSheet, students: updatedStudents });
            }
        } catch (error) {
            toast.error('Error updating status: ' + error.message);
        }
    };

    const generateHTMLContent = () => {
        return `
        <html>
            <head>
                <title>Attendance Sheet - ${date}</title>
                <style>
                    body { font-family: Arial, sans-serif; }
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                <h1>Attendance Sheet</h1>
                <p>Date: ${date}</p>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>AG Number</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${currentSheet?.students.map(student => `
                            <tr>
                                <td>${student.name}</td>
                                <td>${student.agNumber}</td>
                                <td>${student.status || 'Not marked'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
        </html>
        `;
    };

    const handleDownloadClick = () => {
        if (!currentSheet?.students.length) {
            toast.error('No students to download');
            return;
        }

        const htmlContent = generateHTMLContent();
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Attendance_${date}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Attendance sheet downloaded successfully');
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-900">Attendance Sheet</h2>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        AG Number
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentSheet?.students.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.agNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div className="flex space-x-4">
                                                {['Present', 'Absent', 'Leave'].map((status) => (
                                                    <label key={status} className="inline-flex items-center">
                                                        <input
                                                            type="radio"
                                                            className="form-radio h-4 w-4 text-indigo-600"
                                                            name={`status-${student.id}`}
                                                            value={status}
                                                            checked={student.status === status}
                                                            onChange={() => handleStatusChange(student.id, status)}
                                                        />
                                                        <span className="ml-2">{status}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-6 flex justify-between">
                        <Link
                            to="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                        >
                            Back to Home
                        </Link>
                        <button
                            onClick={handleDownloadClick}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                        >
                            Download HTML
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}