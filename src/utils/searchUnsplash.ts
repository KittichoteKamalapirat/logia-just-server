import { createApi } from 'unsplash-js';
import { PhotosResponse } from '../types/Unsplash';

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export const searchUnsplash = async (
  query: string,
  unsplashPage: number,
): Promise<PhotosResponse> => {
  try {
    console.log('fetching unsplashh', process.env.UNSPLASH_ACCESS_KEY);
    const result = await unsplash.search.getPhotos({
      query,
      page: unsplashPage,
      perPage: 10,
      orientation: 'landscape',
    });
    console.log('result', result);
    const photos = result.response.results;

    return { photos };
  } catch (error) {
    console.log('error occurred: ', error);
    return {
      errors: [
        {
          field: 'Error',
          message: 'An error occured from Unsplash',
        },
      ],
    };
  }
};
