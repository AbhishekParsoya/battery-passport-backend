const express = require('express');
const Passport = require('../models/Passport');
const auth = require('../middlewares/auth');
const { produceEvent } = require('../kafka');

const router = express.Router();

router.post('/', auth(['admin']), async (req, res) => {
  const passport = await Passport.create(req.body);
  await produceEvent('passport.created', passport);
  res.status(201).json(passport);
});

router.get('/:id', auth(['admin', 'user']), async (req, res) => {
  const passport = await Passport.findById(req.params.id);
  if (!passport) return res.status(404).json({ message: 'Not found' });
  res.json(passport);
});

router.put('/:id', auth(['admin']), async (req, res) => {
  const updated = await Passport.findByIdAndUpdate(req.params.id, req.body, { new: true });
  await produceEvent('passport.updated', updated);
  res.json(updated);
});

router.delete('/:id', auth(['admin']), async (req, res) => {
  const deleted = await Passport.findByIdAndDelete(req.params.id);
  await produceEvent('passport.deleted', { id: req.params.id });
  res.json({ message: 'Deleted' });
});

module.exports = router;




/**
 * @swagger
 * tags:
 *   name: Passports
 *   description: Battery Passport Management
 */

/**
 * @swagger
 * /api/passports:
 *   post:
 *     summary: Create a new battery passport (admin only)
 *     tags: [Passports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Full passport data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Passport'
 *     responses:
 *       201:
 *         description: Passport created successfully
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/passports/{id}:
 *   get:
 *     summary: Get passport by ID
 *     tags: [Passports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Passport ID
 *     responses:
 *       200:
 *         description: Passport data returned
 *       404:
 *         description: Passport not found
 */

/**
 * @swagger
 * /api/passports/{id}:
 *   put:
 *     summary: Update passport by ID (admin only)
 *     tags: [Passports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Partial or full passport update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Passport'
 *     responses:
 *       200:
 *         description: Passport updated
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */

/**
 * @swagger
 * /api/passports/{id}:
 *   delete:
 *     summary: Delete passport by ID (admin only)
 *     tags: [Passports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Passport deleted
 *       403:
 *         description: Forbidden
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

 *   schemas:
 *     Passport:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             generalInformation:
 *               type: object
 *               properties:
 *                 batteryIdentifier:
 *                   type: string
 *                 batteryModel:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     modelName:
 *                       type: string
 *                 batteryMass:
 *                   type: number
 *                 batteryCategory:
 *                   type: string
 *                 batteryStatus:
 *                   type: string
 *                 manufacturingDate:
 *                   type: string
 *                 manufacturingPlace:
 *                   type: string
 *                 warrantyPeriod:
 *                   type: string
 *                 manufacturerInformation:
 *                   type: object
 *                   properties:
 *                     manufacturerName:
 *                       type: string
 *                     manufacturerIdentifier:
 *                       type: string
 *             materialComposition:
 *               type: object
 *               properties:
 *                 batteryChemistry:
 *                   type: string
 *                 criticalRawMaterials:
 *                   type: array
 *                   items:
 *                     type: string
 *                 hazardousSubstances:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       substanceName:
 *                         type: string
 *                       chemicalFormula:
 *                         type: string
 *                       casNumber:
 *                         type: string
 *             carbonFootprint:
 *               type: object
 *               properties:
 *                 totalCarbonFootprint:
 *                   type: number
 *                 measurementUnit:
 *                   type: string
 *                 methodology:
 *                   type: string
 */