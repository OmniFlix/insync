"use strict";
// Constants defining events which may be subscribed to
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetamaskEvents = exports.KeplrEvents = exports.Events = void 0;
// Namada extension events
var Events;
(function (Events) {
    Events["AccountChanged"] = "namada-account-changed";
    Events["NetworkChanged"] = "namada-network-changed";
    Events["ExtensionLocked"] = "namada-extension-locked";
    Events["ConnectionRevoked"] = "namada-connection-revoked";
})(Events || (exports.Events = Events = {}));
// Keplr extension events
var KeplrEvents;
(function (KeplrEvents) {
    KeplrEvents["AccountChanged"] = "keplr_keystorechange";
})(KeplrEvents || (exports.KeplrEvents = KeplrEvents = {}));
// Metamask extension window.ethereum events
var MetamaskEvents;
(function (MetamaskEvents) {
    MetamaskEvents["AccountChanged"] = "accountsChanged";
    MetamaskEvents["BridgeTransferCompleted"] = "bridge-transfer-completed";
})(MetamaskEvents || (exports.MetamaskEvents = MetamaskEvents = {}));
//# sourceMappingURL=events.js.map