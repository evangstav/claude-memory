# Contributing to Claude Memory

We love your input! We want to make contributing to Claude Memory as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Pull Requests Process

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue your pull request.

### Setting Up Development Environment

1. Install dependencies:
```bash
npm install
```

2. Setup git hooks:
```bash
npm run prepare
```

3. Start development server:
```bash
npm run dev
```

### Code Style Guidelines

#### TypeScript

- Use TypeScript's strict mode
- Prefer interfaces over type aliases where possible
- Use explicit typing rather than relying on type inference
- Follow the existing code style in the codebase

```typescript
// Good
interface User {
  id: string;
  name: string;
  email: string;
}

// Avoid
type User = {
  id: string,
  name: string,
  email: string
}
```

#### File Organization

- Keep files focused and single-purpose
- Use descriptive names that reflect the file's contents
- Group related functionality in directories
- Maintain a clean separation of concerns

#### Testing

- Write unit tests for all new functionality
- Use descriptive test names that explain the test's purpose
- Follow the Arrange-Act-Assert pattern
- Mock external dependencies appropriately

```typescript
describe('EntityManager', () => {
  it('should create a new entity with the provided properties', () => {
    // Arrange
    const properties = { name: 'Test Entity', type: 'person' };
    
    // Act
    const entity = entityManager.createEntity(properties);
    
    // Assert
    expect(entity).toHaveProperty('name', properties.name);
    expect(entity).toHaveProperty('type', properties.type);
  });
});
```

### Documentation Standards

- Document all public APIs
- Include examples in documentation
- Keep documentation up-to-date with code changes
- Use JSDoc for TypeScript documentation

```typescript
/**
 * Creates a new entity in the memory system.
 * 
 * @param {EntityProperties} properties - The properties of the entity to create
 * @returns {Entity} The created entity
 * @throws {ValidationError} If the properties are invalid
 * 
 * @example
 * const entity = createEntity({
 *   name: 'John Doe',
 *   type: 'person',
 *   observations: ['Works as a developer']
 * });
 */
```

### Commit Message Guidelines

Follow the conventional commits specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

### Issue and Bug Reports

When reporting issues, please use the following template:

```markdown
## Description
[A clear and concise description of the issue]

## Steps to Reproduce
1. [First Step]
2. [Second Step]
3. [and so on...]

## Expected Behavior
[What you expected to happen]

## Actual Behavior
[What actually happened]

## Additional Context
[Any additional information, screenshots, etc.]
```

### Feature Requests

Use this template for feature requests:

```markdown
## Feature Description
[A clear and concise description of the feature]

## Problem It Solves
[Explain what problem this feature would solve]

## Proposed Solution
[Describe your proposed solution]

## Alternatives Considered
[Describe any alternative solutions you've considered]

## Additional Context
[Any additional information or screenshots]
```

## License

By contributing, you agree that your contributions will be licensed under the same license as the original project.

## Questions?

Don't hesitate to ask questions about the contribution process or anything else related to the project.

[Add contact information or link to discussions]