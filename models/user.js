export class User {
  constructor(user = {}) {
    this.name = user.name
    this.email = user.email
    this.uid = user.uid || ''
  }
}