# Currency Exchange

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

`npm i` to initialise the project

`npm start` to run the project

## Pages
### Login
- The initial page you see when you run the project
- Input fields for email and password
- CTA button to log in
- Button / link to go to “Create User”

![Login](/screenshots/login.png)

### Create User
- Input fields for email, password and confirm password
- CTA button to create user 
- Button / link to go to “Log in”

![CreateUser](/screenshots/create-user.png)

### Home
- If first name and last name are set “Hello FirstName, your account balances are as per bellow:” otherwise “You should set your name in the Profile section. Your account balances are as per bellow:”
- List of available balances, with currency flag, the currency code and the amount in 2dp format
- Button / link to exchange currency 
- View profile button / link

![CreateUser](/screenshots/home.png)

### Currency Exchange
- Text “Select what you want to sell”
- Dropdown with list of available currencies to sell 
- Insert amount filed
- Dropdown with list of available to buy currencies 
- Field that will show the amount they will receive
- CTA button to exchange currency. Should be disabled if: sell amount is empty or equal to 0.00
- On Success show home page
- On Error show error message and stay on the same view

![CreateUser](/screenshots/exchange5.png)

### Profile
- First name editable field
- Last name editable field
- Date of birth editable field
- CTA button to update information, should be disabled if: information wasn’t changed or information is not in valid format
- Home button / link

![profile](/screenshots/profile2.png)

## Known Issues
- After the access token is refreshed once, the token refresh api fails if a token refresh is attempted again.
