// src/seeders/run-seeder.ts
import { DataSource } from 'typeorm';
import { AppDataSource } from 'src/data-source';
import { CvvSeeder } from './cvv.seed';
import { LogSeeder } from './logs.seed';

async function main() {
  try {
    console.log('🔌 Initializing data sources...');

    // Tạo 2 instance khác nhau từ config gốc
    const ds1 = new DataSource(AppDataSource.options);
    const ds2 = new DataSource(AppDataSource.options);

    await ds1.initialize();
    await ds2.initialize();
    console.log('✅ Both data sources have been initialized!');

    const cvvSeeder = new CvvSeeder();
    const logSeeder = new LogSeeder();

    await Promise.all([cvvSeeder.run(ds1), logSeeder.run(ds2)]);

    console.log('🏁 Seeding finished successfully.');

    await Promise.all([ds1.destroy(), ds2.destroy()]);
    console.log('👋 Data source connections closed.');
  } catch (error) {
    console.error('❌ An error occurred during the seeding process:', error);
  }
}

main();
