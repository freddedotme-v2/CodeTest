## CodeTest

#### Server

```
npm install
GQL_ENDPOINT=<url> npm run start
```

#### Client
```
curl -H 'x-api-key: <key>' -X GET http://localhost:3000/item
curl -H 'x-api-key: <key>' -X GET http://localhost:3000/item/<id>
```

#### Future improvements

* Generate types from GraphQL files to increase readability and scalability, not something I've done before but curious to learn.