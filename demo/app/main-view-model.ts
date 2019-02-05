import { Observable } from "tns-core-modules/data/observable";
import { TNSCall } from "nativescript-call";

export class HelloWorldModel extends Observable {
  public message: string;
  private tnsCall: TNSCall;

  constructor() {
    super();
    this.set("message", "Press any button below..");
    this.tnsCall = new TNSCall();
  }

  doReceiveCall() {
    this.tnsCall.receiveCall(
        {
          appName: "My App",
          icon: "download-from-cloud",
          callerName: "Donald J. Drumpf",
          hasVideo: true,
          supportsDTMF: true,
          handleType: "PHONE",
          handleId: "+31612345678"
        })
        .then(() => console.log("Receive call success"))
        .catch(err => console.log("Error receiving call: " + err));
  }

  doEndCall() {
    this.tnsCall.endCall()
        .then(() => console.log("Ended call"))
        .catch(err => console.log("Error ending call: " + err));
  }
}
