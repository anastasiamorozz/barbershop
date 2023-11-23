const express = require('express')
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const AppointmentController = require('../controllers/AppointmentController');


router.get('/getServices', ServiceController.getServices);
router.get('/getServices/:id', ServiceController.getServicesById);

router.post('/createAppointment', AppointmentController.createAppointment);

module.exports = router