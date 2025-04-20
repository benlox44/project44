import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class UserCleanupService implements OnModuleInit {
  private readonly logger = new Logger(UserCleanupService.name);

  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    const oneDayAgo = new Date(Date.now() - 86_400_000);
    const result =
      await this.usersService.deleteUnconfirmedOlderThan(oneDayAgo);
    this.logger.log(`🧹 [Init] Deleted unconfirmed users: ${result.affected}`);
  }
}
