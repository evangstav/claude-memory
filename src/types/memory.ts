export interface Entity {
  type: 'entity';
  name: string;
  entityType: string;
  observations: string[];
}

export interface Relation {
  type: 'relation';
  from: string;
  to: string;
  relationType: string;
}

export interface Memory {
  entities: Entity[];
  relations: Relation[];
}
