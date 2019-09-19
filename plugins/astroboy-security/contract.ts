import { IMiddlewareOptions } from '../../definitions/config';

export interface ICsrfOptions {
  env: string[];
  excluded: string[];
  csrfSecretName: string;
  csrfTokenName: string;
  saltLength: number;
  secretLength: number;
  maxAge: number;
}

export interface IHstsOptions {
  maxAge: number;
  includeSubDomains?: boolean;
  preload?: boolean;
}

export interface IAstroboySecurityPluginMiddlewareExtends {
  'astroboy-security-csrf': IMiddlewareOptions<Partial<ICsrfOptions>>;
  'astroboy-security-cto': IMiddlewareOptions<string>;
  'astroboy-security-frameOptions': IMiddlewareOptions<string>;
  'astroboy-security-hsts': IMiddlewareOptions<IHstsOptions | number>;
  'astroboy-security-p3p': IMiddlewareOptions<{ value?: string } | string>;
  'astroboy-security-xss': IMiddlewareOptions<any>;
  'astroboy-security-xssProtection': IMiddlewareOptions<string>;
}
