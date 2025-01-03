// import { VercelRequest, VercelResponse } from '@vercel/node';
// import fetch from 'node-fetch';

// const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY!;
// const BASE_ID = process.env.AIRTABLE_BASE_ID!;
// const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME!;

// export default async (req: VercelRequest, res: VercelResponse) => {
//   // Enable CORS
//   res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins, or replace '*' with your frontend URL
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allowed headers

//   // Handle preflight requests
//   if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     return;
//   }

//   try {
//     const response = await fetch(
//         `https://api.airtable.com/v0/${BASE_ID}/${AIRTABLE_TABLE_NAME}?sort%5B0%5D%5Bfield%5D=weekNo&sort%5B0%5D%5Bdirection%5D=desc`,
//         {
//           headers: {
//             Authorization: `Bearer ${AIRTABLE_API_KEY}`,
//           },
//         }
//       );

//     if (!response.ok) {
//       throw new Error('Failed to fetch data from Airtable');
//     }

//     const airtableData:any = await response.json();
//     const formattedData = airtableData.records.map((record: any) => ({
//       id: record.id,
//       ...record.fields,
//     }));

//     res.status(200).json(formattedData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Failed to fetch data hmmmmmmm' });
//   }
// };

import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Ensure node-fetch is installed

dotenv.config();

const app = express();
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_TOKEN!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME!;

// Use CORS for your frontend origin
app.use(cors({ origin: 'https://strava-fe.vercel.app' }));

// Middleware for JSON parsing
app.use(express.json());

// API route
app.get('/api/sports', async (req: Request, res: Response) => {
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
      throw new Error(`Failed to fetch data from Airtable: ${response.statusText}`);
    }

    const airtableData = await response.json();
    // @ts-expect-error
    const formattedData = airtableData.records.map((record: any) => ({
      id: record.id,
      ...record.fields,
    }));

    res.status(200).json(formattedData);
  } catch (error: any) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Start server (useful for local testing)
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
