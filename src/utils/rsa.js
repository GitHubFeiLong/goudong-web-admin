/**
 * encryptlong 分段加密，分段解密
 *
 */
import { JSEncrypt } from 'encryptlong'
const CryptoJS = require('crypto-js');
// ~ 服务端相关
// =====================================================================================================================
/**
 * 服务端公钥
 */
const SERVER_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAgMMsJimfsZqN//iyRVfC/v2Yec7mf5lUeuFIsrquofl5VFwoUx13UQvV8WI4alHNCXKsnvNuIqQ7ESOznQ3aS4ZEvhpwnjMxDDvjZ9xCXRVU06e7ppI8I8neT2PtSh7IvV3gSRauLxMRkNw5UIhiPQ4hps0kLzfZwsRm17/FE/gBbN1MvNY77JneRgwsbuMIUaxn22Aqq2uZgTOOlLsHaGnthDBXb7QPlngxe/wAQF5cckJg4qzQ2AUtBV9PXrnK07cBT+cUWTYhKrvK2VWDXEgmv8b62WacpPVLuCJE9JWmuVqTgYhzTGfXGBr8l8hjCO8FOBzGPmgZTee3HcAcDQIDAQAB";

// 声明goudong-java的encrypt对象
const serverJsEncrypt = new JSEncrypt();
serverJsEncrypt.setPublicKey(SERVER_PUBLIC_KEY); // 设置公钥

/**
 * 使用服务端公钥加密
 * @param data 加密前的字符串
 * @return result 加密后的字符串(Base64编码后的密文)
 */
export function encrypt(data) {
  return serverJsEncrypt.encryptLong(data);
}

/**
 * 验签
 * @param data 后端传递的数据
 * @param signature 后端传递的签名
 */
export function verify(data, signature) {
  return serverJsEncrypt.verify(data, signature, CryptoJS.MD5);
}

