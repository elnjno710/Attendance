import { context, u128, PersistentVector } from "near-sdk-as";

@nearBindgen
export class StudentList {
  premium: boolean;
  sender: string;
  constructor(public text: string) {
    this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
    this.sender = context.sender;
  }
}
/**
 * collections.vector is a persistent collection. Any changes to it will
 * be automatically saved in the storage.
 * The parameter to the constructor needs to be unique across a single contract.
 * It will be used as a prefix to all keys required to store data in the storage.
 */
export const studentList = new PersistentVector<StudentList>("m");

@nearBindgen
export class StudentModel {
  attendanceDate: Date;
  sender: string;
  token: f32;
  note: string;

    constructor(
        attendanceDate: Date,
        sender: string,
        token: f32,
        note: string,
    ) {
      attendanceDate = this.attendanceDate;
      sender = this.sender;
      token = this.token;
      note = this.note;
    }
}

@nearBindgen
export class StudentList2 {
  studentList: PersistentVector<StudentModel>

  constructor(
    studentList: PersistentVector<StudentModel>
  ) {
    studentList = this.studentList;
  }
}
export const studentList2 = new PersistentVector<StudentModel>("m");