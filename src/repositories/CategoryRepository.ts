import { AppDataSource } from "../config/database";
import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryService } from "../services/CategoryService";  

export class CategoryController {
    private repository=AppDataSource.getRepository(CategoryRepository);
    //CREATE
    async CreateCategory(name:string){
        const CategoryRepository =this.repository.create({name});
        await this.repository.save(CategoryRepository);
        return CategoryRepository;
    }
    //Get All
    async getAllCategory(){
        return this.repository.find();
    }   

  
  
}