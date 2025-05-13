import multer from 'multer';
import { extname } from 'node:path';

export const editFileName: multer.DiskStorageOptions['filename'] = (
  req,
  file,
  callback,
) => {
  const fileExtName = extname(file.originalname);
  const randomName = `${Date.now()}_file_${Math.random().toString(16).slice(2)}`;
  callback(null, `${randomName}${fileExtName}`);
};
