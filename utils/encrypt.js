const crypto = require("crypto");

exports.encrypt = () => {
  const key = Buffer.alloc(16);
  Buffer.from("nexatest").copy(key); // copy "nexatest" into the first 8 bytes
  const iv = Buffer.alloc(16, 0);

  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(
    Buffer.from([
      186, 160, 187, 246, 112, 40, 55, 170, 209, 240, 182, 17, 239, 131, 99,
      223,
    ])
  );
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  console.log(decrypted.toString());
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
