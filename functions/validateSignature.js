/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const crypto = require("crypto");

const secret = "queenQuartet";
function validateSignature(signature, body) {
  // this is creating the parts that's needed
  // signatureValues.t is the timestamp
  // signatureValues.v1 is the signature
  const signatureParts = signature.split(",");
  const signatureValues = {};
  signatureParts.forEach((part) => {
    const [key, value] = part.split("=");
    signatureValues[key] = value;
  });

  // this first check if the signature is older than 30 seconds
  const now = Date.now() / 1000; // in seconds
  // the base date.now() give us the time in milliseconds, where as
  // t in the header is in seconds, so we divide by 1000
  if (now - signatureValues.t > 30) {
    // the signature is valid for 30 seconds
    // after that, we can immediately reject it,
    // the code does not need to run further
    return false;
  }

  // then we check the actual signature itself
  // eslint-disable-next-line max-len
  const signatureBase =`${signatureValues.t}.${body}`;

  console.log(signatureBase);
  const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signatureBase)
      .digest("hex");
  console.log("Real signature", signatureValues.v1);
  console.log("expectedSignature", expectedSignature);
  return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, "utf-8"),
      Buffer.from(signatureValues.v1, "utf-8"),
  );
}

exports.validateSignature = validateSignature;
