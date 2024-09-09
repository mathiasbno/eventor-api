const request = require("request");
const parseString = require("xml2js-parser").parseString;
const processors = require("xml2js/lib/processors");

function makeArray(obj) {
  return !Array.isArray(obj) ? [obj] : obj;
}

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

EventorApi.prototype.options = function (path, qs) {
  let url = this.config.eventorApiUrl + path;
  if (qs) url += `?${qs}`;

  return {
    url: url,
    options: {
      method: "GET",
      mode: "no-cors",
      credentials: "include",
      headers: {
        ApiKey: this.config.apiKey,
      },
    },
  };
};

EventorApi.prototype.events = async function (queryParams) {
  const qs = new URLSearchParams(queryParams);
  const options = this.options("events", qs);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.eventList && result.eventList.event) {
            let events = !Array.isArray(result.eventList.event)
              ? [result.eventList.event]
              : result.eventList.event;
            resolve(events);
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.entries = async function (queryParams) {
  const qs = new URLSearchParams(queryParams);
  const options = this.options("entries", qs);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.entryList && result.entryList.entry) {
            resolve(result.entryList.entry);
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.competitorCount = async function (
  organisationIds,
  eventIds
) {
  const qs = new URLSearchParams({
    organisationIds: organisationIds.join(),
    eventIds: eventIds.join(),
  });
  const options = this.options("competitorcount", qs);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (
            result &&
            result.competitorCountList &&
            result.competitorCountList.competitorCount
          ) {
            resolve(makeArray(result.competitorCountList.competitorCount));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.starts = async function (organisationId, eventId) {
  const qs = new URLSearchParams({
    organisationIds: organisationId,
    eventId: eventId,
  });
  const options = this.options("starts/organisation", qs);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.startList && result.startList.classStart) {
            resolve(makeArray(result.startList.classStart));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.orgResults = async function (organisationId, eventId) {
  const qs = new URLSearchParams({
    organisationIds: organisationId,
    eventId: eventId,
  });
  const options = this.options("results/organisation", qs);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.resultList && result.resultList.classResult) {
            resolve(makeArray(result.resultList.classResult));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.results = async function (queryParams) {
  const qs = new URLSearchParams(queryParams);
  const options = this.options("results/event", qs);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: false,
          mergeAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.resultList && result.resultList.classResult) {
            resolve(makeArray(result.resultList.classResult));
          } else {
            resolve([]);
          }
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.personsByOrg = async function (organisationId) {
  const options = this.options("persons/organisations/" + organisationId);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }

          resolve(result);
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.person = async function (personId) {
  const options = this.options("competitor/" + personId);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result);
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.organisation = async function (organisationId) {
  const options = this.options("organisation/" + organisationId);

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.organisation);
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.organisations = async function () {
  const options = this.options("organisations");

  try {
    const response = await fetch(options.url, options.options);
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.organisationList.organisation);
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

EventorApi.prototype.eventClasses = async function (eventId) {
  const options = this.options("eventclasses");
  options.qs = { eventId: eventId };

  try {
    const response = await fetch(
      options.url + "?" + new URLSearchParams(options.qs),
      options.options
    );
    const body = await response.text();
    return new Promise((resolve, reject) => {
      parseString(
        body,
        {
          explicitArray: false,
          ignoreAttrs: true,
          tagNameProcessors: [processors.firstCharLowerCase],
        },
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(result.eventClassList.eventClass);
        }
      );
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = EventorApi;
