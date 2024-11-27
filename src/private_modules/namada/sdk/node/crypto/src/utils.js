"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readVecU8Pointer = exports.readVecStringPointer = exports.readStringPointer = void 0;
const decoder = new TextDecoder("utf-8", { ignoreBOM: true, fatal: true });
const getUint8Memory = (memory) => new Uint8Array(memory.buffer);
const readVecU8Pointer = ({ pointer, length }, memory) => getUint8Memory(memory).subarray(pointer, pointer + length);
exports.readVecU8Pointer = readVecU8Pointer;
const readStringPointer = (stringPointer, memory) => decoder.decode(readVecU8Pointer(stringPointer, memory));
exports.readStringPointer = readStringPointer;
const readVecStringPointer = ({ pointers, lengths }, memory) => {
    const memoryBuffer = getUint8Memory(memory);
    return Array.from(pointers).map((p, i) => decoder.decode(memoryBuffer.subarray(p, p + lengths[i])));
};
exports.readVecStringPointer = readVecStringPointer;
//# sourceMappingURL=utils.js.map