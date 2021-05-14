import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import { ColumnMode } from "@swimlane/ngx-datatable";
import { NgxSpinnerService } from 'ngx-spinner';
import { RequesterService } from '../../../shared/service/requester.service';
import { NotificationService } from '../../../shared/service/notification.service';
import { PubsubService } from '../../../shared/service/pubsub.service';
import { HttpParams } from '@angular/common/http';
import { TreeviewItem, TreeviewConfig } from 'ngx-treeview';

@Component({
  selector: 'app-gateway-detail',
  templateUrl: './gateway-detail.component.html',
  styleUrls: ['./gateway-detail.component.css']
})
export class GatewayDetailComponent implements OnInit {
  radiobtn: any;
  gatewayid: string;
  selectedCommand: any = null;
  private subscription: any;
  isOnline: boolean = false;
  sensorDataTable: any;
  //devicecmdResponse: string = null;
  deviceInformationForm: any;
  LANConfigurationForm: any;
  WIFIConfigurationForm: any;
  CELLULARConfigurationForm: any;
  cloudConfigurationForm: any;
  firmwareConfigurationForm: any;
  sensorConfigurationForm: any;
  gatewayDetails: any;
  mqttcommand: string = "";
  ddCmdList: Array<Object> = this.getCommandsList();
  public columnMode: typeof ColumnMode = ColumnMode;

  jsonArray = { "firmware_version": "1.0.0", "network": { "eth0": { "ip_mode": "dhcp", "mac": "0001c02a195c", "ip": "192.168.1.36", "netmask": "255.255.255.0", "gateway": "null" }, "eth1": { "ip_mode": "static", "ip": "169.254.0.10", "netmask": "255.255.255.0", "gateway": null, "mac": "0001c02b9009" }, "wlan0": { "ip_mode": "dhcp", "ssid": "emerson test", "ssid_pwd": "1265e93cc45ee8ba7c04921f47ee4c5fbac0eee0b4cce47567d92da17b27f1b1", "mac": "ac1203a0d999", "ip": "null", "netmask": "null", "gateway": "null" }, "dnspri": "8.8.8.8", "dnssec": "8.8.4.4" }, "cloud": { "data": { "publish_topic": "topic/bufferd/data", "subscribe_topic": "sub_tt_message" }, "configuration": { "publish_topic": "config_pub_tt_message", "subscribe_topic": "config_sub_tt_message" }, "endpoint": "a229t6it5tss-ats.iot.us-east-1.amazonaws.com", "mqttport": "8883" }, "gateway_name": "m500-195c", "clientId": "m500{0001c02a195c}", "ssh_state": "on", "transmitterids": [ 35154096, 24091097, 34100113, 30221140, 209170063, 209003025, 33243002, 201070226, 34092214, 23067245, 30079120, 209239176, 31069062, 34069207, 26060198035154096, 24091097, 34100113, 30221140, 209170063, 209003025, 33243002, 201070226, 34092214, 23067245, 30079120, 209239176, 31069062, 34069207, 26060198 ], "aws_connection_status": "Connected", "interface_used": "eth0" };
  
  devicecmdResponse: any = [];

  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private pubsubService: PubsubService,
    private requesterService: RequesterService,
    private notificationService: NotificationService
  ) { 
    this.subscribetoMQTT();
  }

  ngOnInit() {
    this.spinner.show();
    this.subscription = this.route.params.subscribe(params => {
      this.gatewayid = params['id'];
    });
    this.getGatewayDetails();
    this.prepareForm();
    this.getSensorStatus();
    //this.formatJSONtoFlatList(this.jsonArray);
  }

  formatJSONtoFlatList(jsonArray) {
    for ( var key in jsonArray ) {
      var item = jsonArray[key]; 
      if ( typeof item === "object" ){
        this.devicecmdResponse.push(key + " : ");
        this.formatJSONtoFlatList(item); 
      }
      else{
        this.devicecmdResponse.push(key + " : " + item);
      }
    }
  }

  getCommandsList() {
    let ddCmdList = [
      {
        id: "CMD_INFO"
      },
      {
        id: "ADDTRANSMITTER"
      },
      {
        id: "ETH0STATIC"
      },
      {
        id: "ETH0DHCP"
      },
      {
        id: "WLAN0STATIC"
      },
      {
        id: "WLAN0DHCP"
      },
      {
        id: "WLAN0CONNECT"
      },
      {
        id: "AUTOSSHON"
      },
      {
        id: "AUTOSSHOFF"
      },
      {
        id: "REBOOT"
      },
      {
        id: "CLOUDDATA"
      },
      {
        id: "CLOUDCONFIGURATION"
      },
      {
        id: "SETDNS"
      }
    ];
    return ddCmdList;
  }

  getUserDetails() {
    return localStorage.getItem('USER_NAME');
  }

  subscribetoMQTT() {
    this.pubsubService.subscribetoMQTT().subscribe(
      data => {
        console.log(data);
        this.storeMQTTresponse(data.value);
      },
      error => {
        console.log(error);
      }
    );
  }

  getGatewayDetails() {
    this.getDeviceData();
    this.getSensorList();
  }

  getDeviceData() {
    this.mqttcommand = "CMD_INFO";
    let deviceConfigJSON = {
      "clientId": this.gatewayid,
      "command": "CMD_INFO"
    }

    let IOTParams = {
      topic: this.gatewayid + "/config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSensorList() {
    // take the list from sub topic
    let sensorDataTableRows: any = [];
    let params = new HttpParams();
    params = params.append('email', this.getUserDetails());
    params = params.append('gatewayID', this.gatewayid);

    this.subscription = this.requesterService.getRequestParams("/sensor",params).subscribe(
      (sensors) => {
        sensors.forEach((sensor: any) => {
          sensorDataTableRows.push({
            'sensorid' : sensor.id,
            'status': sensor.status
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

  storeMQTTresponse(response: any) {
    let mqttcommand: string = this.mqttcommand;
    switch(mqttcommand) {
      case "CMD_INFO":
        this.displayGatewayDetails(response);
        break;
      case "CMD_INFO_BTN":
        this.devicecmdResponse = response;
        break;
      case "ETH0STATIC":
        console.log(response);
        this.displayNotificationStrip(response);
        break;
      case "ETH0DHCP":
        console.log(response);
        break;
      case "WLAN0STATIC":
        console.log(response);
        break;
      case "WLAN0DHCP":
        console.log(response);
        break;
      case "WLAN0CONNECT":
        console.log(response);
        break;
      case "AUTOSSHON":
        console.log(response);
        break;
      case "AUTOSSHOFF":
        console.log(response);
        break;
      case "REBOOT":
        console.log(response);
        break;
      case "CLOUDDATA":
        console.log(response);
        break;
      case "CLOUDCONFIGURATION":
        console.log(response);
        break;
      case "SETDNS":
        console.log(response);
        break;
      case "ADDTRANSMITTER":
        console.log(response);
        break;
    }
  }

  displayGatewayDetails(gatewayDetailsObject: any) {
    if(gatewayDetailsObject.clientId === this.gatewayid) {
      this.setConnectionStatus(gatewayDetailsObject.aws_connection_status);
      this.fillFormData(gatewayDetailsObject);
    }
  }

  displayNotificationStrip(message: string) {
    if("Success") {
      this.notificationService.success(message);
    } else {
      this.notificationService.error(message);
    }
  }

  setSensorDataTable(data: any) {
    this.sensorDataTable = data;
    this.spinner.hide();
  }

  getSensorStatus() {
    // http call to datamessage table to get the last communicated date for sensor.
    // async / await call
    // return status
    // this.requesterService.getSensorDetailsbyIDforGraph('/graphdata',{ID: '034100113'}).subscribe(
    //   response => {
    //     //console.log(response);
    //     // sensor status -> true
    //   },
    //   error => {
    //     console.log(error);
    //   }
    // );
  }

  setConnectionStatus(connectionStatus: string) {
    if(connectionStatus.toLocaleLowerCase() === "connected") {
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
      this.mqttcommand = "ETH0DHCP";
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
      this.mqttcommand = "ETH0STATIC";
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

    this.pubsubService.publishtoMQTT(updateFormBody).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCloudConfigFormSubmit(form: NgForm) {
    // CONFIRM - data or configuration
    const formValues = form.value;
    let updateFormBody: any;
    if(formValues.publishTopic === "pub_tt_message" && formValues.publishTopic === "sub_tt_message") {
      this.mqttcommand = "CLOUDDATA";
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
      this.mqttcommand = "CLOUDCONFIGURATION";
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

    this.pubsubService.publishtoMQTT(updateFormBody).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onWIFIConfigFormSubmit(form: NgForm) {
    const formValues = form.value;
    let updateFormBody: any;
    
    if(formValues.ssid && formValues.password) {
      this.mqttcommand = "WLAN0CONNECT";
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
      this.mqttcommand = "WLAN0DHCP";
      // Update dhcp mode of wlan0
      updateFormBody = {
        "clientId": this.gatewayDetails.clientId,
        "command": "WLAN0DHCP",
        "wlan0": {
          "ip_mode": "dhcp"
        }
      }
    } else if(formValues.ipaddressmode === "1") {
      this.mqttcommand = "WLAN0STATIC";
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

    this.pubsubService.publishtoMQTT(updateFormBody).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onCELLULARConfigFormSubmit(form: NgForm) {

  }

  onfirmwareConfigFormSubmit(form: NgForm) {

  }

  onsensorConfigFormSubmit(form: NgForm) {

  }

  onfactoryResetFormSubmit() {
    
  }

  onAutoSSHToggle(event: any) {
    let deviceConfigJSON: any;
    if(event.target.checked) {
      this.mqttcommand = "AUTOSSHON";
      deviceConfigJSON = {
        "clientId": this.gatewayDetails.clientId,
        "command": "AUTOSSHON",
        "autossh": {
          "monitor_port": 31030,
          "remote_port": 10030,
          "user_at_server": "ubuntu@ec2-3-84-170-7.compute-1.amazonaws.com"
        }
      }
    } else {
      this.mqttcommand = "AUTOSSHOFF";
      deviceConfigJSON = {
        "clientId": this.gatewayDetails.clientId,
        "command": "AUTOSSHOFF"
      }
    }

    let IOTParams = {
      topic: "config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ongetDeviceConfig(cmd: string) {
    this.mqttcommand = "CMD_INFO_BTN";

    let IOTParams = this.getIOTParams(cmd);

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getIOTParams(command: string) {
    const selectedCommand = command;
    
    let deviceConfigJSON = {
      "clientId": this.gatewayid,
      "command": selectedCommand
    }

    let IOTParams = {
      topic: "config_sub_tt_message",
      payload: deviceConfigJSON
    }

    return IOTParams;
  }

  onCheckStatus() {
    let deviceConfigJSON = {
      "clientId": this.gatewayid,
      "command": "CMD_INFO"
    }

    let IOTParams = {
      topic: "config_sub_tt_message",
      payload: deviceConfigJSON
    }

    this.pubsubService.publishtoMQTT(IOTParams).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
