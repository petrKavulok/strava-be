import { VercelRequest, VercelResponse } from '@vercel/node';
import fetch from 'node-fetch';

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  const allowedOrigins = ['https://strava-fe.vercel.app', 'http://strava-fe.vercel.app'];
  res.setHeader('Access-Control-Allow-Origin', allowedOrigins);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // return res.status(200).json({ message: 'Hello World' });

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

    return res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch data hmmmmmmm' });
  }
}
