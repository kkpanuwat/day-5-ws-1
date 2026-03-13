const jwt = require('jsonwebtoken');

// ดึงค่า config มาเตรียมไว้
const secret = process.env.JWT_SECRET;
const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

if (!secret) {
  throw new Error('FATAL: JWT_SECRET is not defined.');
}

// ฟังก์ชันสำหรับ "ออกบัตร" (Login สำเร็จค่อยเรียกใช้)
function signAccessToken(payload) {
  return jwt.sign(payload, secret, { expiresIn });
}

// ฟังก์ชันสำหรับ "ตรวจบัตร" (ใช้ใน Middleware)
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    // ถ้า Token หมดอายุ หรือ Signature ไม่ถูก จะ throw error
    return null;
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
};