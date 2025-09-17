// src/seeds/cvv.seeder.ts
import { AppDataSource } from '../data-source'; // path tới file data-source của bạn
import { CVV } from 'src/cvv/cvv.entity';
import { DeepPartial } from 'typeorm';

const countryMap: Record<
  string,
  { states: string[]; cities: string[]; zipPrefix?: string }
> = {
  US: {
    states: ['California', 'New York', 'Texas', 'Florida', 'Illinois'],
    cities: ['Los Angeles', 'New York', 'Houston', 'Miami', 'Chicago'],
    zipPrefix: '9',
  },
  UK: {
    states: ['England', 'Scotland'],
    cities: ['London', 'Manchester', 'Edinburgh'],
    zipPrefix: 'E',
  },
  CA: {
    states: ['Ontario', 'Quebec'],
    cities: ['Toronto', 'Montreal'],
    zipPrefix: 'M',
  },
  JP: {
    states: ['Tokyo', 'Osaka'],
    cities: ['Tokyo', 'Osaka'],
    zipPrefix: '1',
  },
  IN: {
    states: ['Maharashtra', 'Delhi'],
    cities: ['Mumbai', 'New Delhi'],
    zipPrefix: '4',
  },
  SG: {
    states: ['Singapore'],
    cities: ['Singapore'],
  },
  AU: {
    states: ['NSW', 'VIC'],
    cities: ['Sydney', 'Melbourne'],
    zipPrefix: '2',
  },
  IE: {
    states: ['Dublin'],
    cities: ['Dublin'],
  },
  BR: {
    states: ['São Paulo'],
    cities: ['São Paulo'],
  },
  AR: {
    states: ['Buenos Aires'],
    cities: ['Buenos Aires'],
  },
};

function randomFrom<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function genBin16(prefix?: string) {
  const base = prefix ?? String(Math.floor(400000 + Math.random() * 500000));
  const first6 = base.padEnd(6, '0').slice(0, 6);
  const rest = Array.from({ length: 10 }, () =>
    Math.floor(Math.random() * 10),
  ).join('');
  return (first6 + rest).slice(0, 16);
}

function genExpiry() {
  const year =
    (new Date().getFullYear() % 100) + 1 + Math.floor(Math.random() * 5); // yy
  const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
  return `${month}/${String(year).padStart(2, '0')}`; // MM/YY
}

function makeDataSource(bin16: string, bankKey: string) {
  const first6 = bin16.slice(0, 6);
  const next8 = bin16.slice(6, 14);
  return `DB_BANK_${bankKey}_${first6}_${next8}`;
}

export async function runSeeder() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(CVV);

  const count = await repo.count();
  if (count > 0) {
    console.log('⚠️ CVV table already has data, skipping seeding...');
    await AppDataSource.destroy();
    return;
  }

  const banks = [
    { name: 'Bank of America', key: 'BOA' },
    { name: 'Chase', key: 'CHASE' },
    { name: 'Wells Fargo', key: 'WF' },
    { name: 'Citi', key: 'CITI' },
    { name: 'HSBC', key: 'HSBC' },
    { name: 'Santander', key: 'SANT' },
    { name: 'ANZ', key: 'ANZ' },
    { name: 'ICICI', key: 'ICICI' },
    { name: 'MUFG', key: 'MUFG' },
    { name: 'Barclays', key: 'BARC' },
  ];

  const cardTypes = [
    'VISA',
    'MASTERCARD',
    'AMEX',
    'DISCOVER',
    'JCB',
    'MAESTRO',
  ];
  const cardClasses = ['CREDIT', 'DEBIT'];
  const cardLevels = ['STANDARD', 'GOLD', 'PLATINUM', 'SIGNATURE', 'BLACK'];

  const countries = Object.keys(countryMap);

  const cardHolderExamples = [
    'John Smith',
    'Maria Garcia',
    'David Johnson',
    'Fatima Khan',
    'Hiroshi Tanaka',
    'Nguyen Van A',
    'Priya Patel',
    "Liam O'Connor",
    'Sofia Rossi',
    'Carlos Silva',
    'Emma Brown',
    'Isabella Martinez',
    'Lucas Silva',
    'Chloe Wilson',
    'Mohammed Ali',
  ];

  // **Lưu trữ dữ liệu thô (DeepPartial) thay vì push entities trả về từ repo.create riêng lẻ**
  const itemsData: DeepPartial<CVV>[] = [];

  for (let i = 0; i < 25; i++) {
    const country = randomFrom(countries);
    const meta = countryMap[country];
    const state = randomFrom(meta.states);
    const city = randomFrom(meta.cities);
    const bank = randomFrom(banks);

    const bin16 = genBin16(String(400000 + ((i * 7) % 600000)));
    const price = parseFloat((Math.random() * 25 + 8).toFixed(2));
    const expiryDate = genExpiry();
    const cardType = randomFrom(cardTypes);
    const cardClass = randomFrom(cardClasses);
    const cardLevel = randomFrom(cardLevels);
    const userNameCard = randomFrom(cardHolderExamples);

    const dataSource = makeDataSource(bin16, bank.key);

    const rec: DeepPartial<CVV> = {
      binNumber: bin16,
      issuingBank: bank.name,
      cardType,
      cardClass,
      cardLevel,
      expiryDate,
      country,
      state,
      city,
      zip: meta.zipPrefix ? `${meta.zipPrefix}${100 + i}` : `${1000 + i}`,
      price,
      isAvailable: Math.random() > 0.05,
      dataSource,
      sellerName: bank.name,
      hasSsn: Math.random() > 0.6,
      hasDob: Math.random() > 0.5,
      cardHolder: userNameCard, // your requested field
    };

    itemsData.push(rec);
  }

  // TẠO ENTITIES 1 lần từ mảng dữ liệu thô
  const entities = repo.create(itemsData); // returns CVV[]
  await repo.save(entities);
  console.log('✅ Seeded 25 CVV items successfully!');
  await AppDataSource.destroy();
}

// nếu chạy trực tiếp bằng ts-node
if (require.main === module) {
  runSeeder().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
