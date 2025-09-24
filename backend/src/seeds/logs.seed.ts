// src/seeds/log.seeder.ts
import { Log } from 'src/logs-feature/log.entity';
import { AppDataSource } from '../data-source'; // Điều chỉnh đường dẫn tới data-source của bạn
import { DeepPartial } from 'typeorm';

/**
 * Cấu trúc dữ liệu địa lý chính xác hơn:
 * Mỗi quốc gia (country) chứa một object các tiểu bang/tỉnh (state).
 * Mỗi state chứa một mảng các thành phố (city) và một tiền tố zip (zipPrefix).
 * Điều này đảm bảo khi chọn state, bạn chỉ có thể chọn city tương ứng trong state đó.
 */
const locationData: Record<
  string,
  Record<string, { cities: string[]; zipPrefix: string }>
> = {
  US: {
    California: {
      cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
      zipPrefix: '9',
    },
    'New York': {
      cities: ['New York City', 'Buffalo', 'Rochester', 'Albany'],
      zipPrefix: '1',
    },
    Texas: {
      cities: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
      zipPrefix: '7',
    },
    Florida: {
      cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville'],
      zipPrefix: '3',
    },
  },
  VN: {
    Hanoi: {
      cities: ['Hoan Kiem', 'Ba Dinh', 'Cau Giay', 'Dong Da'],
      zipPrefix: '10',
    },
    'Ho Chi Minh City': {
      cities: ['District 1', 'District 3', 'District 7', 'Thu Duc City'],
      zipPrefix: '70',
    },
    'Da Nang': {
      cities: ['Hai Chau', 'Thanh Khe', 'Son Tra'],
      zipPrefix: '55',
    },
  },
  CA: {
    Ontario: {
      cities: ['Toronto', 'Ottawa', 'Mississauga'],
      zipPrefix: 'M',
    },
    Quebec: {
      cities: ['Montreal', 'Quebec City', 'Gatineau'],
      zipPrefix: 'H',
    },
  },
  DE: {
    Berlin: {
      cities: ['Berlin'],
      zipPrefix: '1',
    },
    Bavaria: {
      cities: ['Munich', 'Nuremberg'],
      zipPrefix: '8',
    },
  },
};

const ispMap: Record<string, string[]> = {
  US: ['Comcast Xfinity', 'AT&T Internet', 'Verizon Fios', 'Spectrum'],
  VN: ['VNPT', 'Viettel', 'FPT Telecom', 'CMC Telecom'],
  CA: ['Bell', 'Rogers', 'Telus', 'Shaw'],
  DE: ['Deutsche Telekom', 'Vodafone', '1&1', 'O2'],
};

// --- Helper Functions ---

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateEmails(count: number): string[] {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'protonmail.com'];
  const names = [
    'john.doe',
    'jane.smith',
    'test.user',
    'user.dev',
    'anonymous',
  ];
  return Array.from({ length: count }, () => {
    return `${randomFrom(names)}${Math.floor(Math.random() * 100)}@${randomFrom(domains)}`;
  });
}

function generateLinks(count: number): string[] {
  const sites = [
    'facebook.com',
    'google.com',
    'github.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'twitter.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
    'amazon.com',
  ];
  return Array.from(
    { length: count },
    () => `https://${randomFrom(sites)}/login?user=test`,
  );
}

function generateStruct(): string {
  const prefixes = ['archive', 'backup', 'data', 'credentials'];
  const extensions = ['zip', 'rar', '7z'];
  return `${randomFrom(prefixes)}_${Date.now() % 1000}.${randomFrom(extensions)}`;
}

// --- Main Seeder Function ---

export async function runLogSeeder() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Log);

  const count = await repo.count();
  if (count > 0) {
    console.log('⚠️ Bảng "logs" đã có dữ liệu, bỏ qua seeding...');
    await AppDataSource.destroy();
    return;
  }

  const stealers = ['RedLine', 'Vidar', 'Raccoon', 'LokiBot', 'AZORult'];
  const systems = [
    'Windows 10 Pro',
    'Windows 11 Home',
    'macOS Sonoma',
    'Ubuntu 22.04',
  ];
  const vendors = [
    'Intel Corporation',
    'Advanced Micro Devices, Inc.',
    'NVIDIA Corporation',
  ];
  const countries = Object.keys(locationData);

  const logsData: DeepPartial<Log>[] = [];

  for (let i = 0; i < 50; i++) {
    // 1. Chọn quốc gia
    const country = randomFrom(countries);

    // 2. Chọn state từ quốc gia đã chọn
    const statesInCountry = Object.keys(locationData[country]);
    const state = randomFrom(statesInCountry);

    // 3. Chọn city và zip từ state đã chọn
    const stateData = locationData[country][state];
    const city = randomFrom(stateData.cities);
    const zip = `${stateData.zipPrefix}${Math.floor(1000 + Math.random() * 9000)}`;
    const isp = randomFrom(ispMap[country] || ['Unknown ISP']);

    const log: DeepPartial<Log> = {
      stealer: randomFrom(stealers),
      system_name: randomFrom(systems),
      country: country,
      links: generateLinks(Math.floor(Math.random() * 3) + 1), // 1-3 links
      hasOutlook: Math.random() > 0.4,
      state: state,
      city: city,
      zip: zip,
      isp: isp,
      emails:
        Math.random() > 0.2
          ? generateEmails(Math.floor(Math.random() * 4) + 1)
          : [], // 80% có email
      vendor: randomFrom(vendors),
      struct: generateStruct(),
      size: Math.floor(50 + Math.random() * 5000), // 50KB to 5MB
      price: parseFloat((Math.random() * 45 + 5).toFixed(2)), // $5.00 to $50.00
    };

    logsData.push(log);
  }

  // Tạo và lưu tất cả entities trong một lần để tối ưu hiệu suất
  const entities = repo.create(logsData);
  await repo.save(entities);

  console.log(`✅ Đã seed thành công ${logsData.length} logs!`);
  await AppDataSource.destroy();
}

// Cho phép chạy file này trực tiếp bằng `ts-node src/seeds/log.seeder.ts`
if (require.main === module) {
  runLogSeeder().catch((e) => {
    console.error('Lỗi khi chạy seeder cho Log:', e);
    process.exit(1);
  });
}
