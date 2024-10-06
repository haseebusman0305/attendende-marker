import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Trash2, Download, ChevronLeft, Calendar } from 'lucide-react';

export default function AttendancePage() {
    const [currentSheet, setCurrentSheet] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadStudents();
    },[] );

    const loadStudents = () => {
        try {
            const savedStudents = localStorage.getItem('students');
            const students = savedStudents
                ? JSON.parse(savedStudents)?.map(student => ({ ...student, status: '' }))
                : [];

            const newSheet = { id: Date.now(), date, students };
            setCurrentSheet(newSheet);
        } catch (error) {
            toast.error('Error loading students: ' + error.message);
        }
    };

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

    const deleteLatestStudent = () => {
        if (currentSheet && currentSheet.students.length > 0) {
            const updatedStudents = currentSheet.students.slice(0, -1);
            const updatedSheet = { ...currentSheet, students: updatedStudents };
            setCurrentSheet(updatedSheet);

            localStorage.setItem('students', JSON.stringify(updatedStudents));
            toast.success('Latest student entry deleted');
        } else {
            toast.error('No students to delete');
        }
    };

    const generateHTMLContent = () => {
        return (
            <div className="background">
                <div className="content">
                    <div className="p-8 w-full">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                            <h2 className="heading">Attendance Sheet</h2>
                            <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
                                <Calendar className="text-gray-400" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="input border-none"
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto bg-white rounded-lg shadow">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="text-left">Name</th>
                                        <th className="text-left">AG Number</th>
                                        <th className="text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentSheet?.students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition duration-150">
                                            <td className="text-sm font-medium text-gray-900">{student.name}</td>
                                            <td className="text-sm text-gray-500">{student.agNumber}</td>
                                            <td className="text-sm text-gray-500">
                                                <div className="flex flex-col sm:flex-row sm:space-x-4">
                                                    {['Present', 'Absent', 'Leave'].map((status) => (
                                                        <label key={status} className="inline-flex items-center mt-2 sm:mt-0">
                                                            <input
                                                                type="radio"
                                                                className="form-radio h-4 w-4 text-blue-600"
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
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                            <Link to="/" className="button w-full sm:w-auto flex items-center justify-center">
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to Home
                            </Link>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <button onClick={handleDownloadClick} className="button w-full sm:w-auto flex items-center justify-center">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download HTML
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
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
        <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Attendance Sheet</h2>
                        <div className="flex items-center space-x-2 bg-white rounded-lg shadow-md p-2">
                            <Calendar className="text-gray-400" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="border-none focus:ring-0 text-gray-700"
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
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
                <div className="flex flex-col sm:flex-row sm:space-x-20">
                    {['Present', 'Absent', 'Leave'].map((status) => (
                        <label key={status} className="inline-flex items-center mt-2 sm:mt-0">
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
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex justify-end w-full">
                    <Trash2
                        onClick={deleteLatestStudent}
                        className="h-6 w-6 text-gray-500 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                        disabled={!currentSheet || currentSheet.students.length === 0}
                    />
                </div>
            </td>
        </tr>
    ))}
</tbody>

                        </table>
                    </div>
                    <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        <Link
                            to="/"
                            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                            <button
                                onClick={handleDownloadClick}
                                className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
                            >
                                <Download className="mr-2 h-4 w-4" />
                                Download HTML
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}