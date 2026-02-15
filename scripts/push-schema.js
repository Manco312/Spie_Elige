import { execSync } from "child_process";

try {
  console.log("Pushing Prisma schema to database...");
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    cwd: process.cwd(),
  });
  console.log("Schema pushed successfully!");
} catch (error) {
  console.error("Failed to push schema:", error.message);
  process.exit(1);
}
