export default class RegexpUtils {
  static POSTAL_CODE = /^\d{5}$/;
  static PHONE_NUM = /^0[1-9](?:\s\d{2}){4}$/;
  static CRYPTO = /^\d{3}$/;
  static EXPIRATION_DATE = /^(?:0?[0-9]|1[0-2])\/\d{2}$/;
  static CARD_NUM = /^(?:\s\d{4}){3}\d{4}$/;
  static CARD_NAME = /^[a-zA-Z-]+\s[a-zA-Z-]+$/g;
}
