const express = require('express');
const router = express.Router();
const Service = require('../models/Service'); 

// // Видалення сервісу за ID
// router.delete('/deleteService/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     await Service.findByIdAndRemove(id);

//     res.status(200).json({ message: 'Сервіс успішно видалено' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Помилка при видаленні сервісу' });
//   }
// });

// // Зміна інформації про сервіс за ID
// router.put('/updateService/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, description, price } = req.body;

//     if (!name || !description || !price) {
//       return res.status(400).json({ message: 'Будь ласка, заповніть всі обов\'язкові поля' });
//     }

//     await Service.findByIdAndUpdate(id, { name, description, price });

//     res.status(200).json({ message: 'Інформацію про сервіс успішно змінено' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Помилка при зміні інформації про сервіс' });
//   }
// });

// // Перегляд всіх сервісів
// router.get('/getServices', async (req, res) => {
//   try {
//     const services = await Service.find();

//     res.status(200).json(services);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Помилка при отриманні сервісів' });
//   }
// });

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
          return res.status(404).json({ message: 'Сервіс не знайдено' });
        }
  
        // Використовуємо метод deleteOne або findByIdAndDelete для видалення
        await existingService.deleteOne(); // або await Service.findByIdAndDelete(serviceId);
  
        res.status(200).json({ message: 'Сервіс успішно видалено' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при видаленні сервісу' });
      }
    },
  }
