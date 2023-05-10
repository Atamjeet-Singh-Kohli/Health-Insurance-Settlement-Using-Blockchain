import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Bill, BillStatus } from 'src/types/bill.type';
import { User } from 'src/types/user.type';
import { BillService } from '../services/bill.service';
import { PatientService } from '../services/patient.service';
@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.sass']
})
export class BillComponent implements OnInit {
  @ViewChild('addBill') ab!: ElementRef;
  @ViewChild('closeModal') cm!: ElementRef;
  @ViewChild('uploadModal') um!: ElementRef

  Bills: Bill[] = [];
  Patient: User = {
    pID: '',
    fName: '',
    lName: '',
    city: '',
    state: '',
    phone: null,
    email: '',
    dob: null,
    sex: null,
  };

  Users: any = [];
  bill: Bill = {
    amount: '',
    patient: 0,
    billID: '',
    date: null,
  };
  Status = BillStatus;

  selectedBill!: Bill
  selectedFiles: FileList | null = null

  prgShow: boolean = false
  prgMsg: string = 'Generating Bill...'
  prgSuccess: boolean = false
  prgWarning: boolean = false
  prgBtnText: string = 'DONE'

  constructor(private ps: PatientService, private bs: BillService) { }

  ngOnInit(): void {
    this.getAllBills();
    this.getUsers();
  }

  ngAfterViewInit(): void {
    this.ab.nativeElement.addEventListener('click', () => {
      this.generateRecieptNumber();
    });
  }

  getAllBills() {
    this.bs.getAllBills().subscribe((r:any) => {
      let _Bill: Bill[] = r.data;
      console.log(r.data)
      this.bs.getAllBillsFromBC().then((r: any) => {
        _Bill.forEach((b: Bill, i: number) => {
          if (b.id === parseInt(r[i]?.bID)) {
            _Bill[i].status = r[i].status;
            _Bill[i].amount = r[i].amount;
            _Bill[i].cID = r[i].cID
            _Bill[i].bID = r[i].id
            _Bill[i].patient = r[i].pID
          }
        });
        this.Bills = _Bill;
        console.log(this.Bills);
        
      });
    });
  }

  getUsers() {
    this.ps.getAllPateints().subscribe((data: any) => {
      console.log(data);
      this.Users = data.data

    });
  }

  generateRecieptNumber() {
    this.bs
      .generateReceiptNumber()
      .subscribe((r: any) => (this.bill.billID = r.data));
  }

  onGenerateBill() {
    this.cm.nativeElement.click();
    this.prgShow = true
    console.log(this.bill);
    this.bs.addBill(this.bill).then((r) => {
      this.prgSuccess = true
      this.prgMsg = "Bill Generated Successfully"
      this.getAllBills();
    }).catch((er: any) => {
      this.prgWarning = true
      this.prgMsg = "Bill Generation Failed.."
    });
  }

  onPatientSelected(ev: Event) {
    // console.log((ev?.target as HTMLInputElement).value);
    let id = (ev?.target as HTMLInputElement).value
    console.log(id);
    // this.bill.patient = parseInt(id)
    this.Users.find((u: any) => {
      if (u.id == parseInt(id)) {
        this.Patient = u;
        this.bill.patient = u;
        console.log(u);

      }
    });
  }

  onAmountChange(ev: Event) {
    let amount = (ev?.target as HTMLInputElement).value;
    this.bill.amount = parseFloat(amount) * 0.000008 + ' ETH';
  }

  onUploadDoc(b: Bill) {
    console.log(b);
    this.selectedBill = b
  }

  onFilesChange(ev: Event) {
    this.selectedFiles = (ev.target as HTMLInputElement).files
  }

  // uploadMR() {
  //   this.um.nativeElement.click()
  //   this.prgShow = true
  //   this.prgMsg = "Upload in Medical Records to IPFS..."
  //   this.bs.uploadMR(this.selectedBill, this.selectedFiles).then((r: any) => {
  //     this.prgSuccess = true
  //     this.prgMsg = "Medical Records uploaded to IPFS"
  //     this.getAllBills()
  //   }).catch((er: any) => {
  //     this.prgWarning = true
  //     this.prgMsg = "Medical Records Upload Failed"
  //   })
  // }

  onPrgBtnClick() {
    this.prgShow = false
    this.prgSuccess = false
    this.prgWarning = false
    this.prgMsg = "Loading...."
  }
}
