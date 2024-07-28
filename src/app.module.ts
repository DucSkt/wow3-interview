import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemModule } from '~/item/item.module';
import { CollectionModule } from '~/collection/collection.module';
import { ErrorHandlerMiddleware } from '~/middleware/error-handler.middleware';

@Module({
  imports: [CollectionModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorHandlerMiddleware).forRoutes('*');
  }
}
