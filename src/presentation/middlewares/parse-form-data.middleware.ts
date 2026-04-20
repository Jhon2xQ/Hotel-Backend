import { Context, Next } from "hono";
import { AppContext } from "../../common/types/app.types";

export async function parseFormDataMiddleware(c: AppContext, next: Next) {
  const contentType = c.req.header("content-type");
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
        let parsedValue: unknown;
        try {
          parsedValue = JSON.parse(value as string);
        } catch {
          parsedValue = value;
        }
        if (key in parsedData) {
          if (Array.isArray(parsedData[key])) {
            parsedData[key].push(parsedValue);
          } else {
            parsedData[key] = [parsedData[key], parsedValue];
          }
        } else {
          parsedData[key] = parsedValue;
        }
      }
    }

    c.set("rawFormData", parsedData);
  }

  await next();
}
