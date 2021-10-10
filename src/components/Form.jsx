import React from 'react';
import PropTypes from 'prop-types';

export default function Form({ onSubmit, currentUser, dateNow, expireTime, status, isSend, loading }) {
  return (
    <form onSubmit={onSubmit}>
      <fieldset id="fieldset">
        { currentUser
          ? <div>
              <label style={{color: 'gray', marginBottom: 0.5}}>Account: </label>
              <span>{currentUser.accountId}</span>
          </div>
          : null
        }
        <label style={{color: 'gray', marginBottom: 0.5}}>Today: </label>
        <span>{dateNow}</span>
        <br />
        <label style={{color: 'gray', marginBottom: 0.5}}>Expire time: </label>
        <span>{expireTime}</span>
        <br />
        <label style={{color: 'gray', marginBottom: 0.5}}>Status: </label>
        {status == 2
        ? <span style={{color: 'red'}}>Registered</span> 
        : (status == 1 ? <span style={{color: 'red'}}>Time up</span> : null) }

        <div style={{textAlign: 'right'}}>
          {!isSend ? 
            (loading ?
            <button type='button'>
              <i className="fa fa-refresh fa-spin"></i> Send
            </button>:
            <button style={{backgroundColor: '#23aaf2', color: 'white'}} type="submit">Send</button>)
             : null}
        </div>
      </fieldset>
    </form>
  );
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  })
};
