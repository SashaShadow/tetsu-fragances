import log4js from 'log4js';

log4js.configure({
    appenders: {
      miLoggerConsole: { type: "console" },
      warnFile: { type: 'file', filename: 'warn.log' },
      errorFile: { type: 'file', filename: 'error.log' }
    },
    categories: {
      default: { appenders: ["miLoggerConsole"], level: "trace" },
      consola: { appenders: ["miLoggerConsole"], level: "debug" },
      archivo: { appenders: ["warnFile"], level: "warn" },
      archivo2: { appenders: ["errorFile"], level: "error" },
      warnOnly: { appenders: ["miLoggerConsole", "warnFile"], level: "warn"},
      errorOnly: { appenders: ["miLoggerConsole", "errorFile"], level: "error"}
    }
   })

export const logger = log4js.getLogger();
export const loggerWarn = log4js.getLogger("warnOnly");
export const loggerError = log4js.getLogger("errorOnly")