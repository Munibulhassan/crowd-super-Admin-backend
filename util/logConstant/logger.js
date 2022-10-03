const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;
const moment = require("moment");

const log = (data) => {
    const fileName = moment().format("YYYY-MM-DD");
    return createLogger({
        level: 'debug',
        format: combine(
            timestamp({ format: "DD-MM-YYYY" }),
            json(),
        ),

        defaultMeta: { data },
        transports: [
            new transports.Console(),
            new transports.File({
                filename: `./log/app.log.${fileName}.log`,
            })
        ],
    });
}

const proLogger = () => {
    return {
        log: (msg, data, type) => {
            let logger = log(data)
            if (type) logger.log(type, msg);
            else logger.info(msg)
        }
    }
}

module.exports = proLogger();