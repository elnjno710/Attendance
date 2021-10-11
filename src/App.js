import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Student from './components/Student';
import moment from 'moment';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [student, setStudent] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [status, setStatus] = useState(0);
  const [isSend, setSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const dateNow = new Date();
  const expireTime = new Date('January 1, 2000, 10:00');

  useEffect(() => {
    checkStudent();
  }, []);

  async function checkStudent(){
    alert(1)
    // var lsStudent = await contract.getAttendance2(moment(dateNow).format('yyyyMMDD'));
    var lsStudent = await contract.getAttendance2({date: moment(dateNow).format('yyyyMMDD')});
    alert(JSON.stringify(lsStudent))
    setStudentList(lsStudent);
    for(var i = 0; i < lsStudent.length; i++)
    {
      var student = lsStudent[i];
      if(student.sender.indexOf(currentUser.accountId) > -1)
      {
        setSend(true);
        setStatus(2);
      }
    }
    const timeNow = new Date().getUTCHours();
    const timeExpire = expireTime.getUTCHours();
    if(timeNow > timeExpire)
    {
      setSend(true);
      setStatus(1);
    }
  }

  const onSubmit = async (e) => {
    if(window.confirm('Do you want to attendance?'))
    {
      e.preventDefault();
  
      const { fieldset } = e.target.elements;
      setLoading(true);
  
      fieldset.disabled = true;
  
      const token = 0;
  
      try {
        const dateNow2 = new Date();
        await contract.setAttendance2(
          { date: moment(dateNow2).format('yyyyMMDD'), student: { attendanceDate: dateNow2, sender: currentUser.accountId, token: token, note: 'ok' } },
          BOATLOAD_OF_GAS,
          Big(token || '0').times(10 ** 24).toFixed()
        );
      } catch (e) {
        alert(
          'Something went wrong! ' +
          'Maybe you need to sign out and back in? ' +
          'Check your browser console for more info.'
        )
        throw e
      } finally {
        // re-enable the form, whether the call succeeded or failed
        checkStudent();
        setLoading(false);
        fieldset.disabled = false
      }
    }
  };

  const signIn = () => {
    wallet.requestSignIn(
      nearConfig.contractName,
      "Welcome to NEAR's class!"
    );
  };

  const signOut = () => {
    wallet.signOut();
    window.location.replace(window.location.origin + window.location.pathname);
  };

  return (
    <main>
      <header>
        { currentUser
          ? <button style={{float: 'right'}} onClick={signOut}>Log out</button>
          : <button style={{float: 'right'}} onClick={signIn}>Log in</button>
        }
        <h1>Welcome to NEAR's class!</h1>
        
      </header>
      { currentUser
        ? <Form onSubmit={onSubmit} currentUser={currentUser} 
            dateNow={moment(dateNow).format('dddd, MMMM DD, yyyy')} 
            expireTime={moment(expireTime).format('H:mm A')} 
            status={status}
            isSend={isSend} 
            loading={loading} />
        : <SignIn/>
      }
      { !!currentUser && !!studentList.length && <Student studentList={studentList}/> }
    </main>
  );
};

App.propTypes = {
  contract: PropTypes.shape({
    setAttendance: PropTypes.func.isRequired,
    getAttendance: PropTypes.func.isRequired
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }).isRequired
};

export default App;
