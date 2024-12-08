interface Entity {
  name: string;
  entityType: string;
  observations: string[];
}

interface Relation {
  from: string;
  to: string;
  relationType: string;
}

interface KnowledgeGraph {
  entities: Entity[];
  relations: Relation[];
}

interface ObservationUpdate {
  entityName: string;
  contents: string[];
}

interface ObservationDeletion {
  entityName: string;
  observations: string[];
}

interface ObservationResult {
  entityName: string;
  addedObservations: string[];
}


// Custom error types
class GraphError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GraphError';
  }
}

class EntityNotFoundError extends GraphError {
  constructor(entityName: string) {
    super(`Entity not found: ${entityName}`);
    this.name = 'EntityNotFoundError';
  }
}
