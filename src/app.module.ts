import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { UsersModule } from './users/users.module';
import { SymbolsModule } from './symbols/symbols.module';

@Module({
  imports: [AuthModule, UsersModule, CommonModule, SymbolsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
