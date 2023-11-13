const express = require('express')
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');

router.get('/getAppointments/:barberId', AppointmentController.getAppointmentsByBarber);

module.exports = router