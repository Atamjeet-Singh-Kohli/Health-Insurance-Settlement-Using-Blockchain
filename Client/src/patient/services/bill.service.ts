import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API} from 'src/environments/environment';
import {BlockchainService} from 'src/services/blockchain.service';
import {Bill} from 'src/types/bill.type';
import {Insurance} from 'src/types/insurance.type';
import {User} from 'src/types/user.type';
import Web3 from 'web3';

@Injectable({
    providedIn: 'root'
})
export class BillService {
    _BillAPI = API + 'bill/';
    _UserAPI = API + 'patient/'
    _AgencyAPI = API + 'agency/'
    userID: string | null = null;

    constructor(private bs: BlockchainService, private http: HttpClient) {
        this.getConnectedAccount()
    }

    getUser(): Observable<User> {
        return this.http.get<User>(this._UserAPI + this.userID + "/")
    }

    async getConnectedAccount() {
        await this.bs.getCurrentAcount().then(a => {
            this.userID = a
        })
    }

    getBills(): Observable<Bill[]> {
        return this.http.get<Bill[]>(this._BillAPI + 'getBillsByUser/' + this.userID);
    }

    getBillsFromBC(): Promise<Bill[]> {
        const startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.getBills(this.userID).call().then((r: Bill[]) => {

                    resolve(r)
                }).catch((err: any) => {
                    reject(err)
                })
            })
        })
    }

    getInsuranceAgencies(): Observable<Insurance[]> {
        return this.http.get<Insurance[]>(this._AgencyAPI)
    }

    claimInsurance(b: Bill, i: Insurance): Promise<boolean> {
        const startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.claimInsurance(
                    b.bID, this.userID, i.aID, b.amount, 'Claim Submitted \n Awaiting Agency Response'
                ).send({from: this.userID}).on('confirmation', (a: any, r: any) => {

                    resolve(true)
                }).on('error', (err: any) => {
                    reject(err)
                })
            })
        })
    }

    payBill(bill: any): Promise<any> {
        const startTime = new Date().getTime();
        let amount = parseFloat(bill.amount?.split('ETH')[0] + '')
        console.log(bill);

        let cID = bill.cID || 0
        let uID: any = this.userID
        console.log(cID, uID);

        return new Promise((resolve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.getAdmin().call().then((a: any) => {
                    this.bs.getWeb3Provider().then((web3: Web3) => {
                        web3.eth
                            .sendTransaction({
                                to: a,
                                from: uID,
                                value: web3.utils.toWei(amount + '', 'ether')
                            }).then((v: any) => {
                            console.log(v);
                            c.methods.sendPayment(cID, parseInt(bill.bID))
                                .send({from: this.userID})
                                .on('confirmation', (a: any, r: any) => {
                                    resolve(r)
                                }).on('error', (er: any) => {
                                reject(er)
                            })
                        })
                    })
                })
            })
        })
    }
}
