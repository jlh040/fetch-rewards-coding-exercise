class ExpressError extends Error {
  constructor(message, status) {
    super();
    this.messsage = message;
    this.status = status;
    console.error(this.stack);
  }
}

module.exports = ExpressError;