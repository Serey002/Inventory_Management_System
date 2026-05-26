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
      this.sendResolvedError(res, error, fallbackMessage, fallbackStatusCode);
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

  protected resolveStatusCode(
    error: unknown,
    fallbackStatusCode: number,
  ): number {
    return error instanceof AppError ? error.statusCode : fallbackStatusCode;
  }

  protected sendResolvedError(
    res: Response,
    error: unknown,
    fallbackMessage: string,
    fallbackStatusCode: number,
  ): void {
    this.sendError(
      res,
      this.resolveError(error, fallbackMessage),
      this.resolveStatusCode(error, fallbackStatusCode),
    );
  }
}
