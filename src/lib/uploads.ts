import path from "path";
import { mkdir, writeFile } from "fs/promises";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function saveUpload(file: File) {
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  await mkdir(uploadsDir, { recursive: true });

  const safeName = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, "-")
    .replace(/-+/g, "-");

  const fileName = `${Date.now()}-${safeName}`;
  const filePath = path.join(uploadsDir, fileName);

  await writeFile(filePath, buffer);

  return `/uploads/${fileName}`;
}
