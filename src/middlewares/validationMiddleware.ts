import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

// Validation schemas
export interface ValidationRules {
  [field: string]: {
    required?: boolean;
    type?: string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: unknown) => boolean | string;
  };
}

export const validateRequest = (rules: ValidationRules) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, string> = {};

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      // Check required
      if (rule.required && (value === undefined || value === null || value === "")) {
        errors[field] = `${field} is required`;
        continue;
      }

      if (value === undefined || value === null || value === "") {
        continue; // Skip validation for optional fields
      }

      // Check type
      if (rule.type && typeof value !== rule.type) {
        errors[field] = `${field} must be a ${rule.type}`;
        continue;
      }

      // Check minLength
      if (rule.minLength && typeof value === "string" && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        continue;
      }

      // Check maxLength
      if (rule.maxLength && typeof value === "string" && value.length > rule.maxLength) {
        errors[field] = `${field} must not exceed ${rule.maxLength} characters`;
        continue;
      }

      // Check pattern
      if (rule.pattern && !rule.pattern.test(String(value))) {
        errors[field] = `${field} format is invalid`;
        continue;
      }

      // Check custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          errors[field] = typeof customResult === "string" ? customResult : `${field} validation failed`;
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      res.status(400).json({ success: false, errors });
      return;
    }

    next();
  };
};

// Email validation pattern
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation - at least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
export const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validatePassword = (password: string): boolean => {
  return passwordPattern.test(password);
};

export const validateEmail = (email: string): boolean => {
  return emailPattern.test(email);
};
