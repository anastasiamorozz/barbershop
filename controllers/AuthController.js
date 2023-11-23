const express = require('express');
require("dotenv").config();
const router = express.Router();
const User = require('../models/User'); // Шлях до вашої моделі користувача
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createSecretToken } = require('../util/SecretToken');
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Директорія, куди будуть збережені файли
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

module.exports = {
  registerUser: async (req, res) => {
    try {
      const { name, phone, password } = req.body;
      if (!name || !phone || !password) {
        return res.status(400).json({ message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      }
      const existingUser = await User.findOne({ phone });

      if (existingUser) {
        return res.status(400).json({ message: 'Користувач з цим телефоном вже існує' });
      }
      const newUser = new User({
        name,
        phone,
        password,
        numberOfVisits: 0
      });
      await newUser.save();

      res.status(201).json({ message: 'Користувач успішно зареєстрований' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при реєстрації користувача' });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { phone, password } = req.body;

      if (!password || !phone) {
        return res.status(400).json({ message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      }

      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({ message: 'Користувача з вказаним телефоном не знайдено' });
      }

      const isPasswordValid = password === user.password;

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Невірний пароль' });
      }

      const token = createSecretToken(user._id);

      // Відправлення токена відповіді
      res.status(200).json({ token, user: { userId: user._id, name: user.name, phone: user.phone, role: user.role } });
      console.log(token, user._id);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при авторизації користувача' });
    }
  },
  getAllUsers: async (req, res) =>{
    try {
      const users = await User.find();
  
      res.status(200).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при отриманні користувачів' });
    }
  },
  makeBarber: async (req, res) =>{
    try {
      const userId = req.params.id;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
      }
      user.role = 'barber';
  
      await user.save();
  
      res.status(200).json({ message: 'Роль користувача успішно оновлено на "barber"' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при оновленні ролі користувача' });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
  
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Користувача не знайдено' });
      }
  
      await user.remove();
  
      res.status(200).json({ message: 'Користувача успішно видалено' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Помилка при видаленні користувача' });
    }
  },
  makeAvatar: async (req, res) => {
    try {
        upload.single('photo')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Помилка при завантаженні фото' });
            }

            // Доступ до завантаженого файлу через req.file
            const filePath = req.file.path;

            // Отримання JWT токена з заголовка Authorization
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(401).json({ message: 'Unauthorized: No token provided' });
            }

            try {
                // Розшифрування та верифікація токена
                const decoded = jwt.verify(token, process.env.TOKEN_KEY);

                // Оновлення фото користувача в базі даних
                const userId = decoded.id; // Використовуйте id, яке ви вставляєте при підписанні токена
                const user = await User.findById(userId);

                if (!user) {
                    return res.status(404).json({ message: 'Користувача не знайдено' });
                }

                // Видалення попереднього фото, якщо воно існує
                if (user.photo) {
                    // Видалення попереднього файлу з сервера
                    // Реалізуйте це за допомогою fs.unlink або іншого методу
                }

                // Оновлення посилання на фото в базі даних
                user.photo = filePath;
                await user.save();

                res.status(200).json({ message: 'Фото успішно завантажено', filePath });
            } catch (error) {
                console.error(error);
                return res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при завантаженні фото' });
    }

  },
  getBarbers: async (req, res) => {
    try {
        // Отримання тільки барберів
        const barbers = await User.find({ role: 'barber' });

        res.status(200).json(barbers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Помилка при отриманні барберів' });
    }
  }
};