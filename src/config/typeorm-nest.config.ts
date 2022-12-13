import { Video } from '../resources/videos/entities/video.entity';

export const typeormConfigNest = {
  type: 'postgres' as const,
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'chain123',
  database: 'logia-just-server',
  entities: [Video],
  synchronize: true,
  logging: false,
};
