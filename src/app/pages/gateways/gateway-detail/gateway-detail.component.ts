import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { HttpParams } from "@angular/common/http";
import { NgxSpinnerService } from 'ngx-spinner';
import { RequesterService } from '../../../shared/service/requester.service';
import { NotificationService } from '../../../shared/service/notification.service';
import * as AWSIoTData from "aws-iot-device-sdk";
import * as AWS from 'aws-sdk';
import { AuthService } from '../../../../app/shared/service/auth.service';
import { Auth, Amplify, PubSub } from 'aws-amplify';
import { AWSIoTProvider } from '@aws-amplify/pubsub';

import { PubsubService } from '../../../shared/service/pubsub.service';

@Component({
  selector: 'app-gateway-detail',
  templateUrl: './gateway-detail.component.html',
  styleUrls: ['./gateway-detail.component.css']
})
export class GatewayDetailComponent implements OnInit {
  radiobtn: any;
  gatewayid: string;
  private subscription: any;
  isOnline: boolean = false;
  public columnMode: typeof ColumnMode = ColumnMode;
  sensorDataTable: any;
  devicecmdResponse: string = "";

  constructor(
    private route: ActivatedRoute,
    private requesterService: RequesterService,
    private notificationService: NotificationService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private pubsubService: PubsubService
  ) { 
    
  }

  deviceInformationForm: any;
  LANConfigurationForm: any;
  WIFIConfigurationForm: any;
  CELLULARConfigurationForm: any;
  cloudConfigurationForm: any;
  firmwareConfigurationForm: any;
  sensorConfigurationForm: any;
  gatewayDetails: any;

  ngOnInit() {
    this.spinner.show();
    this.subscription = this.route.params.subscribe(params => {
      this.gatewayid = params['id'];
    });
    this.getGatewayDetails();
    this.prepareForm();
    this.connecttoMQTT();
    //this.subscribeMQTT();
  }

  subscribeMQTT() {
    this.pubsubService.subscribetoMQTT();
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
    
    Amplify.addPluggable(new AWSIoTProvider({
      aws_pubsub_region: 'us-east-1',
      aws_pubsub_endpoint: 'wss://a229t6it5tss-ats.iot.us-east-1.amazonaws.com/mqtt',
    }));

    PubSub.subscribe('device/+/data').subscribe({
      next: data => { 
        console.log('Message received', data);
        this.devicecmdResponse = data.value.message;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  getGatewayDetails() {
    let sensorDataTableRows: any = [];
    let params = new HttpParams();
    params = params.append('email', this.getUserDetails());
    params = params.append('gatewayID', this.gatewayid);

    this.subscription = this.requesterService.getRequestParams("/gateway/details",params).subscribe(
      (gatewayDetails) => {
        this.gatewayDetails = gatewayDetails[0].gatewayDetails;
        this.setConnectionStatus(this.gatewayDetails.aws_connection_status);
        this.fillFormData(this.gatewayDetails);
        
        gatewayDetails[1].sensorList.forEach((sensor: any) => {
          sensorDataTableRows.push({
            'sensorid' : sensor.id,
          });
        });
        this.setSensorDataTable(sensorDataTableRows);
      },
      (error) => {
        console.log(error);
        this.notificationService.error(error.error.message);
      }
    );
  }

  setSensorDataTable(data: any) {
    this.sensorDataTable = data;
    this.spinner.hide();
  }

  setConnectionStatus(connectionStatus: string) {
    if(connectionStatus === "connected") {
      this.isOnline = true;
    } else {
      this.isOnline = false;
    }
  }

  prepareForm() {
    this.deviceInformationForm = new FormGroup({
      status: new FormControl({value: '', disabled: true}, [Validators.required]),
      interfaceUsed: new FormControl({value: '', disabled: true}, [Validators.required]),
      eth_Port_1: new FormControl({value: '', disabled: true}, [Validators.required]),
      eth_Port_2: new FormControl({value: '', disabled: true}, [Validators.required]),
      WLAN_Port_1: new FormControl({value: '', disabled: true}, [Validators.required]),
      MAC_eth_Port_1: new FormControl({value: '', disabled: true}, [Validators.required]),
      MAC_eth_Port_2: new FormControl({value: '', disabled: true}, [Validators.required]),
      MAC_WLAN_1: new FormControl({value: '', disabled: true}, [Validators.required]),
      IP_add_eth_Port_2: new FormControl({value: '', disabled: true}, [Validators.required]),
      gatewayName: new FormControl({value: '', disabled: true}, [Validators.required]),
      IPAddressMode: new FormControl({value: '', disabled: true}, [Validators.required]),
      DNS_Primary: new FormControl({value: '', disabled: true}, [Validators.required]),
      DNS_Secondary: new FormControl({value: '', disabled: true}, [Validators.required]),
      endpoint: new FormControl({value: '', disabled: true}, [Validators.required]),
      SSH_State: new FormControl({value: '', disabled: true}, [Validators.required]),
      firmwareVersion: new FormControl({value: '', disabled: true}, [Validators.required])
    }); 
  
    this.LANConfigurationForm = new FormGroup({
      ipaddressmode: new FormControl('0'),
      IPAddress: new FormControl('', [Validators.required]),
      subnetMask: new FormControl('', [Validators.required]),
      gateway: new FormControl('', [Validators.required]),
      dnsprimary: new FormControl('', [Validators.required]),
      dnssecondary: new FormControl('', [Validators.required])
    });

    this.WIFIConfigurationForm = new FormGroup({
      ipaddressmode: new FormControl('0'),
      IPAddress: new FormControl('', [Validators.required]),
      subnetMask: new FormControl('', [Validators.required]),
      gateway: new FormControl('', [Validators.required]),
      dnsprimary: new FormControl('', [Validators.required]),
      dnssecondary: new FormControl('', [Validators.required]),
      ssid: new FormControl('', [Validators.required]),
      securityType: new FormControl('1', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.CELLULARConfigurationForm = new FormGroup({
      APN: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });

    this.cloudConfigurationForm = new FormGroup({
      endpoint: new FormControl('', [Validators.required]),
      mqttport: new FormControl('', [Validators.required]),
      publishTopic: new FormControl('', [Validators.required]),
      subscribeTopic: new FormControl('', [Validators.required])
    });

    this.firmwareConfigurationForm = new FormGroup({
      firmwareFileInput: new FormControl('', [Validators.required])
    });

    this.sensorConfigurationForm = new FormGroup({
      sensorInput: new FormControl('1', [Validators.required]),
      sensorFileInput: new FormControl('', [Validators.required])
    });
  }

  fillFormData(formData: any) {
    this.deviceInformationForm.patchValue({
      status: formData.aws_connection_status,
      interfaceUsed: formData.interface_used === "eth0" ? "LAN" : formData.interface_used === "wlan0" ? "WIFI" : formData.interface_used,
      MAC_eth_Port_1: formData.network.eth0.mac,
      MAC_eth_Port_2: formData.network.eth1.mac,
      MAC_WLAN_1: formData.network.wlan0.mac,
      IP_add_eth_Port_2: formData.network.eth1.ip,
      gatewayName: formData.gateway_name,
      DNS_Primary: formData.network.dnspri,
      DNS_Secondary: formData.network.dnssec,
      endpoint: formData.cloud.endpoint,
      SSH_State: formData.ssh_state,
      firmwareVersion: formData.firmware_version
    });

    this.LANConfigurationForm.patchValue({
      dnsprimary: formData.network.dnspri,
      dnssecondary: formData.network.dnssec
    });

    this.WIFIConfigurationForm.patchValue({
      dnsprimary: formData.network.dnspri,
      dnssecondary: formData.network.dnssec,
      ssid: formData.network.wlan0.ssid,
      password: formData.network.wlan0.ssid_pwd
    });

    this.cloudConfigurationForm.patchValue({
      endpoint: formData.cloud.endpoint,
      mqttport: formData.cloud.mqttport,
      publishTopic: formData.cloud.data.publish_topic,
      subscribeTopic: formData.cloud.data.subscribe_topic
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onLANConfigFormSubmit(form: NgForm) {
    console.log(form);
    const formValues = form.value;
    let updateFormBody: any;
    if(formValues.ipaddressmode === "0") {
      // Update dhcp mode of eth0
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "ETH0DHCP",
        "eth0": {
          "ip_mode": "dhcp"
        }
      };
    }
    else if(formValues.ipaddressmode === "1") {
      // Update static mode of eth0
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "ETH0STATIC",
        "eth0": {
          "ip_mode": "static",
          "ip": formValues.IPAddress,
          "netmask": formValues.subnetMask,
          "gateway": formValues.gateway
        }
      };
    }

    this.publishtoMQTT(updateFormBody);
  }

  onCloudConfigFormSubmit(form: NgForm) {
    // CONFIRM - data or configuration
    const formValues = form.value;
    let updateFormBody: any;
    if(formValues.publishTopic === "pub_tt_message" && formValues.publishTopic === "sub_tt_message") {
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "CLOUDDATA",
        "endpoint": formValues.endpoint,
        "mqttport": formValues.mqttport,
        "configuration": {
          "publish_topic": formValues.publishTopic,
          "subscribe_topic": formValues.subscribeTopic
        }
      };
    } else {
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "CLOUDCONFIGURATION",
        "endpoint": formValues.endpoint,
        "mqttport": formValues.mqttport,
        "configuration": {
          "publish_topic": formValues.publishTopic,
          "subscribe_topic": formValues.subscribeTopic
        }
      };
    }

    this.publishtoMQTT(updateFormBody);
  }

  onWIFIConfigFormSubmit(form: NgForm) {
    const formValues = form.value;
    let updateFormBody: any;
    
    if(formValues.ssid && formValues.password) {
      // Update ssid and password of wlan0
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "WLAN0CONNECT",
        "wlan0": {
            "ssid": formValues.ssid,
            "ssid_pwd": formValues.password
        }
      }
    } else if(formValues.ipaddressmode === "0") {
      // Update dhcp mode of wlan0
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "WLAN0DHCP",
        "wlan0": {
          "ip_mode": "dhcp"
        }
      }
    } else if(formValues.ipaddressmode === "1") {
      // Update static mode of wlan0
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "WLAN0STATIC",
        "wlan0": {
          "ip_mode": "static",
          "ip": formValues.IPAddress,
          "netmask": formValues.subnetMask,
          "gateway": formValues.gateway
        }
      }
    }

    this.publishtoMQTT(updateFormBody);
  }

  onCELLULARConfigFormSubmit(form: NgForm) {

  }

  onfirmwareConfigFormSubmit(form: NgForm) {

  }

  onsensorConfigFormSubmit(form: NgForm) {

  }

  onfactoryResetFormSubmit() {
    
  }

  ongetDeviceConfig() {
    let deviceConfigJSON = {
      "clientId": this.gatewayid,
      "command": "INFO"
    }

    let IOTParams = {
      topic: "config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.publishtoMQTT(IOTParams);
  }

  publishtoMQTT(requestBody: any) {
    this.requesterService.addRequest("/iotdevice", JSON.stringify(requestBody)).subscribe(
      response => {
        console.log(response);
      },
      error => {
        console.log(error);
      }
    );
  }
}
