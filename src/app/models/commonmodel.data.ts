export interface User {
  active: boolean,
  name: string,
  email: string,
  phonenumber: string,
  orgname: string,
  firstname: string,
  lastname: string
}

export interface Sensor {
  sensorName: string,
  sensorid: string,
  status: string,
  gateway: string,
  activationdate: string,
  lastconnected: string
}

export interface Gateway {
  gatewayName: string,
  gatewayid: string,
  status: string,
  sensor: string,
  activationdate: string,
  lastconnected: string
}