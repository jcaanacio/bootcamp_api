const express = require('express');
const router = express.Router();
const BootcampController = require('../controllers/bootcamp.controller');
const BootcampModel = require('./../models/Bootcamp.model');
const bootCamp = new BootcampController(BootcampModel);


router.route('/')
    .get(bootCamp.get)
    .post(bootCamp.create);

router.route('/:id')
    .get(bootCamp.getById)
    .delete(bootCamp.deleteById)
    .put(bootCamp.updateById);

module.exports = router;