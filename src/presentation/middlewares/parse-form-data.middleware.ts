import { Context, Next } from "hono";
import { AppContext } from "../../common/types/app.types";

export async function parseFormDataMiddleware(c: AppContext, next: Next) {
  const contentType = c.req.header("content-type");

  if (contentType?.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    const parsedData: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (value && typeof value === "object" && "name" in value && "type" in value) {
        // Handle file uploads
        if (!parsedData[key]) {
          parsedData[key] = [];
        }
        parsedData[key].push(value);
      } else {
        // Handle regular form fields
        // Try to parse JSON values
        try {
          parsedData[key] = JSON.parse(value as string);
        } catch {
          // If not JSON, keep as string
          parsedData[key] = value;
        }
      }
    }

    // Store parsed data in context for validation middleware
    c.set("rawFormData", parsedData);
  }

  await next();
}
