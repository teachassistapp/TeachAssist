import { N, E } from "../data/keys";

var bigInt = require("big-integer");

function hexEncode(str) {
  var hex_array = [];
  for (var n = 0, l = str.length; n < l; n++) {
    var hex = Number(str.charCodeAt(n)).toString(16);
    hex_array.push(hex);
  }
  return hex_array.join("");
}

export const encryptRSA = (msg) => {
  var m = hexEncode(msg);
  m = bigInt(m, 16);
  return String(m.modPow(E, N));
};
