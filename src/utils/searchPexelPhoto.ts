import { createClient, PhotosWithTotalResults } from 'pexels';

export const searchPexelPhoto = async (query: string) => {
  const client = createClient(process.env.PEXEL_API_KEY);
  try {
    console.log('fetching pexel photo');
    const result = (await client.photos.search({
      query,
      per_page: 10,
      orientation: 'landscape',
    })) as PhotosWithTotalResults;

    return { img: result };
  } catch (error) {
    console.log('error occurred: ', error);
    return {
      errors: [
        {
          field: 'Error',
          message: 'An error occured from Pexels',
        },
      ],
    };
  }
};
