# NativeScript Call plugin

[![Build Status][build-status]][build-url]
[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][npm-url]
[![Twitter Follow][twitter-image]][twitter-url]

[build-status]:https://travis-ci.org/EddyVerbruggen/nativescript-call.svg?branch=master
[build-url]:https://travis-ci.org/EddyVerbruggen/nativescript-call
[npm-image]:http://img.shields.io/npm/v/nativescript-call.svg
[npm-url]:https://npmjs.org/package/nativescript-call
[downloads-image]:http://img.shields.io/npm/dm/nativescript-call.svg
[twitter-image]:https://img.shields.io/twitter/follow/eddyverbruggen.svg?style=social&label=Follow%20me
[twitter-url]:https://twitter.com/eddyverbruggen

## Dude, I already have a Phone app on my phone..
Sure 😅

But what if your app supports VOIP / WebRTC calls? You'll want to have the operating system pop up the
native call dialog, right? That's where this plugin comes in.

Currently iOS only, where we leverage `CallKit`, which is part of the iOS SDK since iOS 10.

## Installation
```bash
tns plugin add nativescript-call
```

## Demo
Check the source in the [demo](/demo) folder, or run it on your own device:

```bash
git clone https://github.com/EddyVerbruggen/nativescript-call
cd nativescript-call/src
npm i
npm run demo.ios
```

> Usage in NativeScript-Angular and NativeScript-Vue is nothing different from what you'd do in NativeScript-Core.

## API

### `receiveCall`
The properties you can pass to this method are:

| Property | Type | Description |
| --- | --- | --- |
| appName | `string` | The app's name, as shown on the caller screen. Default the name of your app. |
| icon | `string` | The name of an icon to show for your app. Loaded from the App_Resources folder (see the demo). |
| handleType | [`TNSCallHandleType`](https://github.com/EddyVerbruggen/nativescript-call/blob/7fec47292ba3e1452bb001993d5ba88f0ad9dd1d/src/call.common.ts#L3) | Either `"PHONE"` (default) or `"EMAIL"`. |
| handleId | `string` | Either a phone number when `handleType` is `"PHONE"`, or an email address when `handleType` is `"EMAIL"`. |
| callerName | `string` | The name to be displayed on the call UI. |
| hasVideo | `boolean` | Whether or not this call supports video. Default `false`. |
| supportsDTMF | `boolean` | Whether the call can send DTMF (dual tone multifrequency) tones via hard pause digits or in-call keypad entries. Default `false`. |

The event handlers you can pass to this method are:

| Name | Description |
| --- | --- | --- |
| onSpeakerOn | Triggered when the speaker is turned on. |
| onSpeakerOff | Triggered when the speaker is turned off. |

```typescript
import { TNSCall } from "nativescript-call";
const tnsCall = new TNSCall();

tnsCall.receiveCall(
    {
      appName: "My App",
      icon: "download-from-cloud", // see demo/app/App_Resources/iOS
      handleType: "PHONE",
      handleId: "+31612345678",
      callerName: "Donald J. Drumpf",
      hasVideo: true,
      supportsDTMF: true,
      onSpeakerOn: () => console.log("Speaker ON"),
      onSpeakerOff: () => console.log("Speaker OFF")
    })
    .then(() => console.log("Receive call success"))
    .catch(err => console.log("Error receiving call: " + err));
```

### `endCall`

```typescript
import { TNSCall } from "nativescript-call";
const tnsCall = new TNSCall();

tnsCall.endCall()
    .then(() => console.log("Ended call"))
    .catch(err => console.log("Error ending call: " + err));
```

## Receiving a call when the app is not running
Either use [Pusher](https://github.com/noodlewerk/NWPusher), or this CURL command:

```shell
curl -v -d '{"userInfo":"eddy.verbruggen","aps":{"sound":"default"},"title":"Eddy Verbruggen","callType":"VIDEO"}' --header "apns-topic: com.app.sample" --http2 --cert ~/Desktop/voip/ck.pem:ggk12 https://api.development.push.apple.com/3/device/DEVICE_VOIP_TOKEN
```
