import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {BillStatus} from 'src/types/bill.type';

import {Claim} from 'src/types/claim.type';
import {Insurance} from 'src/types/insurance.type';
import {AgentService} from '../services/agent.service';
import {User} from "../../types/user.type";

declare let bootstrap: any

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.sass'],
})
export class HomeComponent implements OnInit, AfterViewInit {
    @ViewChild('MRmodal') mm!: ElementRef
    @ViewChild('closeModal') cm!: ElementRef
    Claims!: Claim[];

    selectedClaim!: Claim
    selectedAgent!: Insurance;

    Status = BillStatus

    Agent: Insurance | null = null

    Files: string[] = [];
    IPFS = 'http://localhost:8080/ipfs/'

    prgShow: boolean = false
    prgMsg: string = 'Checking is Agency'
    prgSuccess: boolean = false
    prgWarning: boolean = false
    prgBtnText: string = 'DONE'

    PatientRecords: any = [];
    selectedBill: { claim: Claim, user: any } = {
        user: null,
        claim: {id: 0, bID: "", aID: '', amount: '', pID: '', status: ''}
    };
    billModal: any;
    PatientRecord: any;
    viewRecord: boolean = false;

    constructor(private as: AgentService) {
    }

    ngOnInit(): void {
        this.as.getCurrentAccount().then(a => {
            this.as.getAgency().subscribe((a: any) => {
                console.log(a)
                this.Agent = a.data[0]
                this.getClaims()
            })
        })
    }

    ngAfterViewInit(): void {
        this.billModal = new bootstrap.Modal('#billModal')
        this.mm.nativeElement.addEventListener('shown.bs.modal', () => {
            this.viewMedRecords()
        })
    }

    getClaims() {
        this.as.getClaims().then((r: any) => {
            this.Claims = r
        }).catch((er: any) => {
            console.log(er);
        })
    }

    viewMedRecords() {
        let c = this.selectedClaim
        console.log(c.id);
        this.as.getMedRecords(c).then((r: any) => {
            console.log(r);
            if (r != null) {
                this.PatientRecords = r["MedRecord"];
            } else {

            }
            this.Files = r.files
        }).catch((er: any) => {
            console.log(er);

        })
    }

    acceptInsurance() {
        this.cm.nativeElement.click()
        this.prgShow = true
        this.prgMsg = "Accepting Claim..."
        this.as.acceptClaim(this.selectedClaim).then((r: any) => {
            this.prgSuccess = true
            this.prgMsg = "Claim Accepted!"
            this.getClaims()
        }).catch((er: any) => {
            this.prgWarning = true
            this.prgMsg = "Failed...!"
        })

    }

    rejectInsurance() {
        this.cm.nativeElement.click()
        this.prgShow = true
        this.prgMsg = "Accepting Claim..."
        this.as.rejectClaim(this.selectedClaim).then((r: any) => {
            this.prgSuccess = true
            this.prgMsg = "Claim Rejected!"
            this.getClaims()
        }).catch((er: any) => {
            this.prgWarning = true
            this.prgMsg = "Failed...!"
        })
    }

    onPrgBtnClick() {
        this.prgShow = false
        this.prgWarning = false
        this.prgSuccess = false
    }

    payClaim(c: Claim) {
        this.prgShow = true
        this.prgMsg = "Paying The Claim"
        this.as.payClaim(c).then((r: any) => {
            this.prgSuccess = true
            this.prgMsg = "Claim Payed Successfully..."
            this.getClaims()
        }).catch((er: any) => {
            this.prgWarning = true
            this.prgMsg = "Payment Failed..."
        })
    }

    viewBill(c: Claim) {
        this.as.getUserDetails(c.pID).then((u: any) => {
            console.log(u.data)
            this.selectedBill.user = u.data[0]
            this.selectedBill.claim = c
            this.billModal.show()
        })


    }

    onViewRecord(rec: any) {
        this.PatientRecord = rec;
        console.log(this.PatientRecord.data);
        this.viewRecord = true;
    }

    onRecordClose() {
        this.PatientRecord = {};
        this.viewRecord = false;
    }
}


