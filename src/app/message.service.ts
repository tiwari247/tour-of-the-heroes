import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messages = [];
  constructor() { }

  addMessage(message:string){
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }


}
