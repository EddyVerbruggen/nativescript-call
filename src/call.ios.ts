import { TNSCall as TNSCallBase, TNSCallReceiveCallOptions } from "./call.common";
import * as app from "tns-core-modules/application";

export class TNSCall implements TNSCallBase {
  static callController: CXCallController;
  private static provider: CXProvider;
  private static handle: CXHandle;

  receiveCall(options?: TNSCallReceiveCallOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      TNSCall.handle = CXHandle.alloc().initWithTypeValue(CXHandleType.PhoneNumber, "+31650298958");
      const callUUID = NSUUID.new();
      const callUpdate = CXCallUpdate.new();

      callUpdate.remoteHandle = TNSCall.handle;
      callUpdate.hasVideo = false;
      callUpdate.localizedCallerName = "Sjaak Trekhaak";
      callUpdate.supportsGrouping = false;
      callUpdate.supportsUngrouping = false;
      callUpdate.supportsHolding = false;
      callUpdate.supportsDTMF = false;

      this.ensureProvider();
      TNSCall.provider.reportNewIncomingCallWithUUIDUpdateCompletion(callUUID, callUpdate, (error: NSError) => {
        if (error === null) {
          resolve();
        } else {
          console.log("Incoming call error: " + error.localizedDescription);
          reject(error.localizedDescription);
        }
      });
    });
  }

  endCall(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log(">>>> this.callController: " + TNSCall.callController);
      console.log(">>>> this.callController.callObserver: " + TNSCall.callController.callObserver);
      const calls: NSArray<CXCall> = TNSCall.callController.callObserver.calls;
      if (calls.count === 1) {
        console.log("call: " + calls[0]);
        console.log("call uuid: " + calls[0].UUID);

        const endCallAction: CXEndCallAction = CXEndCallAction.alloc().initWithCallUUID(calls[0].UUID);
        const transaction: CXTransaction = CXTransaction.alloc().initWithAction(endCallAction);
        TNSCall.callController.requestTransactionCompletion(transaction, (error: NSError) => {
          if (error === null) {
            console.log("requestTransactionCompletion OK");
            resolve();
          } else {
            console.log("Error ending call: " + error.localizedDescription);
            reject(error.localizedDescription);
          }
        });
      } else {
        reject("No calls active");
      }
    });
  }

  private ensureProvider(): void {
    if (TNSCall.provider) {
      return;
    }
    console.log("ensuring provider..");

    const appName = NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleDisplayName");
    const providerConfiguration = CXProviderConfiguration.alloc().initWithLocalizedName(appName);
    providerConfiguration.maximumCallGroups = 1;
    providerConfiguration.maximumCallsPerCallGroup = 1;

    const handleTypes = NSMutableSet.new();
    handleTypes.addObject(CXHandleType.PhoneNumber);
    providerConfiguration.supportedHandleTypes = <any>handleTypes;
    providerConfiguration.supportsVideo = false;

    // see https://github.com/WebsiteBeaver/CordovaCall/blob/b8ccb0d2684b3c769b27b33711df5113f2e874f4/src/ios/CordovaCall.m#L50
    // if (@available(iOS 11.0, *)) {
    //   providerConfiguration.includesCallsInRecents = NO;
    // }

    TNSCall.provider = CXProvider.alloc().initWithConfiguration(providerConfiguration);
    TNSCall.provider.setDelegateQueue(CXProviderDelegateImpl.initWithOwner(new WeakRef(this)), null);
    TNSCall.callController = CXCallController.new();
  }
}

// commented, because this is only needed to start a call, not for receiving one
/*
@ObjCClass(UIApplicationDelegate)
export class TNSCallAppDelegate extends UIResponder implements UIApplicationDelegate {
  applicationContinueUserActivityRestorationHandler(application: UIApplication, userActivity: NSUserActivity, restorationHandler: (restorableObjects: NSArray<any>) => void): boolean {
    const isVideoCall = userActivity.activityType === "INStartVideoCallIntent";
    console.log("isVideoCall: " + isVideoCall);
    return true;
  }
}

app.ios.delegate = TNSCallAppDelegate;
*/

@ObjCClass(CXProviderDelegate)
class CXProviderDelegateImpl extends NSObject implements CXProviderDelegate {

  private owner: WeakRef<TNSCall>;

  static initWithOwner(owner: WeakRef<TNSCall>): CXProviderDelegateImpl {
    const delegate = <CXProviderDelegateImpl>super.new();
    delegate.owner = owner;
    return delegate;
  }

  // only this one is mandatory
  providerDidReset(provider: CXProvider): void {
    console.log("delegate, providerDidReset");
  }

  providerDidActivateAudioSession(provider: CXProvider, audioSession: AVAudioSession): void {
    console.log("delegate, providerDidActivateAudioSession");
  }

  providerDidBegin(provider: CXProvider): void {
    console.log("delegate, providerDidBegin");
  }

  providerDidDeactivateAudioSession(provider: CXProvider, audioSession: AVAudioSession): void {
    console.log("delegate, providerDidDeactivateAudioSession");
  }

  providerExecuteTransaction(provider: CXProvider, transaction: CXTransaction): boolean {
    console.log("delegate, providerExecuteTransaction");
    return true;
  }

  providerPerformAnswerCallAction(provider: CXProvider, action: CXAnswerCallAction): void {
    console.log("delegate, providerPerformAnswerCallAction");
  }

  providerPerformEndCallAction(provider: CXProvider, action: CXEndCallAction): void {
    console.log("delegate, providerPerformEndCallAction");
    console.log(">>>> TNSCall.callController: " + TNSCall.callController);
    const calls: NSArray<CXCall> = TNSCall.callController.callObserver.calls;
    if (calls.count === 1) {
      if (calls[0].hasConnected) {
        console.log("Ended connected call");
      } else {
        console.log("Ended non-connected call");
      }
      console.log("call: " + calls[0]);
      console.log("call uuid: " + calls[0].UUID);
    }
  }

  providerPerformPlayDTMFCallAction(provider: CXProvider, action: CXPlayDTMFCallAction): void {
    console.log("delegate, providerPerformPlayDTMFCallAction");
  }

  providerPerformSetGroupCallAction(provider: CXProvider, action: CXSetGroupCallAction): void {
    console.log("delegate, providerPerformSetGroupCallAction");
  }

  providerPerformSetHeldCallAction(provider: CXProvider, action: CXSetHeldCallAction): void {
    console.log("delegate, providerPerformSetHeldCallAction");
  }

  providerPerformSetMutedCallAction(provider: CXProvider, action: CXSetMutedCallAction): void {
    console.log("delegate, providerPerformSetMutedCallAction");
  }

  providerPerformStartCallAction(provider: CXProvider, action: CXStartCallAction): void {
    console.log("delegate, providerPerformStartCallAction");
  }

  providerTimedOutPerformingAction(provider: CXProvider, action: CXAction): void {
    console.log("delegate, providerTimedOutPerformingAction");
  }
}
