import createHttpError from 'http-errors';
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
  const newContact = await createContact(req.body, userId);
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
  const result = await updateContact(contactId, req.body, userId);
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
