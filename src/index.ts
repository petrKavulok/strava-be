import dotenv from 'dotenv';
import express, { Request, Response } from 'express';

import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const AIRTABLE_API_KEY = process.env.AIRTABLE_API_TOKEN!;
const BASE_ID = process.env.AIRTABLE_BASE_ID!;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME!;

app.use(cors());

// Set up other middleware
app.use(express.json());


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
      throw new Error('Failed to fetch data from Airtable');
    }

    const airtableData = await response.json();
    const formattedData = airtableData.records.map((record: any) => ({
      id: record.id,
      ...record.fields,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
