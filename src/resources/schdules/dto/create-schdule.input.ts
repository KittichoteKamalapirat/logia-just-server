import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateSchduleInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
