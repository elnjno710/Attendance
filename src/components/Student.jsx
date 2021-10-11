import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Student({ studentList, attendanceDate }) {
  return (
    <>
      <br />
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Time</th>
          <th>Tokens are penalized</th>
          <th>Note</th>
        </tr>
        {studentList.map((student, i) =>
        student.attendanceDate == attendanceDate ?
        <tr>
          <td>{i + 1}</td>
          <td><strong>{student.sender}</strong></td>
          <td>{student.attendanceTime}</td>
          <td>{student.token}</td>
          <td>{student.note}</td>
        </tr> : <tr></tr>
      )}
      </table>
      
    </>
  );
}

Student.propTypes = {
  student: PropTypes.array
};
