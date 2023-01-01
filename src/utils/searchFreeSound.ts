import { createApi } from 'unsplash-js';
import { AudioResponse, FreeSoundResponse } from '../types/FreeSound';

export const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
});

export const searchFreeSound = async (
  query: string,
): Promise<AudioResponse> => {
  try {
    console.log('fetching free sound');
    const response = await fetch(
      `https://freesound.org/apiv2/search/text/?query=${query}&fields=previews,created,type,tags,description,avg_rating,id,name,url,filesize,duration,download,license,username`,
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
