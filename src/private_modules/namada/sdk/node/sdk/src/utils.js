"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeSaplingPathArray = exports.makeSaplingPath = exports.makeBip44Path = exports.makeBip44PathArray = void 0;
/**
 * Return a properly formatted BIP-044 path array
 * @param coinType - SLIP-044 Coin designation
 * @param path - path object
 * @returns BIP-044 path array
 */
const makeBip44PathArray = (coinType, path) => {
    const { account, change = 0, index = 0 } = path;
    return new Uint32Array([44, coinType, account, change, index]);
};
exports.makeBip44PathArray = makeBip44PathArray;
/**
 * Return a properly formatted BIP-044 path
 * @param coinType - SLIP-044 Coin designation
 * @param bip44Path - path object
 * @param [fullPath] - boolean to determine whether to show full path or just path components
 * @returns BIP-044 path
 */
const makeBip44Path = (coinType, bip44Path, fullPath = true) => {
    const prefix = `m/44'/${coinType}'`;
    const { account, change = 0, index = 0 } = bip44Path;
    const path = `/${account}'/${change}'/${index}'`;
    return fullPath ? `${prefix}${path}` : `${path}`;
};
exports.makeBip44Path = makeBip44Path;
/**
 * Return a properly formatted Sapling path (Zip32)
 * @param coinType - SLIP-044 Coin designation
 * @param zip32Path - zip32 path object
 * @param [fullPath] - boolean to determine whether to show full path or just path components
 * @returns Sapling path
 */
const makeSaplingPath = (coinType, zip32Path, fullPath = true) => {
    const { account, index } = zip32Path;
    const prefix = `m/32'/${coinType}'`;
    let path = `/${account}'`;
    if (typeof index === "number")
        path += `/${index}`;
    return fullPath ? `${prefix}${path}` : path;
};
exports.makeSaplingPath = makeSaplingPath;
/**
 * Return a properly formatted Sapling path array (Zip32)
 * @param coinType - SLIP-044 Coin designation
 * @param account - numbered from index 0 in sequentially increasing manner. Defined as in BIP 44
 * @param [index] - optional index for additional keys under account. Defined as in BIP 44
 * @returns Sapling path array
 */
const makeSaplingPathArray = (coinType, account, index) => {
    const pathArray = [32, coinType, account];
    if (typeof index === "number")
        pathArray.push(index);
    return new Uint32Array(pathArray);
};
exports.makeSaplingPathArray = makeSaplingPathArray;
//# sourceMappingURL=utils.js.map