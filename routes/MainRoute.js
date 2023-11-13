const express = require('express')
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const AppointmentController = require('../controllers/AppointmentController');


router.get('/getServices', ServiceController.getServices);

router.post('/createAppointment', AppointmentController.createAppointment);

module.exports = router