const getProxyURL = (port) => `http://localhost:${port}/proxy`;
// Define unique Proxy URLs for each chain:
export const ProxyMappings = {
    namada: getProxyURL(8010),
    cosmos: getProxyURL(8011),
    ethereum: getProxyURL(8012),
};
//# sourceMappingURL=types.js.map