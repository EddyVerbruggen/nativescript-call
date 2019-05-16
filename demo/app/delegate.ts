/// <reference path="../node_modules/tns-platform-declarations/ios.d.ts" />

import { TNSCall } from "nativescript-call";

const tnsCall = new TNSCall();

export class CustomAppDelegate extends UIResponder implements UIApplicationDelegate, PKPushRegistryDelegate {
  public static ObjCProtocols = [UIApplicationDelegate, PKPushRegistryDelegate];

  applicationDidFinishLaunchingWithOptions(application: UIApplication, launchOptions): boolean {
    console.log("### Delegate ### APPLICATION_WILL_FINISH_LAUNCHING_WITH_OPTIONS: ", this);

    let center = UNUserNotificationCenter.currentNotificationCenter();

    center.requestAuthorizationWithOptionsCompletionHandler(
        UNAuthorizationOptions.Alert |
        UNAuthorizationOptions.Sound |
        UNAuthorizationOptions.Badge,
        (granted, error) => {
          console.log("### Delegate ### REQUEST_AUTHORIZATION_WITH_OPTIONS_COMPLETION_HANDLER: " + granted);
          console.log(error);
        }
    );
    application.registerForRemoteNotifications();

    let pushkitVOIP = PKPushRegistry.alloc().initWithQueue(null);
    pushkitVOIP.delegate = this;
    pushkitVOIP.desiredPushTypes = NSSet.setWithObject(PKPushTypeVoIP);

    return true;
  }

  applicationDidBecomeActive(application: UIApplication): void {
    console.log("### Delegate ### APPLICATION_DID_BECOME_ACTIVE:  " + application);
  }

  applicationDidEnterBackground(application: UIApplication) {
    console.log("### Delegate ### APP_ENTER_IN_BACKGROUND");
  }

  applicationWillEnterForeground(application: UIApplication) {
    console.log("### Delegate ### APP_ENTER_IN_FOREGROUND");
  }

  applicationWillTerminate(application: UIApplication) {
    console.log("### Delegate ### APP_WILL_TERMINATE");
  }

  // curl -v -d '{"userInfo":"tumay.ceber","aps":{"sound":"default"},"title":"Tümay Çeber","callType":"VIDEO"}' --header "apns-topic: com.app.sample" --http2 --cert voip_certificate.pem:ggk12 https://api.development.push.apple.com/3/device/DEVICE_VOIP_TOKEN

  pushRegistryDidReceiveIncomingPushWithPayloadForTypeWithCompletionHandler(
      registry: PKPushRegistry,
      payload: PKPushPayload,
      type: string,
      completion: () => void,
  ): void {
    console.log('### Delegate ### PUSH_REGISTRY_DID_RECEIVE_INCOMING_PUSH_WITH_PAYLOAD_FOR_TYPE_WITH_COMPLETION_HANDLER', registry, payload, type);

    if (type !== PKPushTypeVoIP) {
      return;
    }

    const userInfo = payload.dictionaryPayload.valueForKey('userInfo');
    const title = payload.dictionaryPayload.valueForKey('title');
    const callType = payload.dictionaryPayload.valueForKey('callType');

    tnsCall
        .receiveCall({
          handleType: 'PHONE',
          handleId: userInfo,
          // handleId: "+31612345678",
          callerName: title,
          hasVideo: callType === 'VIDEO',
          supportsDTMF: false,
          onSpeakerOn: () => console.log('### Delegate ### Speaker ON'),
          onSpeakerOff: () => console.log('### Delegate ### Speaker OFF'),
        })
        .then(() => {
          console.log('### Delegate ### Receive call success, title: ' + title);
          completion && completion();
        })
        .catch(err => {
          console.log('### Delegate ### Error receiving call: ' + err);
          completion && completion();
        });
  }

  pushRegistryDidUpdatePushCredentialsForType(registry: PKPushRegistry, pushCredentials: PKPushCredentials, type: string): void {
    console.log('### Delegate ### pushRegistryDidUpdatePushCredentialsForType');
    const token = pushCredentials.token.toString().replace(/[<\s>]/g, '');
    console.log('### Delegate ### TOKEN', token);
  }
}