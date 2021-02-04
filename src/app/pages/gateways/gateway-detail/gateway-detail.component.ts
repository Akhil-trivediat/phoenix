import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { RequesterService } from '../../../shared/service/requester.service';

@Component({
  selector: 'app-gateway-detail',
  templateUrl: './gateway-detail.component.html',
  styleUrls: ['./gateway-detail.component.css']
})
export class GatewayDetailComponent implements OnInit {
  radiobtn: any;
  gatewayid: number;
  private subscription: any;

  constructor(
    private route: ActivatedRoute,
    private requesterService: RequesterService
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
    this.subscription = this.route.params.subscribe(params => {
      this.gatewayid = +params['id'];
    });

    this.subscription = this.requesterService.getRequest("/account/user/gateway/details").subscribe(
      (gatewayDetails) => {
        this.gatewayDetails = gatewayDetails;
        this.fillFormData(gatewayDetails);
      },
      (error) => {
        console.log(error);
      }
    );

    this.prepareForm();
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
      if(this.gatewayDetails.interface_used === "eth0") {
        updateFormBody = {
          "clientId": this.gatewayDetails.clientId,
          "command": "ETH0DHCP",
          "eth0": {
            "ip_mode": "dhcp"
          }
        };
      } else if(this.gatewayDetails.interface_used === "wlan0") {
        updateFormBody = {
          "clientId": this.gatewayDetails.clientId,
          "command": "WLAN0DHCP",
          "wlan0": {
            "ip_mode": "dhcp"
          }
        };
      }
    } else {
      if(this.gatewayDetails.interface_used === "eth0") {
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
      } else if(this.gatewayDetails.interface_used === "wlan0") {
        updateFormBody = {
          "clientId": this.gatewayDetails.clientId,
          "command": "WLAN0STATIC",
          "wlan0": {
            "ip_mode": "static",
            "ip": formValues.IPAddress,
            "netmask": formValues.subnetMask,
            "gateway": formValues.gateway
          }
        };
      }
    }
  }

  onCloudConfigFormSubmit(form: NgForm) {

  }

  onWIFIConfigFormSubmit(form: NgForm) {

  }

  onCELLULARConfigFormSubmit(form: NgForm) {

  }

  onfirmwareConfigFormSubmit(form: NgForm) {

  }

  onsensorConfigFormSubmit(form: NgForm) {

  }

}
