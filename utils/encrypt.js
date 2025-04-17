const crypto = require("crypto");
require("dotenv").config();

exports.encrypt = () => {
  const key = Buffer.alloc(16);
  Buffer.from(process.env.AES_KEY).copy(key);
  const iv = Buffer.alloc(16, 0);

  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted;
};

exports.decrypt = (inputPassword, encryptedBuffer) => {
  const key = Buffer.alloc(16);
  Buffer.from(process.env.AES_KEY).copy(key);
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(Buffer.from(encryptedBuffer));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString() == inputPassword;
};
