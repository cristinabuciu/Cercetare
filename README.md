# Run locally

Make sure you have installed all the Python dependencies that are mentioned in the `requirments.txt` for the backend 
and `Node@13.13.0` and `Npm@6.14.4` for the frontend.

- Start the database

```bash
cd DataDeposit/server
sudo docker-compose up
```

Once the database is running, the dataset mapping needs to be added by running the curl command mentioned in `startDb` file.
Also, the database must be initialised with the default data by running the `DataDeposit/server/initDB/init.py`.

- Start the server

```bash
cd DataDeposit/server
python3 server.py
```

- Start the CKAN instance

Install and run CKAN following the [tutorial](https://blog.thenets.org/install-ckan-using-docker/). 
Once the CKAN instance is running, the service account and the organisation need to be created via CKAN UI.
Also, the associated properties need to be updated - `application_properties.py`.

> [OPTIONAL] Add the harvesting extension ( [link](https://github.com/ckan/ckanext-harvest) ) and run the harvesting jobs ( [link](https://github.com/datopian/ckan-ng-harvest.git) ).
> Useful additional details can be found in `startCkan` file.

- Start the UI

```bash
cd DataDeposit/static
npm install
npm run watch
```

The application can be accessed at: `http://localhost:41338`.