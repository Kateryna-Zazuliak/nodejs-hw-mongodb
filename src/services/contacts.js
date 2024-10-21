import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  filter,
}) => {
  const skip = page > 0 ? (page - 1) * perPage : 0;
  const contactQuery = ContactsCollection.find();

  if (filter.type) {
    contactQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }
  const [total, contacts] = await Promise.all([
    ContactsCollection.countDocuments(contactQuery),
    contactQuery
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(perPage),
  ]);
  const totalPages = Math.ceil(total / perPage);
  return {
    contacts,
    page,
    perPage,
    totalItems: total,
    hasNextPage: totalPages - page > 0,
    hasPreviousPage: page > 1,
  };
};

export const getContactById = (contactId) =>
  ContactsCollection.findById(contactId);

export const createContact = (contactData) =>
  ContactsCollection.create(contactData);

export const updateContact = (contactId, contactData) =>
  ContactsCollection.findByIdAndUpdate(contactId, contactData, { new: true });

export const deleteContact = (contactId) =>
  ContactsCollection.findByIdAndDelete(contactId);
