
//  The purpose of this file is to initially add some data into MongoDB database
//  in the future, below structure will be updated according to our detailed business logic
//  When the frontend is ready(which means in the future, the data add/update/delete will be triggered at the frontend),
//  this file can be deleted

export default [
    {
        id: 1,
        question : "Javascript is an _______ language",
        options : [
            'Object-Oriented',
            'Object-Based',
            'Procedural',
        ]
    },
    {
        id: 2,
        question : "Following methods can be used to display data in some form using Javascript",
        options : [
            'document.write()',
            'console.log()',
            'window.alert()',
        ]
    },
    {
        id: 3,
        question : "When an operator value is NULL, the typeof returned by the unary operator is:",
        options : [
            'Boolean',
            'Undefined',
            'Object',
        ]
    },
    {
        id: 4,
        question : "What does the toString() method return?",
        options : [
            'Return Object',
            'Return String',
            'Return Integer'
        ]
    },
    {
        id: 5,
        question : "Which function is used to serialize an object into a JSON string?",
        options : [
            'stringify()',
            'parse()',
            'convert()',
        ]
    }
];

export const answers = [0, 1, 2, 1, 0];

// default export value is an array [],  inside the array, there are 5 objects, Each object represents a single quiz question.