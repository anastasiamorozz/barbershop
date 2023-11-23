const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); 

module.exports = {
    addService: async (req, res) => {
        try {
          const { name, description, price, duration } = req.body;
      
          if (!name || !price || !duration) {
            return res.status(400).json({ message: 'Будь ласка, заповніть всі обов\'язкові поля' });
          }
      
          const newService = new Service({
            name,
            description,
            price,
            duration
          });
      
          await newService.save();
      
          res.status(201).json({ message: 'Сервіс успішно додано' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Помилка при додаванні сервісу' });
        }
    },
    getServices: async (req, res) => {
      try {
          // Отримати всі послуги з бази даних 
          const services = await Service.find();

          // Відправити відповідь із списком послуг
          res.status(200).json(services);
      } catch (error) {
          console.error(error);
          // Відправити відповідь із статусом 500 та повідомленням про помилку
          res.status(500).json({ message: 'Помилка при отриманні послуг' });
      }
    },
    updateService: async (req, res) => {
      try {
          const serviceId = req.params.id;
          const { name, description, price, duration } = req.body;

          // Перевірити, чи існує сервіс із вказаним ідентифікатором
          const existingService = await Service.findById(serviceId);

          if (!existingService) {
              return res.status(404).json({ message: 'Сервіс не знайдено' });
          }

          // Оновити інформацію про сервіс
          existingService.name = name;
          existingService.description = description;
          existingService.price = price;
          existingService.duration = duration;

          await existingService.save();

          res.status(200).json({ message: 'Інформацію про сервіс успішно оновлено' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Помилка при оновленні інформації про сервіс' });
      }
    },
    deleteService: async (req, res) => {
      try {
        const serviceId = req.params.id;
    
        // Знаходимо сервіс за ID
        const existingService = await Service.findById(serviceId);
    
        if (!existingService) {
          return res.status(404).json({ success: false, message: 'Сервіс не знайдено' });
        }
    
        // Використовуємо метод deleteOne або findByIdAndDelete для видалення
        await existingService.deleteOne(); // або await Service.findByIdAndDelete(serviceId);
    
        res.status(200).json({ success: true, message: 'Сервіс успішно видалено' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Помилка при видаленні сервісу' });
      }
    },
    getServicesById: async (req, res) => {
      const serviceId = req.params.id;
      try {
        const service = await Service.findById(serviceId);
    
        if (!service) {
          return { success: false, message: 'Сервіс не знайдено' };
        }
    
      res.status(200).json({ success: true, service });
      } catch (error) {
        console.error(error);
        return { success: false, message: 'Помилка при отриманні сервісу за ID' };
      }
    }
  }
