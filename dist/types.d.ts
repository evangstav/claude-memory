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
declare class GraphError extends Error {
    constructor(message: string);
}
declare class EntityNotFoundError extends GraphError {
    constructor(entityName: string);
}
