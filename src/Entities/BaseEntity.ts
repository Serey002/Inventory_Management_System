import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

/**
 * Abstract base for all entities.
 * Provides auto-generated id, createdAt, and updatedAt fields.
 *
 * OOP: Abstraction & Inheritance — shared audit columns live here once.
 */
export abstract class BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @CreateDateColumn()
  readonly createdAt!: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;
}

export default BaseEntity;
