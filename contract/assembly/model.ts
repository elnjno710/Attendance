import { context, u128, PersistentVector } from "near-sdk-as";

@nearBindgen
export class StudentModel {
  premium: boolean;
  sender: string;
  // attendanceDate: string;
  // attendanceTime: string;
  // token: string;
  // note: string;

    constructor(
      public attendanceDate: string,
      public attendanceTime: string,
      public token: string,
      public note: string,
    ) {
      this.premium = context.attachedDeposit >= u128.from('10000000000000000000000');
      this.sender = context.sender;
      // attendanceDate = this.attendanceDate;
      // attendanceTime = this.attendanceTime;
      // token = this.token;
      // note = this.note;
    }
}
export const studentList = new PersistentVector<StudentModel>("m");