import 'regenerator-runtime/runtime';
import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import Big from 'big.js';
import Form from './components/Form';
import SignIn from './components/SignIn';
import Student from './components/Student';
import moment from 'moment';
import { format } from 'react-string-format';

const SUGGESTED_DONATION = '0';
const BOATLOAD_OF_GAS = Big(3).times(10 ** 13).toFixed();

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [student, setStudent] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [status, setStatus] = useState(0);
  const [isSend, setSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const dateNow = new Date();
  const expireFromTime = new Date(moment(dateNow).format('yyyy/MM/DD 12:00'));
  const expireToTime = new Date(moment(dateNow).format('yyyy/MM/DD 14:00'));
  const attendanceDate = moment(dateNow).format('yyyyMMDD')
  const feeLate = 0.0001;
  let token = '0';

  useEffect(() => {
    checkStudent();
  }, []);

  async function checkStudent(){
    const timeNow = new Date().getUTCHours();
    const toTimeExpire = expireToTime.getUTCHours();
    if(timeNow >= toTimeExpire)
    {
      setSend(true);
      setStatus(1);
    }

    var lsStudent = await contract.getAttendance();
    setStudentList(lsStudent);
    for(var i = 0; i < lsStudent.length; i++)
    {
      var student = lsStudent[i];
      if(student.attendanceDate == attendanceDate && student.sender.indexOf(currentUser.accountId) > -1)
      {
        setSend(true);
        setStatus(2);
      }
    }
  }

  const onSubmit = async (e) => {
    let question = "Do you want to attendance?";
    let note = '';
    const dateNow2 = new Date();
    const timeNow = dateNow2.getUTCHours();
    const fromTimeExpire = expireFromTime.getUTCHours();
    const toTimeExpire = expireToTime.getUTCHours();
    if(fromTimeExpire <= timeNow  && timeNow <= toTimeExpire)
    {
      const timeLate = Math.floor((Math.abs(dateNow2-expireFromTime))/(1000*60));
      question = format('You are {0} minutes late, do you want to attendance?', timeLate);
      note = format('{0} is {1} minutes late', currentUser.accountId, timeLate);
      token = (feeLate * timeLate).toString();
    }

    if(window.confirm(question))
    {
      e.preventDefault();
  
      const { fieldset } = e.target.elements;
      setLoading(true);
  
      fieldset.disabled = true;
  
      try {
        const dateNow2 = new Date();
        await contract.setAttendance(
          { attendanceDate: moment(dateNow2).format('yyyyMMDD'), attendanceTime: moment(dateNow2).format('H:mm'), sender: currentUser.accountId, token: token, note: note },
          BOATLOAD_OF_GAS,
          Big(parseFloat(token) || '0').times(10 ** 24).toFixed()
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
        window.alert("Successfully registered!!!")
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
            expireTime={moment(expireFromTime).format('H:mm A') + ' - ' + moment(expireToTime).format('H:mm A')} 
            status={status}
            isSend={isSend} 
            loading={loading} />
        : <SignIn/>
      }
      { !!currentUser && !!studentList.length && <Student studentList={studentList} attendanceDate={attendanceDate}/> }
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
