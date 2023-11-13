const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  barber: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ассоціація з моделлю користувача, якщо барбер теж користувач
    required: true,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service', // Ассоціація з моделлю сервісу
      required: true,
    },
  ],
  date: {
    type: Date,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  totalDuration: {
    type: Number,
    required: true,
  },
});

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
