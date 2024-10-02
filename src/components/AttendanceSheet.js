import React, { useState, useEffect } from 'react';

const AttendanceSheet = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    }
  }, []);

  useEffect(() => {
    if (students.length > 0) {
      localStorage.setItem('students', JSON.stringify(students));
    }
  }, [students]);

  const addNewStudent = () => {
    const newStudent = {
      id: students.length + 1,
      name: '',
      agNumber: '',
      status: 'Present'
    };
    setStudents([...students, newStudent]);
  };

  const handleInputChange = (id, field, value) => {
    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, [field]: value } : student
    );
    setStudents(updatedStudents);
  };

  return (
    <div className="background">
      <div className="content">
        <h1 className="heading">Attendance Result</h1>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>AG Number</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>
                  <input
                    className="input"
                    type="text"
                    value={student.name}
                    onChange={(e) => handleInputChange(student.id, 'name', e.target.value)}
                    placeholder="Enter name"
                  />
                </td>
                <td>
                  <input
                    className="input"
                    type="text"
                    value={student.agNumber}
                    onChange={(e) => handleInputChange(student.id, 'agNumber', e.target.value)}
                    placeholder="Enter AG number"
                  />
                </td>
                <td>
                  <select
                    className="dropdown"
                    value={student.status}
                    onChange={(e) => handleInputChange(student.id, 'status', e.target.value)}
                  >
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="button"
          onClick={addNewStudent}
        >
          New Student
        </button>
      </div>
    </div>
  );
};

export default AttendanceSheet;