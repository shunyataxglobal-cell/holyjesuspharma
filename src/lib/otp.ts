export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function isOTPExpired(createdAt: Date): boolean {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  const minutes = diff / (1000 * 60);
  return minutes > 10;
}