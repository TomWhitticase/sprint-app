export default function RandomString(length?: number): string {
  const chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const charsLength = chars.length;
  let result = "";
  for (let i = 0; i < (length || 32); i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength));
  }
  return result;
}
