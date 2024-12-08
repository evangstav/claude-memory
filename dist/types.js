"use strict";
// Custom error types
class GraphError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GraphError';
    }
}
class EntityNotFoundError extends GraphError {
    constructor(entityName) {
        super(`Entity not found: ${entityName}`);
        this.name = 'EntityNotFoundError';
    }
}
