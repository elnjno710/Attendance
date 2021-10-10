import React from 'react';
import PropTypes from 'prop-types';

export default function Student({ student }) {
  return (
    <>
      <br />
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Time</th>
          <th>Tokens are penalized</th>
        </tr>
        {student.map((message, i) =>
        <tr>
          <td>{i + 1}</td>
          <td><strong>{message.sender}</strong></td>
          <td>{message.text}</td>
          <td></td>
        </tr>
      )}
      </table>
      
    </>
  );
}

Student.propTypes = {
  student: PropTypes.array
};
