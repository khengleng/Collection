import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const port = process.env.PORT || 3002;
  await app.listen(port);
  console.log(`Workflow Worker internal API is running on: http://localhost:${port}`);
  
  // Temporal worker bootstrap will go here or in a service
}
bootstrap();
