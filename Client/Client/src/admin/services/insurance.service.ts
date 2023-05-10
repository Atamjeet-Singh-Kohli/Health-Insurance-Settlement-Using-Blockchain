import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/environments/environment';
import { BlockchainService } from 'src/services/blockchain.service';
import { Insurance } from 'src/types/insurance.type';


@Injectable({
  providedIn: 'root',
})
export class InsuranceService {
  _API = API + 'agency/';

  constructor(private http: HttpClient, private bs: BlockchainService) {
  }

  getAgencies(): Observable<any> {
    return this.http.get(this._API);
  }

  addAgency(data: Insurance): Promise<any> {

    return new Promise((resolve, reject) => {
      this.addAgencyToBC(data).then((r) => {
        if (r) {
          this.http
            .post(this._API, data)
            .subscribe((r) => {
              console.log(r);

              resolve(r);
            });
        }
      });
    });
  }

  addAgencyToBC(agent: Insurance): Promise<boolean> {
    // console.log(agent)
    const startTime = new Date().getTime();
    return new Promise((resolve, reject) => {
      this.bs.getContract().then((c) => {
        // console.log(c)
        this.bs.getCurrentAcount().then((a) => {
          // console.log(a)
          c.methods
            .addAgent(agent.aID)
            .send({ from: a })
            .on('confirmation', (c: any, r: any) => {
              // console.log(c, r)
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

  getCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(this._API + '/getCount')
  }
}
