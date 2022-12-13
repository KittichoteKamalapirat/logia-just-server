import { Basic } from 'unsplash-js/dist/methods/photos/types';
import { FieldError } from './field-error';

export interface PhotosResponse {
  errors?: FieldError[];
  photos?: Basic[];
}
