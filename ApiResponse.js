class ApiResponse {
    constructor(data) {
      this.data = data;
  
      if (this.data == null) {
        this.code = 500;
      } else {
        this.code = 200;
      }
}}
class Status {
    constructor(code, description, message, displayableMessage) {
      this.code = code;
      this.description = description;
      this.message = message;
      this.displayableMessage = displayableMessage;
    }
    // constructor(code, description) {
    //   this.code = code;
    //   this.description = description;
    // }
  }
  module.exports = ApiResponse;