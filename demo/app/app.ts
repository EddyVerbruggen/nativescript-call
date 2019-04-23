import * as application from "tns-core-modules/application";
import { CustomAppDelegate } from "./delegate";

application.ios.delegate = CustomAppDelegate;
application.run({moduleName: "main-page"});
