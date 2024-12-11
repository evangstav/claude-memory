import { config } from './config/environment';
import { MemoryRepository } from './core/repositories/memory-repository';
import { MemoryService } from './core/services/memory-service';
import { logger } from './utils/logger';

async function main(): Promise<void> {
  try {
    logger.info('Initializing Claude Memory Service');
    
    const repository = new MemoryRepository();
    const memoryService = new MemoryService(repository);
    
    // Initialize your service here
    logger.info(`Service started on port ${config.PORT}`);
  } catch (error) {
    logger.error('Failed to start service', error);
    process.exit(1);
  }
}

main();