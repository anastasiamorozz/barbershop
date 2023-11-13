const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Шлях до вашої моделі користувача
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createSecretToken } = require('../util/SecretToken');


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
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        phone,
        password: hashedPassword,
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

      if (!phone || !password) {
        return res.status(400).json({ message: 'Будь ласка, заповніть всі обов\'язкові поля' });
      }

      const user = await User.findOne({ phone });

      if (!user) {
        return res.status(404).json({ message: 'Користувача з вказаним телефоном не знайдено' });
      }

      const isPasswordValid = await bcrypt.compare(hashedPassword, user.password);

      console.log(hashedPassword);
      console.log(user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Невірний пароль' });
      }
      // Створення JWT-токена для авторизації
      const token = createSecretToken(user._id);

      // Відправлення токена відповіді
      res.status(200).json({ token, userId: user._id });
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
  }
};