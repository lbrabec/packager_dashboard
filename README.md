## Packager Dashboard

Packager Dashboard displays useful information for a Fedora packager. That includes open bugs, proposed updates, open pull requests, build failures and others.

To try Packager dashboard, see the [public instance](https://packager.fedorainfracloud.org). As an example, you can display the output for [frantisekz](https://packager.fedorainfracloud.org/frantisekz) or [churchyard](https://packager.fedorainfracloud.org/churchyard).

### How to run

Packager Dashboard uses [Oraculum](https://pagure.io/fedora-qa/oraculum) as backend.

Clone Oraculum, change to its directory, install dependencies and run:
```
$ DEV=true python3 runapp.py
```
Open another terminal window and run:
```
$ DEV=true celery -A oraculum.celery_app worker
```

Clone this repo, change to its directory, install dependencies and start the frontend server:
```
$ git clone https://pagure.io/fedora-qa/packager_dashboard.git
$ cd packager_dashboard
$ yarn install
$ yarn start
```

If browser didn't open, go to [http://localhost:3000](http://localhost:3000)

If you are running Oraculum yourself or using other than production one, change `API` accordingly in `public/env.js`

