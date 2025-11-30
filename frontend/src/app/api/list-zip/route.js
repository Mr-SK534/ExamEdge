import fs from "fs";
import path from "path";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const folder = searchParams.get("folder");

    const dirPath = path.join(process.cwd(), "public", folder);

    if (!fs.existsSync(dirPath)) {
      return Response.json({ files: [] });
    }

    const files = fs.readdirSync(dirPath).filter((file) => file.endsWith(".zip"));

    return Response.json({ files });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
