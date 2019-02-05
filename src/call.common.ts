import { Image } from "tns-core-modules/ui/image";

export type TNSCallHandleType = "PHONE" | "EMAIL";

export interface TNSCallReceiveCallOptions {
  callerName?: string;

  /**
   * Default the name of your app.
   */
  appName?: string;

  /**
   * The name of an icon to show for your app. Loaded from the App_Resources folder.
   */
  icon?: string;

  /**
   * Default "PHONE"
   */
  handleType?: TNSCallHandleType;

  /**
   * Either a phonenr when handleType is "PHONE", or an emailaddress when handleType is "EMAIL"
   */
  handleId?: string;

  /**
   * Default false
   */
  hasVideo?: boolean;

  /**
   * A Boolean value that indicates whether the call can send DTMF (dual tone multifrequency) tones
   * via hard pause digits or in-call keypad entries.
   * Default false
   */
  supportsDTMF?: boolean;
}

export declare class TNSCall {
  receiveCall: (options?: TNSCallReceiveCallOptions) => Promise<void>;
  endCall: () => Promise<void>;
}
