export declare const toolDefinitions: ({
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entities: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        name: {
                            type: string;
                            description: string;
                        };
                        entityType: {
                            type: string;
                            description: string;
                        };
                        observations: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            relations?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            relations: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        from: {
                            type: string;
                            description: string;
                        };
                        to: {
                            type: string;
                            description: string;
                        };
                        relationType: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
                description?: undefined;
            };
            entities?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            observations: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        entityName: {
                            type: string;
                            description: string;
                        };
                        contents: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            entities?: undefined;
            relations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entityNames: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            entities?: undefined;
            relations?: undefined;
            observations?: undefined;
            deletions?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            deletions: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        entityName: {
                            type: string;
                            description: string;
                        };
                        observations: {
                            type: string;
                            items: {
                                type: string;
                            };
                            description: string;
                        };
                    };
                    required: string[];
                };
            };
            entities?: undefined;
            relations?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            relations: {
                type: string;
                items: {
                    type: string;
                    properties: {
                        from: {
                            type: string;
                            description: string;
                        };
                        to: {
                            type: string;
                            description: string;
                        };
                        relationType: {
                            type: string;
                            description: string;
                        };
                    };
                    required: string[];
                };
                description: string;
            };
            entities?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            entities?: undefined;
            relations?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            query?: undefined;
            names?: undefined;
        };
        required?: undefined;
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            query: {
                type: string;
                description: string;
            };
            entities?: undefined;
            relations?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            names?: undefined;
        };
        required: string[];
    };
} | {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            names: {
                type: string;
                items: {
                    type: string;
                };
                description: string;
            };
            entities?: undefined;
            relations?: undefined;
            observations?: undefined;
            entityNames?: undefined;
            deletions?: undefined;
            query?: undefined;
        };
        required: string[];
    };
})[];
