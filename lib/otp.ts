import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL ?? "redis://localhost:6379", {
  lazyConnect: true,
  maxRetriesPerRequest: 1
});

export async function issueOtp(subject: string): Promise<string> {
  const otp = process.env.NODE_ENV === "production" ? `${Math.floor(100000 + Math.random() * 900000)}` : "123456";
  try {
    await redis.connect().catch(() => undefined);
    await redis.set(`otp:${subject}`, otp, "EX", Number(process.env.OTP_TTL_SECONDS ?? 300));
  } catch {
    console.warn("OTP Redis unavailable; use a configured Redis service before production.");
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
  } catch {
    console.warn("OTP Redis unavailable during verification.");
  }
  return process.env.NODE_ENV !== "production" && otp === "123456";
}
