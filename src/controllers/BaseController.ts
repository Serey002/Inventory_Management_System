import { Response } from "express";
import { AppError } from "../errors/AppError";

export abstract class BaseController {
  protected async handleRequest(
    res: Response,
    action: () => Promise<void>,
    fallbackMessage: string,
    fallbackStatusCode: number,
  ): Promise<void> {
    try {
      await action();
    } catch (error) {
      const message    = error instanceof Error    ? error.message    : fallbackMessage;
      const statusCode = error instanceof AppError ? error.statusCode : fallbackStatusCode;
      this.sendError(res, message, statusCode);
    }
  }

  protected sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
    res.status(statusCode).json({ success: true, data });
  }

  protected sendCreated<T>(res: Response, data: T): void {
    this.sendSuccess(res, data, 201);
  }

  protected sendError(res: Response, message: string, statusCode = 400): void {
    res.status(statusCode).json({ success: false, message });
  }

  protected sendNotFound(res: Response, entity = "Resource"): void {
    this.sendError(res, `${entity} not found`, 404);
  }

  protected resolveError(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }

  protected parseId(raw: string | string[] | undefined): number | null {
    const str = Array.isArray(raw) ? raw[0] : raw;
    if (!str) return null;
    const id = parseInt(str, 10);
    return isNaN(id) ? null : id;
  }

  protected parseQueryString(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
  }

  protected parseQueryBoolean(value: unknown): boolean | undefined {
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return undefined;
  }

  protected parseQueryPositiveInt(value: unknown, defaultValue: number = 1, max?: number): number {
    const num = typeof value === "string" ? parseInt(value, 10) : typeof value === "number" ? value : NaN;
    if (isNaN(num) || num <= 0) return defaultValue;
    if (max && num > max) return max;
    return num;
  }
}

export default BaseController;