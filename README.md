# KANBAN API  - backend de l'application
This repo contains all the source code to run the micro API for the sports analytics dashboard SportSee.

## Clonez le projet
``` 
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

## lancer l'app 

### Installez les packages npm (décrits dans `package.json`) :

``` 
$ npm install
```


### lancer le server

``` 
$ npm run dev
```

## ENDPOINTS
l'api est disponible sur le port 5058

http://localhost:5058/api/v1/kanbans
http://localhost:5058/api/v1/products
http://localhost:5058/api/v1/requests
http://localhost:5058/api/v1/orders


### Importer des données dans la BD

``` 
$ node seeder -i
```
### Vider la Base de donées

``` 
$ node seeder -i
```