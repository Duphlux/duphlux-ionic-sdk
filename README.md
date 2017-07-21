# Duphlux Ionic 3 SDK

A fully working Ionic 3 starter for call based authentication requests with Duphlux.com

# First, get a duplux account
    - Register an account with https://duphlux.com/
    - Read documentation at https://duphlux.com/documentation

# Second, setup

  - Clone the repo to a folder
  - run `npm install` in the repo
  - Grab a cup of coffee...
  - Open src/pages/home/home.ts - edit your parameters:
  `timeToLive : number = 10; // Number of seconds before request expires`
  `youOwnPhoneNumber : string = "+00000000000";    // Your own phone number.`
  `transactionReference : number = this.getRandomInt(10000,100000);  // supply yours or use a random value`
  `duphluxToken : string = '34792cda48f4f90736d3faed467503568b347ee0'; // Test-only api-key - get yours at https://duphlux.com`
  - Run `ionic serve`

# Testing in the browser
head to https://duphlux.com/documentation#simulate-call to simulate a call authentication in the browser, making testing with `ionic serve` easy

# Documentation
  - https://duphlux.com/documentation
