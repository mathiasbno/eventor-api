# Eventor API
## Usage

```javascript
const EventorApi = require('eventor-api');
const eventorApi = new EventorApi({
        eventorApiUrl: 'http://eventor.orientering.se/api/',
        apiKey: <YOUR_API_KEY>
    });
```
### Get Persons
```javascript
let organisationId = '63';
eventorApi.persons(organisationId)
            .then(persons => {
                    console.log(persons);
                })
            .catch(e => console.log(e));



