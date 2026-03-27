import crypto from "crypto";

export function generateRefCode(): string {
    return crypto.randomBytes(6).toString("base64url").toUpperCase().slice(0, 8);
}
