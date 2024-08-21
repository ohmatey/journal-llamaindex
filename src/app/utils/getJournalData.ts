import fs from 'fs/promises';
import PDFParser from 'pdf2json';

import { DataFile } from '../types';

const parsePDF = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(null, true);

    pdfParser.on('pdfParser_dataError', errData => reject(errData.parserError));
    pdfParser.on('pdfParser_dataReady', pdfData => {
      // Extract text content from the PDF data
      const textContent = pdfParser.getRawTextContent();

      resolve(textContent);
    });

    pdfParser.loadPDF(filePath);
  });
};

const getJournalData = async () => {
  const data = await fs.readdir("./data");

  const filesData = await Promise.all(
    data.map(async (file) => {
      const filePath = `./data/${file}`;

      let content = '';

      // Check if the file is a PDF by its extension
      if (file.endsWith('.pdf')) {
        try {
          // Parse the PDF content using pdf2json
          content = await parsePDF(filePath);
        } catch (error) {
          console.error(`Error reading PDF file ${file}:`, error);
          return null;
        }
      } else {
        // If not a PDF, you can handle it as plain text or other file types
        const fileBuffer = await fs.readFile(filePath);
        content = fileBuffer.toString('utf-8');
      }

      if (!content) {
        return null;
      }

      return { name: file, content } as DataFile;
    }
  ));

  return filesData;
}

export default getJournalData;