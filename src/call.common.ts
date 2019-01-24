import * as app from "tns-core-modules/application";

export interface TNSCallReceiveCallOptions {
}

export declare class TNSCall {
  receiveCall: (options?: TNSCallReceiveCallOptions) => Promise<void>;
  endCall: () => Promise<void>;
}
