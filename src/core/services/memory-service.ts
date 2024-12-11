import { Entity, Memory, Relation } from '../../types/memory';
import { MemoryRepository } from '../repositories/memory-repository';
import { logger } from '../../utils/logger';
import { ValidationError } from '../../utils/errors';

export class MemoryService {
  constructor(private repository: MemoryRepository) {}

  async createEntity(name: string, entityType: string): Promise<Entity> {
    if (!name || !entityType) {
      throw new ValidationError('Entity name and type are required');
    }

    const existingEntity = await this.repository.findEntityByName(name);
    if (existingEntity) {
      throw new ValidationError(`Entity with name ${name} already exists`);
    }

    logger.info(`Creating entity: ${name} of type ${entityType}`);
    return await this.repository.createEntity({
      type: 'entity',
      name,
      entityType,
      observations: []
    });
  }

  async createRelation(from: string, to: string, relationType: string): Promise<Relation> {
    if (!from || !to || !relationType) {
      throw new ValidationError('Relation from, to, and type are required');
    }

    logger.info(`Creating relation: ${from} -> ${to} (${relationType})`);
    return await this.repository.createRelation({
      type: 'relation',
      from,
      to,
      relationType
    });
  }

  async addObservation(entityName: string, observation: string): Promise<Entity> {
    if (!entityName || !observation) {
      throw new ValidationError('Entity name and observation are required');
    }

    logger.info(`Adding observation to ${entityName}: ${observation}`);
    return await this.repository.addObservation(entityName, observation);
  }

  async getMemory(): Promise<Memory> {
    return await this.repository.getFullMemory();
  }
}