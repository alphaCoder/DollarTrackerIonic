import { Injectable } from '@angular/core';
import {Observable, Subject, BehaviorSubject, Subscription} from 'rxjs/Rx';
import {UserService} from '../../user/user.service';
import {ApiService} from '../../shared/api/api.service';
import {ApiUrl} from '../../shared/apiurl.service';
import {NotificationLog} from './notifications.model';
@Injectable()
export class NotificationsService {
public isNewMessageAvailable:boolean = false;
public newMessagesCount = 0; 
public messages:Array<NotificationLog> = [];
private items:Array<NotificationLog> = [];
 constructor(private _apiUrl:ApiUrl, private _apiService:ApiService ) { }

  public readMessage(){
      //todo: apply pagination
      var url= this._apiUrl.getNotifications + "?page=0&size=10&read="+false;
      this._apiService
          .get(url)
          .subscribe(x=>{
              this.messages = x.data;
              this.items = x.data;
              this.isNewMessageAvailable = false;
              this.newMessagesCount = 0;
          })
  }
  public setMessageCount(count){
      this.newMessagesCount = count;
  }
   getItems(ev: any) {

        // set val to the value of the searchbar
        let val = ev.target.value;
        this.messages = this.items;
        
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
            this.messages = this.items.filter(x=> x.message.toLowerCase().includes(val.toLowerCase()));
        }
    }
}