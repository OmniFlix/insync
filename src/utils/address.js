import { fromBech32 } from '@cosmjs/encoding/build/bech32';
import { bech32 } from '@scure/base';

export const decodeFromBech32 = (key) => {
    try {
        fromBech32(key);
        return true;
    } catch (e) {
        return false;
    }
};

export const checkNamada = (key, expectedPrefix) => {
    try {
        const decoded = bech32.decode(key);
        // Confirm the prefix matches expected (tnam, znam, etc.)
        if (decoded.prefix !== expectedPrefix) return false;

        // Confirm length is 32 bytes (typically for Namada addresses)
        // const bytes = bech32.fromWords(decoded.words);
        return true;
    } catch (e) {
        return false;
    }
};