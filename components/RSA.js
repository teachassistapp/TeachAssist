var bigInt = require("big-integer");

import { N, E } from "../data/keys";

function hex_encode(str) {
  var hex_array = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    hex_array.push(hex);
  }
  return hex_array.join("");
}

export const encryptRSA = (msg) => {
  var m = hex_encode(msg);
  m = bigInt(m, 16);
  const c = m.modPow(E, N);
  return String(c);
};
