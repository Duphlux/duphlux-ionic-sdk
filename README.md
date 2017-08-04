# Duphlux Ionic 3 SDK

A fully working Ionic 3 starter for call based authentication requests with Duphlux.com

# First, get a duplux account
    - Register an account with https://duphlux.com/
    - Read documentation at https://duphlux.com/documentation

# Second, setup

  - Clone the repo to a folder
  - run `npm install` in the repo
  - Grab a cup of coffee...
  - Open src/pages/home/home.ts and edit your parameters. For option descriptions, go to https://duphlux.com/documentation
  `
DuphluxSettings = {
    timeout : 60,
    phone_number :  "+00000000000",
    transaction_reference : this.getRandomInt(10000,100000),
    redirect_url : "https://yourdomain.com"
  }
`
  - Run `ionic serve`

# Testing in the browser
head to https://duphlux.com/documentation#simulate-call to simulate a call authentication in the browser, making testing with `ionic serve` easy

# Testing on your phone
- Navigate to `src/providers/duphlox-io-service.ts` and edit this line with your own token (Free on signup at duphlux.com):
`duphluxToken : string = '34792cda48f4f90736d3faed467503568b347ee0'; //get yours at https://duphlux.com`
- run in your terminal `ionic cordova run android`

# Documentation
  - https://duphlux.com/documentation
