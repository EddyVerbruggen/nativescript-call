import { TNSCall as TNSCallBase, TNSCallReceiveCallOptions } from "./call.common";

export class TNSCall implements TNSCallBase {
  receiveCall(options?: TNSCallReceiveCallOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      reject("Not (yet) implemented on Android");
    });
  }

  endCall(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      reject("Not (yet) implemented on Android");
    });
  }
}