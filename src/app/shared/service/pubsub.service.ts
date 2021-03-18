import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import * as AWS from 'aws-sdk';
import { Auth, Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PubsubService {
  
    constructor() { 
        this.connecttoMQTT();
    }

    async connecttoMQTT() {
        const credentials = await Auth.currentCredentials();
        const iot = new AWS.Iot({
            region: 'us-east-1',
            credentials: Auth.essentialCredentials(credentials)
        });
        const policyName = 'phx_myIoTPolicy';
        const target = credentials.identityId;
        const { policies } = await iot.listAttachedPolicies({ target }).promise();
        if (!policies.find(policy => policy.policyName === policyName)) {
            await iot.attachPolicy({ policyName, target }).promise();
        }
    }

    subscribetoMQTT() {
        Amplify.addPluggable(new AWSIoTProvider({
            aws_pubsub_region: 'us-east-1',
            aws_pubsub_endpoint: 'wss://a229t6it5tss-ats.iot.us-east-1.amazonaws.com/mqtt',
        }));

        PubSub.subscribe('device/+/data').subscribe(
            data => {
                console.log('Message received', data);
            },
            error => {
                console.log(error);
            }
        );

        // PubSub.subscribe('device/+/data').subscribe({
        //     next: data => { 
        //       console.log('Message received', data);
        //     },
        //     error: error => {
        //       console.log(error);
        //     }
        // });
    }

    private handleExternalRequestException(error: any) {
        return throwError(error);
    }
}
