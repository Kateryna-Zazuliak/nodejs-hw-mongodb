import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = () => ContactsCollection.find();

export const getContactById = (contactId) =>
  ContactsCollection.findById(contactId);

export const createContact = (contactData) =>
  ContactsCollection.create(contactData);

export const updateContact = (contactId, contactData) =>
  ContactsCollection.findByIdAndUpdate(contactId, contactData, { new: true });

export const deleteContact = (contactId) =>
  ContactsCollection.findByIdAndDelete(contactId);
