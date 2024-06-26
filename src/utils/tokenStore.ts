import fs from 'fs';
import path from 'path';

const tokenFilePath = path.join(__dirname, 'tokens.json');

export const saveToken = (service: string, token: any) => {
  const tokens = fs.existsSync(tokenFilePath) ? JSON.parse(fs.readFileSync(tokenFilePath, 'utf-8')) : {};
  tokens[service] = token;
  fs.writeFileSync(tokenFilePath, JSON.stringify(tokens));
};

export const getToken = (service: string) => {
  if (!fs.existsSync(tokenFilePath)) return null;
  const tokens = JSON.parse(fs.readFileSync(tokenFilePath, 'utf-8'));
  return tokens[service];
};
