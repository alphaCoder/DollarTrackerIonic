import { Injectable } from '@angular/core';
import {ApiUrl} from '../../shared/apiurl.service';
import {ApiService} from '../../shared/api/api.service';
import {Observable} from 'rxjs/Rx';
@Injectable()
export class FriendsService {
    constructor(public apiUrl:ApiUrl, public apiService:ApiService) { }
    getFriends(userId) {
        var url = this.apiUrl.friends + "/" + userId;
        return this.apiService.get(url);
    }
    getMyFriendInvitations() {
        return this.apiService.get(this.apiUrl.myFriendInvitations);
    }
    getNewConnections(){
        var url = this.apiUrl.newConnections +"/0/50";
        return this.apiService.get(url);
    }
    inviteFriend(userId) {
        var url = this.apiUrl.inviteFriend + "/" + userId;
        return this.apiService.post(url, null);
    }
    acceptFriendInvitation(userId) {
        var url = this.apiUrl.acceptFriendInvitation + "/" + userId;
        return this.apiService.post(url, null);
    }
    declineFriendInvitation(userId) {
        var url = this.apiUrl.declineFriendInvitation + "/" + userId;
        return this.apiService.post(url, null);
    }
}