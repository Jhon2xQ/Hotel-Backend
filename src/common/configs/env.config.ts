export const TRUSTED_ORIGINS: string = process.env.TRUSTED_ORIGINS ?? "http://localhost:3000";

export const S3_REGION: string = process.env.S3_REGION ?? "us-east-1";
export const S3_ENDPOINT: string = process.env.S3_ENDPOINT ?? "http://localhost:8333";
export const S3_ACCESS_KEY_ID: string = process.env.S3_ACCESS_KEY_ID ?? "admin";
export const S3_SECRET_ACCESS_KEY: string = process.env.S3_SECRET_ACCESS_KEY ?? "tu-secret-key";
export const S3_FORCE_PATH_STYLE: boolean = process.env.S3_FORCE_PATH_STYLE === "true" || true;
export const S3_BUCKET_NAME: string = process.env.S3_BUCKET_NAME ?? "my-bucket";
