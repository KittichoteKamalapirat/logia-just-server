import { CreateSchduleInput } from './create-schdule.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSchduleInput extends PartialType(CreateSchduleInput) {
  @Field(() => Int)
  id: number;
}
