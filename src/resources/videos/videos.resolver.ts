import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class VideosResolver {
  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
