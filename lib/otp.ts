import Redis from "ioredis";
import { randomInt } from "node:crypto";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});

export async function issueOtp(subject: string): Promise<string> {
  const otp = process.env.NODE_ENV === "production" ? `${randomInt(100000, 1000000)}` : "123456";
  try {
    await redis.connect().catch(() => undefined);
    await redis.set(`otp:${subject}`, otp, "EX", Number(process.env.OTP_TTL_SECONDS ?? 300));
  } catch (error) {
    console.error("OTP could not be stored in Redis.", error);
    throw new Error("OTP service unavailable.");
  }
  return otp;
}

export async function verifyOtp(subject: string, otp: string): Promise<boolean> {
  try {
    await redis.connect().catch(() => undefined);
    const expected = await redis.get(`otp:${subject}`);
    if (expected) {
      await redis.del(`otp:${subject}`);
      return expected === otp;
    }
  } catch (error) {
    console.error("OTP verification could not reach Redis.", error);
  }
  return false;
}
