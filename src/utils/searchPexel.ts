import { createClient, Videos } from 'pexels';
import { ClipResponse } from '../types/Pexel';

export const searchPexel = async (query: string): Promise<ClipResponse> => {
  const client = createClient(process.env.PEXEL_API_KEY);
  try {
    const result = (await client.videos.search({
      query,
      per_page: 10,
      orientation: 'landscape',
    })) as Videos;

    return { clip: result };
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
