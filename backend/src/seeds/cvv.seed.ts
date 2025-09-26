// src/seeders/cvv.seed.ts
import { CVV } from 'src/cvv/cvv.entity';
import { DataSource } from 'typeorm';
import { binList, localizedSeedData } from './bin-list.data';

export class CvvSeeder {
  private sellerNames = [
    'John Doe',
    'Jane Smith',
    'Michael Johnson',
    'Emily Davis',
    'Chris Brown',
    'Laura Wilson',
    'Daniel Miller',
    'Sophia Anderson',
    'James Taylor',
    'Olivia Thomas',
    'David Lee',
    'Emma Harris',
    'Matthew White',
    'Isabella Martin',
    'Andrew Thompson',
    'Mia Garcia',
    'William Martinez',
    'Charlotte Robinson',
    'Benjamin Clark',
    'Amelia Rodriguez',
  ];

  public async run(dataSource: DataSource): Promise<void> {
    const cvvRepository = dataSource.getRepository(CVV);
    const cvvsToCreate: Partial<CVV>[] = [];

    console.log('📦 Generating 3000 CVV records...');
    const totalCVV = 4000;

    for (let i = 0; i < totalCVV; i++) {
      // 1️⃣ Chọn BIN ngẫu nhiên
      const binData = binList[Math.floor(Math.random() * binList.length)];

      // 2️⃣ Sinh số thẻ ngẫu nhiên (giả lập)
      const randomDigits = Math.floor(1000000000 + Math.random() * 9000000000);
      const cardNumber = `${binData.bin}${randomDigits}`.slice(0, 16);

      // 3️⃣ Dữ liệu địa phương theo quốc gia BIN
      const localized =
        localizedSeedData[binData.country] || localizedSeedData['US'];
      const cardHolder = this.randomItem<string>(
        localized.cardHolders as string[],
      );
      const state = this.randomItem<string>(localized.states as string[]);
      const city = this.randomItem<string>(localized.cities as string[]);
      const zip = this.randomItem<string>(localized.zips as string[]);
      const address = this.randomItem<string>(localized.addresses as string[]);

      // 4️⃣ CVV ngẫu nhiên 3 chữ số
      const cvvCode = Math.floor(100 + Math.random() * 900);

      // 5️⃣ Ngày hết hạn trong 1–5 năm tới
      const expiryDate = this.randomExpiryDate();

      // 6️⃣ Giá ngẫu nhiên 12.00 - 200.00
      const price = parseFloat((12 + Math.random() * (200 - 12)).toFixed(2));

      // 7️⃣ DataSource: DB_<BIN>_<8 random số>
      const dataSourceStr = `DB_${binData.bin}_${Math.floor(10000000 + Math.random() * 90000000)}`;

      // 8️⃣ Seller ngẫu nhiên
      const sellerName = this.randomItem(this.sellerNames);

      // 9️⃣ createdAt / updatedAt: random từ 2 năm trước đến hiện tại
      const createdAt = this.randomDateInPast(2);
      const updatedAt = this.randomDateAfter(createdAt);

      const newCvv: Partial<CVV> = {
        binNumber: cardNumber,
        issuingBank: binData.bank,
        cardHolder,
        CVV: cvvCode,
        cardType: binData.type,
        cardClass: binData.class,
        cardLevel: binData.level,
        expiryDate,
        country: binData.country,
        state,
        city,
        zip,
        price,
        isAvailable: true,
        dataSource: dataSourceStr,
        sellerName,
        specificAddress: address,
        hasSsn: Math.random() < 0.25,
        hasDob: Math.random() < 0.35,
        createdAt,
        updatedAt,
      };

      cvvsToCreate.push(newCvv);
    }

    console.log('⏫ Inserting into DB...');
    for (let i = 0; i < cvvsToCreate.length; i += 500) {
      await cvvRepository.insert(cvvsToCreate.slice(i, i + 500));
      console.log(
        `  • Inserted ${Math.min(i + 500, cvvsToCreate.length)}/${cvvsToCreate.length}`,
      );
    }

    console.log('🎉 Seeding finished.');
  }

  // 🔧 Helper functions
  private randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private randomExpiryDate(): string {
    const currentYear = new Date().getFullYear();
    const futureYear = currentYear + 1 + Math.floor(Math.random() * 5);
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const yearShort = String(futureYear).slice(-2);
    return `${month}/${yearShort}`;
  }

  private randomDateInPast(yearsBack: number): Date {
    const now = new Date();
    const past = new Date();
    past.setFullYear(now.getFullYear() - yearsBack);
    return new Date(
      past.getTime() + Math.random() * (now.getTime() - past.getTime()),
    );
  }

  private randomDateAfter(startDate: Date): Date {
    const now = new Date();
    return new Date(
      startDate.getTime() +
        Math.random() * (now.getTime() - startDate.getTime()),
    );
  }
}
