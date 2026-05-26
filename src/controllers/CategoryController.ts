import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { Categories } from "../Entities/Categories";
import { CreateCategoryDTO, UpdateCategoryDTO } from "../types/authType";

export class CategoryController extends BaseController {
  constructor(private readonly categoryRepository: CategoryRepository) {
    super();
  }
    //   GET ALL


  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      this.sendSuccess(res, await this.categoryRepository.findAll());
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to get categories"), 500);
    }
  };
  //   GET BY ID


  getById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid category ID");
      return;
    }

    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        this.sendError(res, "Category not found", 404);
        return;
      }

      this.sendSuccess(res, category);
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to get category"), 500);
    }
  };
//   CREATE

  create = async (req: Request, res: Response): Promise<void> => {
    const { name, description } = req.body as CreateCategoryDTO;
    if (!name) {
      this.sendError(res, "name is required");
      return;
    }

    try {
      const category = Object.assign(new Categories(), {
        name,
        description,
      });

      this.sendCreated(res, await this.categoryRepository.save(category));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to create category"), 500);
    }
  };

//   UPDATE

  update = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid category ID");
      return;
    }

    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        this.sendError(res, "Category not found", 404);
        return;
      }

      const { name, description } = req.body as UpdateCategoryDTO;
      Object.assign(category, {
        ...(name !== undefined ? { name } : {}),
        ...(description !== undefined ? { description } : {}),
      });

      this.sendSuccess(res, await this.categoryRepository.save(category));
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to update category"), 500);
    }
  };
//   DELETE

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id as string);
    if (isNaN(id)) {
      this.sendError(res, "Invalid category ID");
      return;
    }

    try {
      const category = await this.categoryRepository.findById(id);
      if (!category) {
        this.sendError(res, "Category not found", 404);
        return;
      }

      await this.categoryRepository.delete(id);
      this.sendSuccess(res, { message: "Category deleted successfully" });
    } catch (error) {
      this.sendError(res, this.resolveError(error, "Failed to delete category"), 500);
    }
  };
}

export default CategoryController;
