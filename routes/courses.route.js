const express = require('express');
const router = express.Router({mergeParams: true});
const CourseController = require('../controllers/course.controller');
const CourseModel = require('./../models/Course.model');
const BootcampModel = require('./../models/Bootcamp.model');
const BootcampService = require('./../services/bootcamp.service');
const CourseService = require('../services/course.service');

const bootcampService = new BootcampService(BootcampModel);
const courseService = new CourseService(CourseModel,bootcampService);
const courseController = new CourseController(courseService);


router.route('/')
    .get(courseController.get)
    .post(courseController.create);

router.route('/:id')
    .get(courseController.getById)
    .delete(courseController.deleteById)
    .put(courseController.updateById);

module.exports = router;