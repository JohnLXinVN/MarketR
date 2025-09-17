// src/seeds/run-seed.ts
// import { runSeeder as runUserSeeder } from "./user.seeder"; // nếu có thêm

import { runSeeder } from './cvv.seed';

async function bootstrap() {
  try {
    console.log('🚀 Starting seeding...');

    await runSeeder();
    // await runUserSeeder();

    console.log('✅ All seeders finished successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

bootstrap();
