/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { Context, logging, storage } from 'near-sdk-as'
import { studentList, StudentModel } from './model'

const STUDENT_LIMIT = 1000;

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */

export function setAttendance(attendanceDate: string, attendanceTime:  string, sender: string, token: string, note: string): void {
  let student = new StudentModel (
    attendanceDate,
    attendanceTime,
    token,
    note,
  )
  studentList.push(student);
}

export function getAttendance(): StudentModel[] | null {
  const numMessages = min(STUDENT_LIMIT, studentList.length);
  const startIndex = studentList.length - numMessages;
  const result = new Array<StudentModel>(numMessages);
  for(let i = 0; i < numMessages; i++) {
      result[i] = studentList[i + startIndex];
  }
  return result;
}