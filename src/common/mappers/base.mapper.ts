import { Type } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

/**
 * A type definition that represents either a single entity of type `T` or an array of entities of type `T`.
 *
 * This type is useful when a parameter, return value, or variable can be a single instance of a type or multiple instances
 * of the same type grouped in an array.
 *
 * @template T The type of the entity or entities.
 */
export type EntityOrEntities<T> = T | T[];

/**
 * BaseMapper is an abstract class that provides functionality for mapping
 * entities or arrays of entities to Data Transfer Objects (DTOs).
 * It uses transformation options to exclude extraneous values during
 * the mapping process.
 *
 * @template Entity - The type of entity being mapped.
 */
export abstract class BaseMapper<Entity> {
  protected readonly transformOptions = {
    excludeExtraneousValues: true,
    exposeDefaultValues: true,
  };

  protected map<T>(
    entityOrEntities: EntityOrEntities<Entity>,
    dtoClass: ClassConstructor<T>,
  ): T | T[] {
    if (Array.isArray(entityOrEntities)) {
      return entityOrEntities.map((entity) =>
        plainToInstance(dtoClass, entity, this.transformOptions),
      );
    }

    return plainToInstance(dtoClass, entityOrEntities, this.transformOptions);
  }

  /**
   * Generic method to convert entity to any specified DTO type
   *
   * @param entity
   * @param dtoClass - The DTO class to map to
   * @returns The mapped DTO or array of DTOs
   */
  toDto<T>(entity: Entity, dtoClass: Type<T>): T;
  /**
   * Generic method to convert collection of entities to any specified DTO type
   *
   * @param entities
   * @param dtoClass - The DTO class to map to
   * @returns The mapped DTO or array of DTOs
   */
  toDto<T>(entities: Entity[], dtoClass: Type<T>): T[];
  /**
   * Generic method to convert entity or a collection of entities to any specified DTO type
   *
   * @param entityOrEntities
   * @param dtoClass - The DTO class to map to
   * @returns The mapped DTO or array of DTOs
   */
  toDto<T>(
    entityOrEntities: EntityOrEntities<Entity>,
    dtoClass: Type<T>,
  ): T | T[] {
    return this.map(entityOrEntities, dtoClass);
  }
}
