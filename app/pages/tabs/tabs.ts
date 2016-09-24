import {Component} from '@angular/core';
import {HomePage} from '../home/home';
import {DashboardPage} from '../dashboard/dashboard';
import {ExpenseReportPage} from '../expenseReport/expenseReport';
import {SettingPage} from '../setting/setting';
import {NotificationsPage} from '../notifications/notifications'
import {FriendsPage} from '../friends/friends';
import { NavParams } from 'ionic-angular';
@Component({
  templateUrl: 'build/pages/tabs/tabs.html'
})
export class TabsPage {

  private tab1Root: any = DashboardPage;
  private tab2Root: any = ExpenseReportPage;
  private settingTab: any = SettingPage;
  private notificationsTab: any = NotificationsPage;
  private friendsTab: any = FriendsPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }
}
