import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import { UsersService } from '../users.service';

@Injectable()
export class UserCleanupService implements OnModuleInit {
  private readonly logger = new Logger(UserCleanupService.name);

  public constructor(private readonly usersService: UsersService) {}

  public async onModuleInit(): Promise<void> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const result =
      await this.usersService.deleteUnconfirmedOlderThan(oneWeekAgo);
    this.logger.log(`🧹 [Init] Deleted unconfirmed users: ${result.affected}`);
  }
}
