const jwt_decode =  require('jwt-decode')

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTU4MmY5Zjk2MTY0ZDAwMTY0YzAzMTEiLCJyb2xlIjoidXNlciIsImlhdCI6MTYzMzE2OTM1MX0.v2ZMrYbdVsHeG8QPmaP-G65LW3O_ATv9AOjg8Hi1vEg"

var decoded = jwt_decode(token);
console.log(decoded.role);
