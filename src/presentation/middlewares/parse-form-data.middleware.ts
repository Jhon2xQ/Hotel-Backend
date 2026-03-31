import { Context, Next } from "hono";
import { AppContext } from "../../common/types/app.types";

export async function parseFormDataMiddleware(c: AppContext, next: Next) {
  const contentType = c.req.header("content-type");
  const FIELDS_TO_STRING = ["nro_habitacion"];

  if (contentType?.includes("multipart/form-data")) {
    const formData = await c.req.formData();
    const parsedData: Record<string, any> = {};

    for (const [key, value] of formData.entries()) {
      if (value && typeof value === "object" && "name" in value && "type" in value) {
        if (!parsedData[key]) {
          parsedData[key] = [];
        }
        parsedData[key].push(value);
      } else {
        // Handle regular form fields
        // Try to parse JSON values
        let parsedValue: unknown;
        try {
          parsedValue = JSON.parse(value as string);
        } catch {
          // If not JSON, keep as string
          parsedValue = value;
        }

        // Convert specific fields to string
        if (FIELDS_TO_STRING.includes(key) && parsedValue !== null && parsedValue !== undefined) {
          parsedData[key] = String(parsedValue);
        } else {
          parsedData[key] = parsedValue;
        }
      }
    }

    c.set("rawFormData", parsedData);
  }

  await next();
}
