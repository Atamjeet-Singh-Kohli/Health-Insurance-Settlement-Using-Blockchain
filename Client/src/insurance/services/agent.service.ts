import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {API} from 'src/environments/environment';
import {BlockchainService} from 'src/services/blockchain.service';
import {Claim} from 'src/types/claim.type';
import {Insurance} from 'src/types/insurance.type';
import Web3 from 'web3';
import {User} from "../../types/user.type";

@Injectable({
    providedIn: 'root'
})
export class AgentService {

    _AgentAPI = API + 'agency'
    _UserAPI = API + 'patient/'
    aID: string = '';

    constructor(private bs: BlockchainService, private http: HttpClient) {
    }

    checkIsAgent(): Promise<boolean> {
        return new Promise((reoslve, reject) => {
            this.bs.getContract().then(c => {
                this.bs.getCurrentAcount().then(a => {
                    c.methods.isAgent(a).call().then((r: any) => {
                        reoslve(r)
                    }).catch((er: any) => {
                        reject(er)
                    })
                })
            })
        })
    }

    getAgency(): Observable<Insurance> {
        return this.http.get<Insurance>(this._AgentAPI + '/' + this.aID)
    }

    getClaims(): Promise<any> {
        const startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.getAgentClaims(this.aID).call().then((cm: any) => {
                    console.log(cm);

                    resolve(cm)
                }).catch((er: any) => {
                    console.log(er);
                    reject(er)
                })
            })
        })
    }

    getCurrentAccount(): Promise<string> {
        return new Promise((resolve, reject) => {
            this.bs.getCurrentAcount().then((a: string) => {
                this.aID = a
                resolve(a)
            })
        })
    }

    getUserDetails(id: string): Promise<User> {
        return new Promise<User>((resolve, reject) => {
            this.http.get<User>(this._UserAPI + id + '/').subscribe((u: User) => {
                resolve(u)
            })
        })
    }

    getMedRecords(claim: any): Promise<any> {
        const startTime = new Date().getTime();
        return new Promise((resolve, reject) => {
            this.bs.getContract().then(c => {
                console.log(claim)
                c.methods.viewMedRec(claim.pID).call().then((result: any) => {
                    console.log(result);
                    if (result.length >= 1) {
                        this.http
                            .get("http://127.0.0.1:8080/ipfs/" + result)
                            .subscribe((data: any) => {
                                console.log(data);
                                resolve(data);
                            });
                    } else {
                        resolve(null)
                    }
                }).catch((er: any) => {
                    reject(er)
                })
            })
        })
    }

    acceptClaim(claim: Claim): Promise<any> {
        const startTime = new Date().getTime();
        return new Promise((reoslve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.acceptClaim(claim.id, claim.bID)
                    .send({from: this.aID})
                    .on('confirmation', (a: any, r: any) => {
                        reoslve(true)
                    }).on('error', (er: any) => {
                    reject(er)
                })
            })
        })
    }

    rejectClaim(claim: Claim): Promise<any> {
        const startTime = new Date().getTime();
        return new Promise((reoslve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.rejectClaim(claim.id, claim.bID)
                    .send({from: this.aID})
                    .on('confirmation', (a: any, r: any) => {
                        console.log(r);
                        reoslve(true)
                    }).on('error', (er: any) => {
                    reject(er)
                })
            })
        })
    }

    payClaim(claim: Claim): Promise<any> {
        const startTime = new Date().getTime();
        let amount: number = parseFloat(claim.amount.split('ETH')[0])
        return new Promise((resolve, reject) => {
            this.bs.getContract().then(c => {
                c.methods.getAdmin().call().then((a: any) => {
                    this.bs.getWeb3Provider().then((web3: Web3) => {
                        web3.eth
                            .sendTransaction({to: a, from: this.aID, value: web3.utils.toWei(amount + '', 'ether')})
                            .then((v: any) => {
                                console.log(v);
                                c.methods.sendPayment(claim.id, claim.bID)
                                    .send({from: this.aID})
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
