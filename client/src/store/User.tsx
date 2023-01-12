export class User {
  id: string
  password: string
  email: string
  name: string
  surname: string
  profile_pic_id: string
  phone: string
  bio: string
  hobbies: []
  accepted: []
  rejected: []
  matched: []
  communicationID: string

  constructor() {
    this.id = ''
    this.password = ''
    this.email = ''
    this.name = ''
    this.surname = ''
    this.profile_pic_id = ''
    this.phone = ''
    this.bio = ''
    this.hobbies = []
    this.accepted = []
    this.rejected = []
    this.matched = []
    this.communicationID = ''
  }
  
}
