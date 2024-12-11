import { Entity, Memory, Relation } from '../../types/memory';
import { EntityNotFoundError } from '../../utils/errors';
import { logger } from '../../utils/logger';

export class MemoryRepository {
  private memory: Memory = {
    entities: [],
    relations: []
  };

  async findEntityByName(name: string): Promise<Entity | undefined> {
    logger.debug(`Searching for entity with name: ${name}`);
    return this.memory.entities.find(entity => entity.name === name);
  }

  async createEntity(entity: Entity): Promise<Entity> {
    logger.info(`Creating new entity: ${entity.name}`);
    this.memory.entities.push(entity);
    return entity;
  }

  async createRelation(relation: Relation): Promise<Relation> {
    const fromEntity = await this.findEntityByName(relation.from);
    const toEntity = await this.findEntityByName(relation.to);

    if (!fromEntity) {
      throw new EntityNotFoundError(relation.from);
    }
    if (!toEntity) {
      throw new EntityNotFoundError(relation.to);
    }

    logger.info(`Creating new relation from ${relation.from} to ${relation.to}`);
    this.memory.relations.push(relation);
    return relation;
  }

  async addObservation(entityName: string, observation: string): Promise<Entity> {
    const entity = await this.findEntityByName(entityName);
    if (!entity) {
      throw new EntityNotFoundError(entityName);
    }

    logger.info(`Adding observation to entity: ${entityName}`);
    entity.observations.push(observation);
    return entity;
  }

  async getFullMemory(): Promise<Memory> {
    return this.memory;
  }
}