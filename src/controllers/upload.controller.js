import { sendResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import BadRequestError from '../errors/BadRequestError.js';

class UploadController {
  uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new BadRequestError('No file uploaded or file did not pass validation');
    }

    // Standardize file paths for database storing
    const filePath = req.file.path.replace(/\\/g, '/');

    return sendResponse(res, 200, 'File uploaded successfully', {
      filePath: `/${filePath}`,
    });
  });
}

export default new UploadController();
