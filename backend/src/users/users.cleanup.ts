import { Injectable, OnModuleInit } from '@nestjs/common';
// import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './users.service';

@Injectable()
export class UserCleanupService implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit() {
    const oneDayAgo = new Date(Date.now() - 86_400_000);
    const result = await this.usersService.deleteUnconfirmedOlderThan(oneDayAgo);
    console.log(`🧹 [Init] Deleted unconfirmed users: ${result.affected}`);
  }

//   @Cron(CronExpression.EVERY_DAY_AT_2AM)
//   async handleCleanup() {
//     const oneDayAgo = new Date(Date.now() - 86_400_000);
//     const result = await this.usersService.deleteUnconfirmedOlderThan(oneDayAgo);
//     console.log(`🧹 [Cron] Deleted unconfirmed users: ${result.affected}`);
//   }
}
