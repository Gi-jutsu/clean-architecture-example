export class WrongPasswordError extends Error {
  status: number;
  code: string;
  title: string;
  detail: string;
  timestamp: Date;

  constructor() {
    super("The password provided is incorrect.");
    this.status = 401;
    this.code = "wrong-password";
    this.title = "Unauthorized";
    this.detail = "The password you entered is incorrect. Please try again.";
    this.timestamp = new Date();
  }
}
