const ConfigKey = Symbol('pike-config');

type AnyObj = { [key: string]: any };
type GlobString = string;
type RoutableClass = Function;
type RouteConfig = GlobString | RoutableClass;

export interface PikeAppConfig {
  /**
   * Port for the server to listen on
   *
   * @type {number}
   *
   * @defaultValue 3000
   */
  port: number;

  /**
   * Override options to pass into the fastify instance
   *
   * @type {fastify.Options}
   *
   * @defaultValue {}
   */
  fastify: {}

  /**
   * The working directory for the app.
   *
   * @type {string}
   *
   * @defaultValue process.cwd()
   */
  cwd: string;

  db: {

  }
  /**
   * Array of Route Controllers to be registered on app startup.
   * Array items can be the following format
   *
   * @type {string} a globstring to use to search for routes at startup
   * @type {class} a reference to a class decorated with the Route decorator
   *
   * @defaultValue ['**\/*.controller.{ts, js}']
   */
  controllers: RouteConfig[]
}

export type PikeAppConfigOptions = Partial<PikeAppConfig>;

const defaultConfig: PikeAppConfig = {
  port: 3000,
  db: {},
  cwd: process.cwd(),
  fastify: {},
  controllers: ['**/*.controller.{ts, js}']
};

const isObject = (obj: any) => typeof obj === 'object' && !(obj instanceof Array) && obj !== null;

export const buildConfig = (...sources: AnyObj[]): PikeAppConfig => {
  const obj: AnyObj = {};

  sources.forEach((source) => {
    for (const key in source) {
      const originalVal = obj[key];
      const newVal = source[key];
      if (typeof originalVal === 'undefined') {
        obj[key] = source[key];
      } else if (isObject(originalVal) && isObject(source)) {
        obj[key] = buildConfig(originalVal, newVal);
      }
    }
  });

  return obj as PikeAppConfig;
};

export const getConfig = (appInstance: any) => {
  let config = appInstance[ConfigKey];
  if (!config) {
    config = defaultConfig;
  }

  return config as PikeAppConfig;
};

export const setConfig = (appInstance: any, configToSet: Partial<PikeAppConfig>) => {
  const config = getConfig(appInstance);
  const newConfig = buildConfig({}, configToSet, config);

  appInstance[ConfigKey] = newConfig;

  return newConfig;
};
