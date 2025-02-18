import * as crypto from 'crypto';

export const hashPassword = (password: string): string => {
  const hmac = crypto.createHmac('sha512', 'dkasmdkasdoamsodmaodlm&%saasdsaddaslsdosdindian');
  hmac.update(password);
  return hmac.digest('hex');
};