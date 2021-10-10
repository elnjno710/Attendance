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

import { Context, logging } from 'near-sdk-as';
import { StudentList, studentList } from './model'

const STUDENT_LIMIT = 1000;

/**
 * Returns an array of last N messages.\
 * NOTE: This is a view method. Which means it should NOT modify the state.
 */
export function getAttendance(): StudentList[] {
  const numMessages = min(STUDENT_LIMIT, studentList.length);
  const startIndex = studentList.length - numMessages;
  const result = new Array<StudentList>(numMessages);
  for(let i = 0; i < numMessages; i++) {
    result[i] = studentList[i + startIndex];
  }
  return result;
}

export function setAttendance(text: string): void {
  // Creating a new message and populating fields with our data
  const message = new StudentList(text);
  // Adding the message to end of the the persistent collection
  studentList.push(message);
}
