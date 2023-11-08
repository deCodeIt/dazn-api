## Movie Lobby API  
Follow the below steps to setup the api.  

1. Create a `.env` file in the project root folder i.e. alongside `package.json` with the following  
```
PORT=8118
JWT_SECRET=1234
```

2. Install npm package dependencies using `npm install`  

3. To run test `npm run test -- -i 'movie.test.ts'`  

4. To run the api `npm run start`

### Documentation  
The documentation will be auto generated using and can be accessed using swagger express api endpoint at `/docs` i.e. http://localhost:8118/docs

#### Note  
In memory DB has been used via a HashMap as I've limited exposure to MongoDB. I've professional experience in AWS DynamoDB and Single Table Design but it has issues when you run it locally due to platform mismatch / java version mismatch / other ones. Hence I went ahead with an in memory DB.  
I did use an additional layer, MovieRepository, which can be updated seamlessly to fit with MongoDB, MySQL or DynamoDB without touching the main app.ts code. Using layers help in proper maintenance and extensibility.  
I've also used Swagger auto generated documentation from yaml