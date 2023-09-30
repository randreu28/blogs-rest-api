# Blogs REST API

Hello! This is a Rest API based on Node. More specifically, express, mongoose and typescript. This project was made for the [FullstackOpen](https://fullstackopen.com/en/) course of the university of Helsinki. Feel free to check it out!

[Link to the particular chapter of the course](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2)

## Endpoints

GET /info/

GET /api/blogs/

POST /api/blogs/
{
"title": "string",
"author": "string",
"url": "string",
"likes": "number",
};

GET /api/blogs/:id/

DELETE /api/blogs/:id/
