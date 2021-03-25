import * as AWS from 'aws-sdk';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Auth, Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';
import { Observable as zenObservable } from 'zen-observable-ts';
import { environment } from '../../../environments/environment';
import { RequesterService } from './requester.service';

@Injectable({
  providedIn: 'root'
})
export class PubsubService {
    private IOT_REGION: any = environment.cognito.region;
    private IOT_ENDPOINT: string = environment.iotEndpoint;
    private IOT_POLICY: string = environment.iotPolicy;

    constructor(
        private requesterService: RequesterService
    ) { 
        this.connecttoMQTT();
    }

    async connecttoMQTT() {
        const credentials = await Auth.currentCredentials();
        const iot = new AWS.Iot({
            region: this.IOT_REGION,
            credentials: Auth.essentialCredentials(credentials)
        });
        const policyName = this.IOT_POLICY;
        const target = credentials.identityId;
        const { policies } = await iot.listAttachedPolicies({ target }).promise();
        if (!policies.find(policy => policy.policyName === policyName)) {
            await iot.attachPolicy({ policyName, target }).promise();
        }
    }

    subscribetoMQTT(): zenObservable<any> {
        Amplify.addPluggable(new AWSIoTProvider({
            aws_pubsub_region: this.IOT_REGION,
            aws_pubsub_endpoint: this.IOT_ENDPOINT,
        }));

        return PubSub.subscribe('config_pub_tt_message').map(
            response => {
                return response;
            }
        );
    }

    publishtoMQTT(requestBody: any): Observable<any> {
        return this.requesterService.addRequest("/iotdevice", JSON.stringify(requestBody)).pipe(
            catchError((error) => {
                return this.handleExternalRequestException(error);
            })
        );
        // this.requesterService.addRequest("/iotdevice", JSON.stringify(requestBody)).subscribe(
        //     response => {
        //       console.log(response);
        //     },
        //     error => {
        //       console.log(error);
        //     }
        // );
    }

    private handleExternalRequestException(error: any) {
        return throwError(error);
    }
}
