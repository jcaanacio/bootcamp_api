const express = require('express');
const router = express.Router();
const BootcampController = require('../controllers/bootcamp.controller');
const BootcampModel = require('./../models/Bootcamp.model');
const BootcampService = require('../services/bootcamp.service');
const bootcampService = new BootcampService(BootcampModel);
const bootcampController = new BootcampController(bootcampService);

router.route('/radius/:zipcode/:distance').get(bootcampController.getWithInRadius);

router.route('/')
    .get(bootcampController.get)
    .post(bootcampController.create);

router.route('/:id')
    .get(bootcampController.getById)
    .delete(bootcampController.deleteById)
    .put(bootcampController.updateById);

module.exports = router;