import * as Joi from 'joi';
import { ACLEnum } from '../enum/file.enum';
export const fileValidator = Joi.object({
  Path: Joi.string()
    .required()
    .error(() => new Error('please provide the Path. e.g /user/profile ')),
  ACL: Joi.string()
    .valid(...Object.values(ACLEnum))
    .required(),
  createdBy: Joi.string().required(),
  organization: Joi.string().required(),
});
