import { Router } from 'express';
import {
  getContactByIdController,
  getContactsController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { auth } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();
contactsRouter.use(auth);
contactsRouter.get('/', ctrlWrapper(getContactsController));
contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(getContactByIdController),
);
contactsRouter.post('/', ctrlWrapper(createContactController));
contactsRouter.patch(
  '/:contactId',
  isValidId,
  ctrlWrapper(updateContactController),
);
contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(deleteContactController),
);

export default contactsRouter;
