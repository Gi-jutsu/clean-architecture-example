export class WrongPasswordError extends Error {
  /** (RFC9457) Members of a Problem Details Object */
  code: string;
  detail: string;
  status: number;
  title: string;
  timestamp: Date;
  pointer?: string;

  constructor() {
    super("The password you entered is incorrect. Please try again.");

    this.code = "wrong-password";
    this.detail = this.message;
    this.status = 401;
    this.title = "Unauthorized";
    this.timestamp = new Date();
    this.pointer = `/data/attributes/password`;
  }
}
