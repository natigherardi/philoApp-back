#ENDPOINTS

REGISTER

- POST => .../user/register => Registration of a user. Payload with name, username and password

LOG IN

- POST => .../user/login => Log in of a user. Payload with username and password

PUBLIC LIST

- GET => .../quotes => Get all the public quotes

CREATE QUOTE

- POST => .../quotes => Create a quote. Payload with required quote, author and image properties, and optional school, book and year properties

DETAIL QUOTE

- GET => .../quotes/:quoteId => Get a specific quote by it's ID

PRIVATE LIST

- GET => .../quotes/myquotes/:userId => Get the quotes added and created by the user through it's Id

DELETE

- DEL => .../quotes/myquotes/:quoteId => Delete a quote (only it's user is able to do it)

MODIFY

- PATCH => .../quotes/myqutoes/:quoteId => Modify any property of an existing quote (only it's user is able to do it)
