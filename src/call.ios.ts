import { TNSCall as TNSCallBase, TNSCallReceiveCallOptions } from "./call.common";

export class TNSCall implements TNSCallBase {
  static callController: CXCallController;
  private static provider: CXProvider;
  private static handle: CXHandle;

  receiveCall(options?: TNSCallReceiveCallOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      TNSCall.handle = CXHandle.alloc().initWithTypeValue(
          !options || options.handleType === "PHONE" ? CXHandleType.PhoneNumber : CXHandleType.EmailAddress,
          options.handleId);

      const callUUID = NSUUID.new();
      const callUpdate = CXCallUpdate.new();

      callUpdate.remoteHandle = TNSCall.handle;
      if (options.callerName) {
        callUpdate.localizedCallerName = options.callerName;
      }
      callUpdate.hasVideo = options && options.hasVideo;
      callUpdate.supportsDTMF = options && options.supportsDTMF;
      callUpdate.supportsGrouping = false;
      callUpdate.supportsUngrouping = false;
      callUpdate.supportsHolding = false;

      this.ensureProvider(options);

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
      const calls: NSArray<CXCall> = TNSCall.callController.callObserver.calls;
      if (calls.count === 1) {
        const endCallAction: CXEndCallAction = CXEndCallAction.alloc().initWithCallUUID(calls[0].UUID);
        const transaction: CXTransaction = CXTransaction.alloc().initWithAction(endCallAction);
        TNSCall.callController.requestTransactionCompletion(transaction, (error: NSError) => {
          if (error === null) {
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

  private ensureProvider(options?: TNSCallReceiveCallOptions): void {
    const appName = options.appName || NSBundle.mainBundle.objectForInfoDictionaryKey("CFBundleDisplayName");
    const providerConfiguration = CXProviderConfiguration.alloc().initWithLocalizedName(appName);
    providerConfiguration.maximumCallGroups = 1;
    providerConfiguration.maximumCallsPerCallGroup = 1;

    if (options.icon) {
      const iconImage = UIImage.imageNamed(options.icon);
      if (iconImage) {
        providerConfiguration.iconTemplateImageData = UIImagePNGRepresentation(iconImage);
      } else {
        console.log("icon not found: " + options.icon);
      }
    }

    const handleTypes = NSMutableSet.new();
    handleTypes.addObject(CXHandleType.EmailAddress);
    handleTypes.addObject(CXHandleType.PhoneNumber);
    providerConfiguration.supportedHandleTypes = <any>handleTypes;
    providerConfiguration.supportsVideo = true;

    if (TNSCall.provider) {
      TNSCall.provider.configuration = providerConfiguration;
    } else {
      TNSCall.provider = CXProvider.alloc().initWithConfiguration(providerConfiguration);
      TNSCall.provider.setDelegateQueue(CXProviderDelegateImpl.initWithOwner(new WeakRef(this)), null);
      TNSCall.callController = CXCallController.new();
    }
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

  // this could be used to notify the app of 'rejected' and 'hangup' events (only logging them for now)
  providerPerformEndCallAction(provider: CXProvider, action: CXEndCallAction): void {
    const calls: NSArray<CXCall> = TNSCall.callController.callObserver.calls;
    if (calls.count === 1) {
      if (calls[0].hasConnected) {
        console.log("Ended connected call (hang up)");
      } else {
        console.log("Ended non-connected call (rejected)");
      }
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
