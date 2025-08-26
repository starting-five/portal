const formidable = require('formidable');
const sharp = require('sharp');
const fs = require('fs');

export const config = {
  api: {
    bodyParser: false,
  },
};

import type { NextApiRequest, NextApiResponse } from 'next';
import type { Fields, Files, File } from 'formidable';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: Fields, files: Files) => {
    if (res.headersSent) return;
    if (err) {
      res.status(400).json({ error: 'Error parsing form data' });
      return;
    }
    let file: File | File[] | undefined = files.image as File | File[] | undefined;
    if (Array.isArray(file)) file = file[0];
    if (!file || typeof file.filepath !== 'string') {
      res.status(400).json({ error: 'No image file provided' });
      return;
    }
    try {
      const webpBuffer = await sharp(fs.readFileSync(file.filepath)).webp().toBuffer();
      res.setHeader('Content-Type', 'image/webp');
      res.status(200).send(webpBuffer);
    } catch (error) {
      res.status(500).json({ error: 'Image conversion failed' });
    }
  });
  // Prevent handler from continuing after parse
  return;
};
export default handler;
