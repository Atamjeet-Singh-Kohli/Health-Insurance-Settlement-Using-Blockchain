import { Component, OnInit } from '@angular/core';
import { BlockchainService } from 'src/services/blockchain.service';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: ['./dashboard-home.component.sass']
})
export class DashboardHomeComponent implements OnInit {

  Titles: any = ['Total Patients', 'Active Bills', 'Active Doctors', 'Active Insurance Agents']
  Images: any = ['user-injured', 'procedures', 'user-md', 'user-nurse']
  Count: any = [0, 0, 0, 0]
  Background: any = ['green', 'orange', 'blue', 'violet']

  accountBalance: any;

  docCount = 0
  patCount = 0

  constructor(private blockchainService: BlockchainService) { }

  ngOnInit(): void {
    this.accountBalance = this.blockchainService.getBalance()
    console.log(this.accountBalance);

    let getBalance = setInterval(() => {
      this.blockchainService.getBalance().then((r) => {
        this.accountBalance = r
        if (this.accountBalance != null) {
          this.accountBalance /= 1000000000000000000
          console.log("Balance", this.accountBalance);
          clearInterval(getBalance);
        }
      })

    }, 1000)

    this.blockchainService.getCount().then((data: any) => {
      this.Count[0] = data.patCount
      this.Count[1] = data.billCount
      this.Count[2] = data.docCount
      this.Count[3] = data.agentCount
    })
  }





}
