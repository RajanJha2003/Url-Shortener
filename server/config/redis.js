import { createClient } from 'redis';

const redis = createClient({
  username: 'default',
  password: 'wsgB6rHKwGJYYPbLzPWxKav5WlKP80VP',
  socket: {
    host: 'redis-19920.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
    port: 19920
  }
});

redis.on('error', (err) => console.log('Redis Client Error', err));

await redis.connect();

export default redis;
