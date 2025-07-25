const express = require('express');
const multer = require('multer');
const s3 = require('../s3');
const auth = require('../middlewares/auth');
const Document = require('../models/Document');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

const BUCKET = process.env.S3_BUCKET;

// Upload
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  const file = req.file;
  const s3Key = `${uuidv4()}-${file.originalname}`;

  await s3.putObject({
    Bucket: BUCKET,
    Key: s3Key,
    Body: file.buffer
  }).promise();

  const doc = await Document.create({ fileName: file.originalname, s3Key });
  res.json({ docId: doc._id, fileName: doc.fileName, createdAt: doc.createdAt });
});

// Get Download Link
router.get('/:docId', auth, async (req, res) => {
  const doc = await Document.findById(req.params.docId);
  if (!doc) return res.status(404).json({ message: 'Not found' });

  const url = s3.getSignedUrl('getObject', {
    Bucket: BUCKET,
    Key: doc.s3Key,
    Expires: 60 * 5
  });

  res.json({ downloadUrl: url });
});

// Delete
router.delete('/:docId', auth, async (req, res) => {
  const doc = await Document.findByIdAndDelete(req.params.docId);
  if (!doc) return res.status(404).json({ message: 'Not found' });

  await s3.deleteObject({ Bucket: BUCKET, Key: doc.s3Key }).promise();
  res.json({ message: 'Deleted' });
});

// Update
router.put('/:docId', auth, async (req, res) => {
    const { fileName } = req.body;
    const doc = await Document.findByIdAndUpdate(
      req.params.docId,
      { fileName },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: 'Not found' });
    res.json(doc);
  });

module.exports = router;









/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document upload and management
 */

/**
 * @swagger
 * /api/documents/upload:
 *   post:
 *     summary: Upload a document (PDF, TXT)
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, passportId]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               passportId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded successfully
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/documents/{passportId}:
 *   get:
 *     summary: Get all documents by passportId
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: passportId
 *         required: true
 *         schema:
 *           type: string
 *         description: Associated passport ID
 *     responses:
 *       200:
 *         description: Documents list returned
 *       404:
 *         description: No documents found
 */

/**
 * @swagger
 * /api/documents/download/{id}:
 *   get:
 *     summary: Download document by its ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID (MongoDB)
 *     responses:
 *       200:
 *         description: File downloaded
 *       404:
 *         description: Document not found
 */

/**
 * @swagger
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document by its ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Document ID (MongoDB)
 *     responses:
 *       200:
 *         description: Document deleted
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */