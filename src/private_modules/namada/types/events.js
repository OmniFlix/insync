// Constants defining events which may be subscribed to
// Namada extension events
export var Events;
(function (Events) {
    Events["AccountChanged"] = "namada-account-changed";
    Events["NetworkChanged"] = "namada-network-changed";
    Events["ExtensionLocked"] = "namada-extension-locked";
    Events["ConnectionRevoked"] = "namada-connection-revoked";
})(Events || (Events = {}));
// Keplr extension events
export var KeplrEvents;
(function (KeplrEvents) {
    KeplrEvents["AccountChanged"] = "keplr_keystorechange";
})(KeplrEvents || (KeplrEvents = {}));
// Metamask extension window.ethereum events
export var MetamaskEvents;
(function (MetamaskEvents) {
    MetamaskEvents["AccountChanged"] = "accountsChanged";
    MetamaskEvents["BridgeTransferCompleted"] = "bridge-transfer-completed";
})(MetamaskEvents || (MetamaskEvents = {}));
