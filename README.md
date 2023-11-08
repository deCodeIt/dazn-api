## Movie Lobby API  
Follow the below steps to setup the api.  

1. Create a `.env` file with the following  
```
PORT=8118
JWT_SECRET=1234
```

2. Install npm package dependencies using `npm install`  

3. To run test `npm run test -- -i 'movie.test.ts'`  

4. To run the api `npm run start`

### Documentation  
The documentation will be auto generated using and can be accessed using swagger express api endpoint at `/docs` i.e. http://localhost:8118/docs