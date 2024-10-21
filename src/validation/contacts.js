import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact name must be a string',
    'any.required': 'Contact name is required',
    'string.min': 'Contact name length must be at least 3 characters long',
    'string.max':
      'Contact name length must be less than or equal to 20 characters long',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact phoneNumber must be a string',
    'string.min':
      'Contact phone number length must be at least 3 characters long',
    'string.max':
      'Contact phone number length must be less than or equal to 20 characters long',
    'any.required': 'Contact phoneNumber is required',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.base': 'Contact email must be a string',
    'string.min': 'Contact email length must be at least 3 characters long',
    'string.max':
      'Contact email length must be less than or equal to 20 characters long',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is Favourite must be true or false',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'string.base': 'Contact Type must be a string',
      'string.min': 'Contact Type length must be at least 3 characters long',
      'string.max':
        'Contact Type length must be less than or equal to 20 characters long',
      'any.only': 'Contact Type must be one of [work, home, personal]',
      'any.required': 'Contact Type is required',
    }),
});
export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Contact name must be a string',
    'string.min': 'Contact name length must be at least 3 characters long',
    'string.max':
      'Contact name length must be less than or equal to 20 characters long',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Contact phoneNumber must be a string',
    'string.min':
      'Contact phone number length must be at least 3 characters long',
    'string.max':
      'Contact phone number length must be less than or equal to 20 characters long',
  }),
  email: Joi.string().email().min(3).max(20).messages({
    'string.base': 'Contact email must be a string',
    'string.min': 'Contact email length must be at least 3 characters long',
    'string.max':
      'Contact email length must be less than or equal to 20 characters long',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Is Favourite must be true or false',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .messages({
      'string.base': 'Contact Type must be a string',
      'string.min': 'Contact Type length must be at least 3 characters long',
      'string.max':
        'Contact Type length must be less than or equal to 20 characters long',
      'any.only': 'Contact Type must be one of [work, home, personal]',
    }),
});
