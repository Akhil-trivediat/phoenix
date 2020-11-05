export enum AlertType {
    success,
    info,
    warning,
    danger
}

export interface Alert {
    type: string;
    message: string;
}