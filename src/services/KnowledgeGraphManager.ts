import { FileSystemManager } from "../utils/fileSystem";

// Helper function to safely get error message
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export class KnowledgeGraphManager {
  private filePath: string;
  private cache: KnowledgeGraph | null = null;
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes
  private lastCacheUpdate: number = 0;

  constructor(filePath: string) {
    this.filePath = filePath;
  }
  // Type guards
  private isEntity(item: any): item is Entity {
    return item.type === "entity"
      && typeof item.name === "string"
      && typeof item.entityType === "string"
      && Array.isArray(item.observations);
  }

  private isRelation(item: any): item is Relation {
    return item.type === "relation"
      && typeof item.from === "string"
      && typeof item.to === "string"
      && typeof item.relationType === "string";
  }

  private async loadGraph(): Promise<KnowledgeGraph> {
    // Check cache first
    if (this.cache && Date.now() - this.lastCacheUpdate < this.cacheExpiry) {
      return this.cache;
    }

    try {
      const data = await FileSystemManager.readFile(this.filePath);
      if (!data) {
        return { entities: [], relations: [] };
      }

      const lines = data.split("\n").filter(line => line.trim() !== "");
      const graph = lines.reduce((graph: KnowledgeGraph, line) => {
        try {
          const item = JSON.parse(line);
          if (this.isEntity(item)) graph.entities.push(item);
          if (this.isRelation(item)) graph.relations.push(item);
          return graph;
        } catch (error) {
          console.error(`Failed to parse line: ${line}`, getErrorMessage(error));
          return graph;
        }
      }, { entities: [], relations: [] });

      // Update cache
      this.cache = graph;
      this.lastCacheUpdate = Date.now();

      return graph;
    } catch (error) {
      throw new GraphError(`Failed to load graph: ${getErrorMessage(error)}`);
    }
  }


  private async saveGraph(graph: KnowledgeGraph): Promise<void> {
    try {
      const lines = [
        ...graph.entities.map(e => JSON.stringify({ type: "entity", ...e })),
        ...graph.relations.map(r => JSON.stringify({ type: "relation", ...r })),
      ];
      await FileSystemManager.writeFile(this.filePath, lines.join("\n"));

      // Update cache
      this.cache = graph;
      this.lastCacheUpdate = Date.now();
    } catch (error) {
      throw new GraphError(`Failed to save graph: ${getErrorMessage(error)}`);
    }
  }
  // Validation methods
  private validateEntity(entity: Entity): void {
    if (!entity.name || !entity.entityType) {
      throw new GraphError('Entity must have name and type');
    }
    if (!Array.isArray(entity.observations)) {
      throw new GraphError('Entity observations must be an array');
    }
  }

  private validateRelation(relation: Relation, graph: KnowledgeGraph): void {
    if (!graph.entities.some(e => e.name === relation.from)) {
      throw new EntityNotFoundError(relation.from);
    }
    if (!graph.entities.some(e => e.name === relation.to)) {
      throw new EntityNotFoundError(relation.to);
    }
  }

  async createEntities(entities: Entity[]): Promise<Entity[]> {
    // Validate all entities first
    entities.forEach(this.validateEntity);

    const graph = await this.loadGraph();
    const newEntities = this.filterNewEntities(entities, graph.entities);
    graph.entities.push(...newEntities);
    await this.saveGraph(graph);
    return newEntities;
  }

  async createRelations(relations: Relation[]): Promise<Relation[]> {
    const graph = await this.loadGraph();

    // Validate all relations first
    relations.forEach(relation => this.validateRelation(relation, graph));

    const newRelations = this.filterNewRelations(relations, graph.relations);
    graph.relations.push(...newRelations);
    await this.saveGraph(graph);
    return newRelations;
  }

  // Batch operations
  async batchOperation<T>(
    items: T[],
    operation: (item: T) => Promise<void>
  ): Promise<void> {
    const batchSize = 100;
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      await Promise.all(batch.map(operation));
    }
  }

  private filterNewEntities(newEntities: Entity[], existingEntities: Entity[]): Entity[] {
    return newEntities.filter(e =>
      !existingEntities.some(existing => existing.name === e.name)
    );
  }

  private filterNewRelations(newRelations: Relation[], existingRelations: Relation[]): Relation[] {
    return newRelations.filter(r =>
      !existingRelations.some(existing =>
        existing.from === r.from &&
        existing.to === r.to &&
        existing.relationType === r.relationType
      )
    );
  }

  async addObservations(updates: ObservationUpdate[]): Promise<ObservationResult[]> {
    const graph = await this.loadGraph();

    try {
      const results = await Promise.all(updates.map(async (update) => {
        const entity = this.findEntityOrThrow(update.entityName, graph);

        // Validate observations
        if (!Array.isArray(update.contents)) {
          throw new GraphError(`Invalid observations format for entity ${update.entityName}`);
        }

        const newObservations = this.filterNewObservations(update.contents, entity.observations);
        entity.observations.push(...newObservations);

        return {
          entityName: update.entityName,
          addedObservations: newObservations
        };
      }));

      await this.saveGraph(graph);
      return results;
    } catch (error) {
      throw new GraphError(`Failed to add observations: ${getErrorMessage(error)}`);
    }
  }

  private findEntityOrThrow(entityName: string, graph: KnowledgeGraph): Entity {
    const entity = graph.entities.find(e => e.name === entityName);
    if (!entity) {
      throw new EntityNotFoundError(entityName);
    }
    return entity;
  }

  private filterNewObservations(newObs: string[], existingObs: string[]): string[] {
    // Remove duplicates and empty strings
    return newObs
      .filter(obs => obs.trim() !== '')
      .filter(obs => !existingObs.includes(obs));
  }

  async deleteEntities(entityNames: string[]): Promise<void> {
    if (!Array.isArray(entityNames)) {
      throw new GraphError('Entity names must be provided as an array');
    }

    try {
      const graph = await this.loadGraph();

      // Verify all entities exist before deleting
      entityNames.forEach(name => {
        if (!graph.entities.some(e => e.name === name)) {
          throw new EntityNotFoundError(name);
        }
      });

      graph.entities = this.removeDeletedEntities(entityNames, graph.entities);
      graph.relations = this.removeRelationsWithDeletedEntities(entityNames, graph.relations);
      await this.saveGraph(graph);
    } catch (error) {
      throw new GraphError(`Failed to delete entities: ${getErrorMessage(error)}`);
    }
  }

  private removeDeletedEntities(entityNames: string[], entities: Entity[]): Entity[] {
    return entities.filter(e => !entityNames.includes(e.name));
  }

  private removeRelationsWithDeletedEntities(entityNames: string[], relations: Relation[]): Relation[] {
    return relations.filter(r =>
      !entityNames.includes(r.from) && !entityNames.includes(r.to)
    );
  }

  async deleteObservations(deletions: ObservationDeletion[]): Promise<void> {
    if (!Array.isArray(deletions)) {
      throw new GraphError('Deletions must be provided as an array');
    }

    try {
      const graph = await this.loadGraph();

      await Promise.all(deletions.map(async (deletion) => {
        const entity = this.findEntityOrThrow(deletion.entityName, graph);

        // Validate observations to delete
        if (!Array.isArray(deletion.observations)) {
          throw new GraphError(`Invalid observations format for entity ${deletion.entityName}`);
        }

        entity.observations = entity.observations.filter(obs =>
          !deletion.observations.includes(obs)
        );
      }));

      await this.saveGraph(graph);
    } catch (error) {
      throw new GraphError(`Failed to delete observations: ${getErrorMessage(error)}`);
    }
  }

  async deleteRelations(relations: Relation[]): Promise<void> {
    if (!Array.isArray(relations)) {
      throw new GraphError('Relations must be provided as an array');
    }

    try {
      const graph = await this.loadGraph();

      // Validate relations before deletion
      relations.forEach(relation => {
        if (!relation.from || !relation.to || !relation.relationType) {
          throw new GraphError('Invalid relation format');
        }
      });

      graph.relations = this.filterRemainingRelations(relations, graph.relations);
      await this.saveGraph(graph);
    } catch (error) {
      throw new GraphError(`Failed to delete relations: ${getErrorMessage(error)}`);
    }
  }

  private filterRemainingRelations(deletedRelations: Relation[], existingRelations: Relation[]): Relation[] {
    return existingRelations.filter(existing =>
      !deletedRelations.some(deleted =>
        existing.from === deleted.from &&
        existing.to === deleted.to &&
        existing.relationType === deleted.relationType
      )
    );
  }

  async readGraph(): Promise<KnowledgeGraph> {
    try {
      return await this.loadGraph();
    } catch (error) {
      throw new GraphError(`Failed to read graph: ${getErrorMessage(error)}`);
    }
  }

  async searchNodes(query: string): Promise<KnowledgeGraph> {
    if (typeof query !== 'string') {
      throw new GraphError('Search query must be a string');
    }

    try {
      const graph = await this.loadGraph();
      const filteredEntities = this.searchEntities(query.toLowerCase(), graph.entities);
      const filteredEntityNames = new Set(filteredEntities.map(e => e.name));

      return {
        entities: filteredEntities,
        relations: this.filterRelationsByEntities(filteredEntityNames, graph.relations)
      };
    } catch (error) {
      throw new GraphError(`Failed to search nodes: ${getErrorMessage(error)}`);
    }
  }

  private searchEntities(query: string, entities: Entity[]): Entity[] {
    return entities.filter(e =>
      e.name.toLowerCase().includes(query) ||
      e.entityType.toLowerCase().includes(query) ||
      e.observations.some(o => o.toLowerCase().includes(query))
    );
  }

  async openNodes(names: string[]): Promise<KnowledgeGraph> {
    if (!Array.isArray(names)) {
      throw new GraphError('Node names must be provided as an array');
    }

    try {
      const graph = await this.loadGraph();
      const filteredEntities = graph.entities.filter(e => names.includes(e.name));

      // Verify all requested nodes were found
      names.forEach(name => {
        if (!filteredEntities.some(e => e.name === name)) {
          throw new EntityNotFoundError(name);
        }
      });

      const filteredEntityNames = new Set(filteredEntities.map(e => e.name));

      return {
        entities: filteredEntities,
        relations: this.filterRelationsByEntities(filteredEntityNames, graph.relations)
      };
    } catch (error) {
      throw new GraphError(`Failed to open nodes: ${getErrorMessage(error)}`);
    }
  }

  private filterRelationsByEntities(entityNames: Set<string>, relations: Relation[]): Relation[] {
    return relations.filter(r =>
      entityNames.has(r.from) && entityNames.has(r.to)
    );
  }

  // Utility method for batch operations
  async processBatch<T, R>(
    items: T[],
    batchSize: number,
    processor: (batch: T[]) => Promise<R[]>
  ): Promise<R[]> {
    const results: R[] = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await processor(batch);
      results.push(...batchResults);
    }

    return results;
  }
}
