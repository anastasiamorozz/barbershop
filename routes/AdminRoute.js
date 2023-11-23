const express = require('express')
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const AuthController = require('../controllers/AuthController');
const AppointmentController = require('../controllers/AppointmentController');

router.post('/addService', ServiceController.addService);
router.put('/updateService/:id', ServiceController.updateService);
router.delete('/deleteService/:id', ServiceController.deleteService);

router.get('/getUsers', AuthController.getAllUsers);
router.get('/getBarbers', AuthController.getBarbers);
router.put('/makeBarber/:id', AuthController.makeBarber);
;
router.delete('/deleteUser/:userId', AuthController.deleteUser);

router.get('/getAppointmentsByDate/:date', AppointmentController.getAppointmentsByDate);

module.exports = router