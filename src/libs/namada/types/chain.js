export var BridgeType;
(function (BridgeType) {
    BridgeType["IBC"] = "ibc";
    BridgeType["Ethereum"] = "ethereum-bridge";
})(BridgeType || (BridgeType = {}));
// Define constant with extension properties
export var Extensions = {
    namada: {
        alias: "Namada",
        id: "namada",
        // TODO: Update to most recent release
        url: "https://namada.me",
    },
    keplr: {
        alias: "Keplr",
        id: "keplr",
        url: "https://www.keplr.app/",
    },
    metamask: {
        alias: "Metamask",
        id: "metamask",
        url: "https://metamask.io/",
    },
};
