import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { required } from './env.utils';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: required('JWT_SECRET'),
      signOptions: { expiresIn: '1d' },
    }),
  ],
  exports: [JwtModule],
})
export class GlobalJwtModule {}
