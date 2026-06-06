import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Catch, ArgumentsHost, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import { AppModule } from './app.module.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    this.logger.error(`Exception on ${request.method} ${request.url}`);
    this.logger.error(exception instanceof Error ? exception.stack : exception);
    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException
      ? exception.getResponse()
      : { statusCode: 500, message: exception instanceof Error ? exception.message : 'Internal server error' };
    response.status(status).json(message);
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug', 'verbose'] });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
