const request = require('request');
const parseString = require('xml2js-parser').parseString;
const firstCharLowerCase = require('xml2js-parser').firstCharLowerCase;
const processors = require('xml2js/lib/processors');



function EventorApi(config) {
    this.config = config;
}

EventorApi.DISCIPLINE_ORIEENTERING = 1;
EventorApi.DISCIPLINE_MTB_ORIEENTERING = 2;
EventorApi.DISCIPLINE_SKI_ORIEENTERING = 3;
EventorApi.DISCIPLINE_PRE_ORIEENTERING = 4;

EventorApi.EVENT_CLASSIFICATION_CHAMP = 1;
EventorApi.EVENT_CLASSIFICATION_NAT = 2;
EventorApi.EVENT_CLASSIFICATION_DIST = 3;
EventorApi.EVENT_CLASSIFICATION_LOCAL = 4;
EventorApi.EVENT_CLASSIFICATION_CLUB = 5;

EventorApi.CLASSTYPE_COMPETITION = 17;
EventorApi.CLASSTYPE_DEVELOPMENT = 18;
EventorApi.CLASSTYPE_OPEN = 19;



EventorApi.prototype.options = function(path) {
    return {
        url: this.config.eventorApiUrl + path,
        headers: {
            'ApiKey': this.config.apiKey
        }
    };
};

makeArray = function(obj) {
    return !Array.isArray(obj) ? [obj] : obj;
};

EventorApi.prototype.events = function(queryParams) {
    const options = this.options('events');
    options.qs = queryParams;

    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: false,
                mergeAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result && result.eventList && result.eventList.event) {
                let events =  (!Array.isArray(result.eventList.event)) ? [result.eventList.event] : result.eventList.event;
                resolve(events);
            } else {
                resolve([]);
            }

        });
    });
    });
};

EventorApi.prototype.entries = function(queryParams) {
    const options = this.options('entries');
    options.qs = queryParams;

    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: false,
                mergeAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result && result.entryList && result.entryList.entry) {
                resolve(result.entryList.entry);
            } else {
                resolve([]);
            }

        });
    });
    });
};

EventorApi.prototype.competitorCount = function(organisationIds, eventIds) {
    const options = this.options('competitorcount');
    options.qs = {organisationIds: organisationIds.join(), eventIds: eventIds.join()};

    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: false,
                mergeAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result && result.competitorCountList && result.competitorCountList.competitorCount) {
                resolve(makeArray(result.competitorCountList.competitorCount));
            } else {
                resolve([]);
            }

        });
    });
    });
};



EventorApi.prototype.starts = function(organisationId, eventId) {
    const options = this.options('starts/organisation');
    options.qs = {organisationIds: organisationId, eventId: eventId};

    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: false,
                mergeAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result && result.startList && result.startList.classStart) {
                resolve(makeArray(result.startList.classStart));
            } else {
                resolve([]);
            }

        });
    });
    });
};



EventorApi.prototype.results = function(organisationId, eventId) {
    const options = this.options('results/organisation');
    options.qs = {organisationIds: organisationId, eventId: eventId};

    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: false,
                mergeAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            if (result && result.resultList && result.resultList.classResult) {
                resolve(makeArray(result.resultList.classResult));

            } else {
                resolve([]);
            }

        });
    });
    });
};

EventorApi.prototype.persons = function(organisationId) {
    const options =this.options('persons/organisations/' + organisationId);

    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            console.log(body);
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result.personList.person);

        });
    });
    });
};

EventorApi.prototype.eventClasses = function(eventId) {
    const options = this.options('eventclasses');
    options.qs = {eventId: eventId};
    return new Promise(function(resolve, reject) {
        request(options, (err, res, body) => {
            if (err) {
                reject(err);
                return;
            }
            parseString(body, {
                explicitArray: false,
                ignoreAttrs: true,
                tagNameProcessors: [processors.firstCharLowerCase]
            }, (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(result.eventClassList.eventClass);

            });
        });
    });
};


module.exports = EventorApi;