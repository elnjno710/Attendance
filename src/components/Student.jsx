import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

export default function Student({ studentList }) {
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
        <tr>
          <td>{i + 1}</td>
          <td><strong>{student.sender}</strong></td>
          <td>{moment(student.attendanceDate).format('H:mm A')}</td>
          <td>{student.token}</td>
          <td>{student.note}</td>
        </tr>
      )}
      </table>
      
    </>
  );
}

Student.propTypes = {
  student: PropTypes.array
};
