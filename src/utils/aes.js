/**
 * 自定义AES工具。
 * 跟java对接AES的加密解密等操作，所以这里适合全局使用。如有特殊情况再添加相应的方法，但是方法命名需要分明
 * 注意：
 * 1、因为跟java对接AES，所以这里的密钥和iv偏移量不写死，并暂时不使用密钥偏移量。
 * 2、CryptoJS.enc.Utf8.parse(key) 不能重复使用，否则解密不出来数据
 * <pre>
 *    1. 引入：import * as aes from '@/utils/aes'
 *    2. 获取密钥：const key = aes.generateKey(16);
 *    3. 加密：const encryptStr = aes.encrypt("data", key);
 *    4. 解密：const decryptStr = aes.decrypt("encryptStr", key);
 * </pre>
 * @author msi
 * @version 1.0.0
 */
import CryptoJS from "crypto-js"; // 引用AES源码js

/**
 * 生成AES的key，默认16位
 * @param length 生成的长度，默认值16
 */
export function generateKey(length = 16) {
  const random = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    str = str + random.charAt(Math.random() * random.length)
  }
  return str;
}

/**
 * 加密
 * @param data
 * @param key
 */
export function encrypt(data, key) {
  const dataWordArray = CryptoJS.enc.Utf8.parse(data);
  const encrypted = CryptoJS.AES.encrypt(dataWordArray, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  //
  /*
    encrypted 对象包含一些属性：
    var encrypted = CryptoJS.AES.encrypt("Message", "Secret Passphrase");
    encrypted.key
    > "74eb593087a982e2a6f5dded54ecd96d1fd0f3d44a58728cdcd40c55227522223 ";
    encrypted.iv
    > "7781157e2629b094f0e3dd48c4d786115";
    encrypted.salt
    > "7a25f9132ec6a8b34";
    encrypted.ciphertext
    > "73e54154a15d1beeb509d9e12f1e462a0";
    encrypted
    > "U2FsdGVkX1+iX5Ey7GqLND5UFUoV0b7rUJ2eEvHkYqA=";
   */
  // Base64编码的字符串（encrypted.ciphertext.toString() 16进制的字符串）
  return encrypted.toString();
}

/**
 * 解密后端返回的加密数据
 * @param word
 * @param key
 */
export function decrypt(data, key) {
  const decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
  const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
