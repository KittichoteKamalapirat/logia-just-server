import { createApi } from 'unsplash-js';
import { AudioResponse, FreeSoundResponse } from '../types/FreeSound';

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

interface SearchFreeSoundInput {
  query: string;
  page?: number;
  pageSize?: number;
}
export const searchFreeSound = async ({
  query,
  page = 1,
  pageSize = 15,
}: SearchFreeSoundInput): Promise<AudioResponse> => {
  // page_size = 15, max = 150
  try {
    console.log('fetching free sound');
    const response = await fetch(
      `https://freesound.org/apiv2/search/text/?query=${query}&page_size=${pageSize}&page=${page}&fields=previews,created,type,tags,description,avg_rating,id,name,url,filesize,duration,download,license,username`,
      {
        headers: new Headers({
          Authorization: `Token ${process.env.FREESOUND_CLIENT_SECRET}`,
        }),
      },
    );
    const data = (await response.json()) as FreeSoundResponse;

    return { sound: data };
  } catch (error) {
    console.log('error occurred: ', error);
    return {
      errors: [
        {
          field: 'Error',
          message: 'An error occured',
        },
      ],
    };
  }
};
