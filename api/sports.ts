import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME!;

const handler = async (req: VercelRequest, res: VercelResponse) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', 'https://strava-fe.vercel.app/'); // Allow all origins, or replace '*' with your frontend URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const response = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${AIRTABLE_TABLE_NAME}?sort%5B0%5D%5Bfield%5D=weekNo&sort%5B0%5D%5Bdirection%5D=desc`,
        {
          headers: {
            Authorization: `Bearer ${AIRTABLE_API_KEY}`,
          },
        }
      );

    if (!response.ok) {
      throw new Error('Failed to fetch data from Airtable');
    }

    const airtableData:any = await response.json();
    const formattedData = airtableData.records.map((record: any) => ({
      id: record.id,
      ...record.fields,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data hmmmmmmm' });
  }
};

export { handler as default };
