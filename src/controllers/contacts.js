import createHttpError from 'http-errors';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { env } from '../utils/env.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const contact = await getContactById(contactId, userId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { error } = createContactSchema.validate(req.body);
  if (error) {
    throw createHttpError(400, error.message);
  }
  let photo = null;
  if (req.file) {
    if (typeof req.file !== 'undefined') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public/photos', req.file.filename),
      );
      photo = `${env('APP_DOMAIN')}/public/photos/${req.file.filename}`;
    }
  }
  const newContact = await createContact({ ...req.body, photo }, userId);
  res.status(201).json({
    status: 201,
    message: `Successfully create a contact!`,
    data: newContact,
  });
};

export const updateContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    throw createHttpError(400, error.message);
  }
  let contactData = { ...req.body };
  if (req.file) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      const result = await uploadToCloudinary(req.file.path);
      await fs.unlink(req.file.path);
      contactData.photo = result.secure_url;
    } else {
      await fs.rename(
        req.file.path,
        path.resolve('src', 'public/photos', req.file.filename),
      );
      contactData.photo = `${env('APP_DOMAIN')}/public/photos/${
        req.file.filename
      }`;
    }
  }

  const result = await updateContact(contactId, contactData, userId);
  if (!result) throw createHttpError(404, 'Contact not found');
  res.json({
    status: 200,
    message: `Successfully patched a contact ${contactId}!`,
    data: result,
  });
};

export const deleteContactController = async (req, res) => {
  const { _id: userId } = req.user;
  const { contactId } = req.params;
  const result = await deleteContact(contactId, userId);
  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }
  res.sendStatus(204);
};
