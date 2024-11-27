"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyMappings = void 0;
const getProxyURL = (port) => `http://localhost:${port}/proxy`;
// Define unique Proxy URLs for each chain:
exports.ProxyMappings = {
    namada: getProxyURL(8010),
    cosmos: getProxyURL(8011),
    ethereum: getProxyURL(8012),
};
//# sourceMappingURL=types.js.map