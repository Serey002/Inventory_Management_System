import { Response } from "express";

export abstract class BaseController {
  protected sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
    res.status(statusCode).json({ success: true, data });
  }

  protected sendError(res: Response, message: string, statusCode = 400): void {
    res.status(statusCode).json({ success: false, message });
  }

  protected sendCreated<T>(res: Response, data: T): void {
    this.sendSuccess(res, data, 201);
  }

  protected resolveError(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback;
  }
}