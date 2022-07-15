import * as Joi from 'joi';
import { EnvConfigEnum } from './env.enum';

export const envConfigValidator = Joi.object().keys({
  [EnvConfigEnum.PORT]: Joi.number().required(),
  [EnvConfigEnum.APP_AWS_ACCESS_KEY_ID]: Joi.string().required(),
  [EnvConfigEnum.APP_AWS_REGION]: Joi.string().required(),
  [EnvConfigEnum.APP_AWS_SECRET_ACCESS_KEY]: Joi.string().required(),
  [EnvConfigEnum.APP_AWS_BUCKET]: Joi.string().required(),
});
