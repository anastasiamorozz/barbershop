const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Service = require('../models/Service');

module.exports = {
    createAppointment: async (req, res) =>{
        try {
            const { user, barber, services, date } = req.body;
        
            // Перевірка чи барбершоп працює у вказаному періоді (10:00 - 21:00)
            const appointmentDate = new Date(date);
            const openingTime = new Date(date).setHours(10, 0, 0, 0);
            const closingTime = new Date(date).setHours(21, 0, 0, 0);
        
            if (appointmentDate < openingTime || appointmentDate > closingTime) {
              return res.status(400).json({ message: 'Барбершоп працює тільки з 10:00 до 21:00' });
            }
        
            // Перевірка чи барбер вже зайнятий на цей час
            const isBarberBusy = await Appointment.exists({
              barber,
              date,
            });
        
            if (isBarberBusy) {
              return res.status(400).json({ message: 'Барбер вже зайнятий на цей час' });
            }
        
            // Отримати послуги за їх ID
            const selectedServices = await Service.find({ _id: { $in: services } });

            // Перевірити, чи послуги існують
            if (selectedServices.length !== services.length) {
                return res.status(400).json({ message: 'Не всі послуги знайдено' });
            }

            let totalPrice = 0;
            let totalDuration = 0;
            for (const service of selectedServices) {
              totalPrice += service.price;
                totalDuration += service.duration;
            }

            user.numberOfVisits++;
            if (user.numberOfVisits % 10 === 0) {
                // Кожна десята послуга безкоштовна
                totalCost = 0;
            }
        
            const newAppointment = new Appointment({
              user,
              barber,
              services,
              date,
              totalPrice,
              totalDuration,
            });
        
            await newAppointment.save();
        
            res.status(201).json({ message: 'Запис на стрижку успішно створено' });
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при створенні запису на стрижку' });
          }
    },
    getAppointmentsByDate: async (req, res) =>{
        try {
            const { date } = req.params;
        
            // Отримання всіх записів на стрижку для певної дати
            const appointments = await Appointment.find({ date });
        
            res.status(200).json(appointments);
          } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при отриманні записів на стрижку' });
          } 
    },
    getAppointmentsByBarber: async (req, res) =>{
        try {
            const barberId = req.params.id;
    
            const appointments = await Appointment.find({ barberId });
    
            res.status(200).json(appointments);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Помилка при отриманні записів для барбера' });
        }
    }
}

