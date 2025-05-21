import { Injectable } from '@angular/core';
import { Admin } from '../../interfaces/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private admins: Admin[] = [
    {username: "vigas", password: "1234"},
    {username: "admin", password: "0000"}
  ]
  constructor() { }
  isVerified(usr: Admin) {
    for (const admin of this.admins) {
      if (usr.username === admin.username) {
        if (usr.password === admin.password) {
          return true
        }
      }
    }
    return false
  }

  createAdmin() {
    return {
      username: "",
      password: ""
    }
  }
}

