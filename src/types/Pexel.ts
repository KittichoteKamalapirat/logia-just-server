import { Videos } from 'pexels';
import { FieldError } from './field-error';

export interface ClipResponse {
  clip?: Videos;
  errors?: FieldError[];
}
