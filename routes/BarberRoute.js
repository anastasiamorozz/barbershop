const express = require('express')
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const AuthController = require('../controllers/AuthController');

router.get('/getAppointments/:barberId', AppointmentController.getAppointmentsByBarber);
router.post('/uploadPhoto', AuthController.makeAvatar)

module.exports = router