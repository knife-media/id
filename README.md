# Social services for knife.media

Backend service for cloud comments. Used for oauth authorization of users and storing their comments. All fronted logic is implemented in custom theme [module](https://github.com/knife-media/theme/blob/master/src/scripts/bundle/id-handler.js).

## Installation

1. Create mysql database and upload `database.sql` 
2. Install required npm modules using `yarn update`
3. Copy `.env.example` to `.env` and replace credentials
3. Start application using `node server.js`

If you wish to issue a pull request for code here, please do so on https://github.com/knife-media/id

![comments screenshot](https://user-images.githubusercontent.com/454185/91660107-d6764000-eadc-11ea-8250-f16b7ebbe27f.jpg)
