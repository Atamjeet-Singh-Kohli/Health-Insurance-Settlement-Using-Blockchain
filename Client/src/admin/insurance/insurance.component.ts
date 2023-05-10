import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Insurance } from 'src/types/insurance.type';
import { InsuranceService } from '../services/insurance.service';

@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.sass'],
})
export class InsuranceComponent implements OnInit {
  @ViewChild('closeModal') cm!: ElementRef;
  Insurance: Insurance = {
    aID: '0xD838a15b091Cb5A92f7cf33Ec295089A199B180F',
    iName: 'START HEALTH INSURANCE PVT LTD',
    phone: 7356634614,
    email: 'starthealth@gmail.com',
  };

  Agencies: Insurance[] = [];

  prgShow: boolean = false
  prgMsg: string = 'Adding Insurance Agency'
  prgSuccess: boolean = false
  prgWarning: boolean = false
  prgBtnText: string = 'DONE'

  constructor(private is: InsuranceService) { }

  ngOnInit(): void {
    this.getAgencies();
  }

  getAgencies() {
    this.is.getAgencies().subscribe((data) => {
      console.log(data);

      this.Agencies = data.data;
    });
  }

  onAddAgency() {
    this.cm.nativeElement.click();
    this.prgShow = true
    this.is.addAgency(this.Insurance).then((data: any) => {
      console.log(data);
      this.prgMsg = "Agency Added To Network"
      this.prgSuccess = true
      this.getAgencies()
    }).catch((er: any) => {
      this.prgWarning = true
      this.prgMsg = "Adding Agency Failed.."
    });
  }

  onPrgBtnClick() {
    this.prgShow = false
    this.prgSuccess = false
    this.prgWarning = false
    this.prgMsg = "Loading...."
  }
}
