declare global {
  var crypto: {
    getRandomValues: (array: Uint8Array) => Uint8Array;
  };
}
