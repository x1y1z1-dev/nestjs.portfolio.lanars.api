import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Portfolio } from '../portfolios/entities/portfolio.entity';
import { Image } from '../images/entities/image.entity';
import { Comment } from '../comments/entities/comment.entity';
import { AppDataSource } from '../../data-source';

async function seed() {
  await AppDataSource.initialize();

  const userRepo = AppDataSource.getRepository(User);
  const portfolioRepo = AppDataSource.getRepository(Portfolio);
  const imageRepo = AppDataSource.getRepository(Image);
  const commentRepo = AppDataSource.getRepository(Comment);

  // -----------------------------
  // Users
  // -----------------------------
  const usersData = [
    { email: 'admin@test.com', name: 'Admin', passwordHash: await bcrypt.hash('123456', 10) },
    { email: 'user@test.com', name: 'User', passwordHash: await bcrypt.hash('123456', 10) },
  ];

  const users: User[] = [];
  for (const u of usersData) {
    const exists = await userRepo.findOne({ where: { email: u.email } });
    if (!exists) {
      const user = userRepo.create(u);
      await userRepo.save(user);
      users.push(user);
    } else {
      users.push(exists);
    }
  }

  // -----------------------------
  // Portfolios
  // -----------------------------
  const portfoliosData = [
    { name: 'Admin Portfolio', description: 'Portfolio of admin', owner: users[0] },
    { name: 'User Portfolio', description: 'Portfolio of user', owner: users[1] },
  ];

  const portfolios: Portfolio[] = [];
  for (const p of portfoliosData) {
    const portfolio = portfolioRepo.create(p);
    await portfolioRepo.save(portfolio);
    portfolios.push(portfolio);
  }

  // -----------------------------
  // Images
  // -----------------------------
  const imagesData = [
    { name: 'Image 1', description: 'First image', filePath: 'image1.jpg', portfolio: portfolios[0], uploader: users[0] },
    { name: 'Image 2', description: 'Second image', filePath: 'image2.jpg', portfolio: portfolios[1], uploader: users[1] },
  ];

  const images: Image[] = [];
  for (const i of imagesData) {
    const img = imageRepo.create(i);
    await imageRepo.save(img);
    images.push(img);
  }

  // -----------------------------
  // Comments
  // -----------------------------
  const commentsData = [
    { text: 'Nice photo!', author: users[1], image: images[0] },
    { text: 'Awesome!', author: users[0], image: images[1] },
  ];

  for (const c of commentsData) {
    const comment = commentRepo.create(c);
    await commentRepo.save(comment);
  }

  console.log('Seeding finished!');
  process.exit();
}

seed().catch((err: Error) => {
  console.error(err);
  process.exit(1);
});
