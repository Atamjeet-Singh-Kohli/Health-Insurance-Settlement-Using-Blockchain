import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/environments/environment';
import { BlockchainService } from 'src/services/blockchain.service';
import { IpfsService } from 'src/services/ipfs.service';

import { Bill } from 'src/types/bill.type';


@Injectable({
  providedIn: 'root',
})
export class BillService {
  _API = API + 'bill/';

  adminId: string = ''

  ipfs: any;

  constructor(private http: HttpClient, private bs: BlockchainService, _ipfs: IpfsService) {
    // this.getAllBillsFromBC();

    this.ipfs = _ipfs.getIPFS()

    bs.getCurrentAcount().then(a => {
      this.adminId = a
    })

  }

  generateReceiptNumber(): Observable<string> {
    return this.http.get<string>(API + 'generateInsID/');
  }

  getAllBills(): Observable<Bill[]> {
    return this.http.get<Bill[]>(this._API);
  }

  addBill(bill: Bill): Promise<any> {
    let amount = bill.amount;
    return new Promise((resolve, reject) => {
      console.log(bill);

      this.http.post(this._API, { patient: bill.patient.id, billID: bill.billID, date: bill.date }).subscribe((r: any) => {
        this.addBillToBC(r, bill.patient?.patID, amount)
          .then((r) => {
            if (r) {
              resolve(bill);
            }
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    });
  }

  addBillToBC(bill: any, patID: string, amount: string | undefined): Promise<boolean> {
    return new Promise((resolve, reject) => {
      console.log(bill);
      // const startTime = new Date().getTime();
      this.bs.getContract().then((c) => {
        this.bs.getCurrentAcount().then((a) => {
          c.methods
            .addBill(bill.data.id, patID, amount, 'Bill Generated')
            .send({ from: a })
            .on('confirmation', (c: any, r: any) => {
              console.log(r);
              resolve(true);
            })
            .on('error', (err: any) => {
              console.log(err);
              reject(false);
            });
        });
      });
    });
  }

  getAllBillsFromBC(): Promise<any> {
    // const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      this.bs.getContract().then((c) => {
        c.methods
          .getAllBills()
          .call()
          .then((r: any) => {
            console.log(r);
            resolve(r);
          })
          .catch((err: any) => {
            console.log(err);
            reject(err);
          });
      });
    });
  }

  // uploadMR(bill: Bill, files: any): Promise<boolean> {
  //   const startTime = new Date().getTime();
  //   return new Promise((resolve, reject) => {
  //     this.bs.getContract().then(c => {
  //       this.bs.getCurrentAcount().then(a => {
  //         this.addRecords(files).then((hash: any) => {
  //           console.log(bill.bID, bill.cID, bill.patient?.pID, hash);
  //           c.methods
  //             .addMedicalRecords(bill.bID, bill.cID, bill.patient?.pID, hash)
  //             .send({ from: a })
  //             .on('confirmation', (c: any, r: any) => {
  //               console.log(r);
  //               const gasUsed = r.gasUsed;
  //               const totalCost = (gasUsed * 20) / 1000000000 + " ETH";
  //               const endTime = new Date().getTime();
  //               let DATA: Result = {
  //                 fnName: "addMedicalRecords()",
  //                 timeTaken: (endTime - startTime) / 1000 + " s",
  //                 userID: this.adminId + " : (Admin)",
  //                 time: "" + startTime,
  //                 gasUsed: gasUsed,
  //                 totalCost: totalCost,
  //               };
  //               this.ra.addResult(DATA).subscribe(() => {
  //               });
  //               resolve(r)
  //             }).on('error', (er: any) => {
  //               console.log(er);
  //               reject(er)
  //             })
  //         })

  //       })

  //     })

  //   })
  // }

  // async addRecords(data: any) {
  //   let IPFS_HASHES = []
  //   for await (const r of this.ipfs.addAll(data)) {
  //     console.log(r);
  //     IPFS_HASHES.push(r.path)
  //   }

  //   return IPFS_HASHES

  // }
}
