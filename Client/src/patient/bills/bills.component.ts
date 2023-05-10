import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Bill, BillStatus } from 'src/types/bill.type';
import { Insurance } from 'src/types/insurance.type';
import { User } from 'src/types/user.type';
import { BillService } from '../services/bill.service';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.sass']
})
export class BillsComponent implements OnInit, AfterViewInit {

  @ViewChild('closeModal') cm!: ElementRef
  Bills: Bill[] = [];
  Agents: any
  User: User | null = null

  BillStatus = BillStatus

  selectedBill!: Bill;
  selectedAgent!: Insurance;

  prgShow: boolean = false
  prgMsg: string = 'Submiting Claim'
  prgSuccess: boolean = false
  prgWarning: boolean = false
  prgBtnText: string = 'DONE'
  constructor(private us: BillService) { }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.us.getConnectedAccount().then((a) => {
      this.getBills()
      this.us.getUser().subscribe((u: any) => {
        console.log(u);
        this.User = u.data
      })
    })
    this.getAgencies()
  }

  getAgencies() {
    this.us.getInsuranceAgencies().subscribe((a: any) => {
      console.log(a);
      
      this.Agents = a.data
    })
  }

  getBills() {
    this.us.getBills()
      .subscribe((b: any) => {
        this.Bills = b.data;
        console.log(this.Bills);

        this.us.getBillsFromBC().then((r: Bill[]) => {
          console.log(r);

          this.Bills.forEach((b: Bill, i: number) => {
            b.status = r[i].status
            b.amount = r[i].amount
            b.bID = r[i].id
          })
        })
      });
  }

  onClaimInsurance() {
    this.cm.nativeElement.click()
    this.prgShow = true
    this.prgMsg = "Submitting Claim..."
    console.log(this.selectedBill, this.selectedAgent);
    this.us.claimInsurance(this.selectedBill, this.selectedAgent).then(r => {
      this.getBills()
      this.prgSuccess = true
      this.prgMsg = "Claim Submitted. <br>Awaiting Hospital For Medical Records"
    }).catch(er => {
      this.prgWarning = true
      this.prgMsg = "Submiting Claim Failed!"
      console.log(er);
    })
  }

  onAgentSelected(ev: Event) {

    this.Agents.forEach((a: any) => {
      if (a.iName == (ev.target as HTMLInputElement).value) {
        this.selectedAgent = a
      }
    })
  }

  onPrgBtnClick() {
    this.prgShow = false
    this.prgSuccess = false
    this.prgWarning = false
    this.prgMsg = "Loading...."
  }

  payBill(c: Bill) {
    this.prgShow = true
    this.prgMsg = "Paying The Bill"
    this.us.payBill(c).then((r: any) => {
      this.prgSuccess = true
      this.prgMsg = "Bill Payed Successfully..."
      this.getBills()
    }).catch((er: any) => {
      this.prgWarning = true
      this.prgMsg = "Payment Failed..."
    })
  }

}
