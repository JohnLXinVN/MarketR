import { DataSource } from 'typeorm';
import { AppDataSource } from 'src/data-source';
import { Log } from 'src/logs-feature/log.entity';
import { linksPool, localizedSeedData } from './bin-list.data';

export class LogSeeder {
  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  public async run(dataSource: DataSource): Promise<void> {
    const { faker } = await import('@faker-js/faker');
    const logRepository = dataSource.getRepository(Log);

    const logsToCreate: Partial<Log>[] = [];

    // 🖥️ Danh sách các hệ thống cố định
    const systemNames = [
      'Windows 10 Pro',
      'Windows 11 Home',
      'Ubuntu 22.04 LTS',
      'Debian 12',
      'Fedora 39',
      'Arch Linux',
      'Kali Linux',
      'macOS Ventura',
      'macOS Sonoma',
      'FreeBSD 13',
      'CentOS 9',
      'Red Hat Enterprise Linux 9',
      'OpenSUSE Leap 15.5',
    ];

    const stealerVendors = [
      'Predator',
      'Lumma',
      'Raccoon',
      'RedLine',
      'Vidar',
      'Meta',
      'Aurora',
      'Osiris',
      'Storm',
      'Rise',
      'Remcos',
      'Warzone',
      'Mekotio',
      'NjRAT',
      'AsyncRAT',
      'Quasar',
      'Xworm',
      'NanoCore',
      'AgentTesla',
      'Snake',
      'Arkei',
      'Baldr',
      'ClipBanker',
      'EvilGrab',
      'FormBook',
      'Pony',
      'SmokeLoader',
      'Hawkeye',
      'NetWire',
      'Glupteba',
    ];

    const totalLogs = 4000;
    console.log(`📦 Generating ${totalLogs} logs...`);

    for (let i = 0; i < totalLogs; i++) {
      // 🌍 Chọn quốc gia & localized data
      const countries = Object.keys(localizedSeedData);
      const randomCountry = faker.helpers.arrayElement(countries);
      const localized =
        localizedSeedData[randomCountry] || localizedSeedData['US'];

      // 🧑 Người dùng + địa chỉ
      const state = this.randomItem<string>(localized.states as string[]);
      const city = this.randomItem<string>(localized.cities as string[]);
      const zip = this.randomItem<string>(localized.zips as string[]);

      // 🔗 Random links
      const shuffledLinks = faker.helpers.shuffle(linksPool);
      const linkCount = faker.number.int({
        min: Math.floor(linksPool.length * 0.66),
        max: linksPool.length,
      });
      const links = shuffledLinks.slice(0, linkCount);

      // 📧 Email
      const firstName = faker.person.firstName().toLowerCase();
      const lastName = faker.person.lastName().toLowerCase();
      const birthYear = faker.number.int({ min: 1960, max: 2005 });
      const providers = [
        'gmail.com',
        'outlook.com',
        'yahoo.com',
        'icloud.com',
        'hotmail.com',
      ];
      const email = `${firstName}.${lastName}${birthYear}@${faker.helpers.arrayElement(providers)}`;

      // 📁 Struct, size, price
      const struct = 'archive.zip';
      const size = faker.number.int({ min: 5000, max: 25000 });
      const price = parseFloat(
        faker.number.float({ min: 25, max: 250, fractionDigits: 2 }).toFixed(2),
      );

      // 📅 createdAt
      const createdAt = faker.date.between({
        from: faker.date.past({ years: 2 }),
        to: new Date(),
      });

      const isp = faker.company.name();

      const log: Partial<Log> = {
        stealer: faker.helpers.arrayElement(stealerVendors),
        vendor: faker.helpers.arrayElement(stealerVendors),
        system_name: faker.helpers.arrayElement(systemNames),
        country: randomCountry,
        state,
        city,
        zip,
        isp,
        hasOutlook: Math.random() < 0.5,
        links,
        emails: [email],
        struct,
        size,
        price,
        createdAt,
        isAvailable: true,
      };

      logsToCreate.push(log);
    }

    console.log('⏫ Inserting logs into DB...');
    for (let i = 0; i < logsToCreate.length; i += 500) {
      await logRepository.insert(logsToCreate.slice(i, i + 500));
      console.log(
        `  • Inserted ${i + 500 > logsToCreate.length ? logsToCreate.length : i + 500}/${logsToCreate.length}`,
      );
    }

    console.log('🎉 Log seeding completed successfully.');
  }
}

// 🏁 Tự động chạy Seeder nếu gọi trực tiếp
