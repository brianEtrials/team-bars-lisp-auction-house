# Final Project CS509 Fall24- Auction House

## Lisp Team: 
  -Sharvi Nitin Ghogale
  
  -Rohan Rana
  
  -Brian Rojas
  
  -Antonela Tamagnini

## Getting Started

Clone the repository with: `[git clone https://github.com/yourusername/auction-house.git](https://github.com/brianEtrials/team-bars-lisp-auction-house.git)`. You’ll be on the main branch by default.

## Installing modules for `main`

To properly install everything, do the following:

```bash
npm install
npm install react@18 react-dom@18
npm install react-router-dom
npm install react-secure-storage
npm install bootstrap
```

Then to launch, type:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Auction House interface.

### Iteration 1: Use Cases (10)

  Buyer:
  
    -Create Account

    -Login to Account

    -Add Funds

  Seller:
  
    -Create Account

    -Login to Account

    -Add Item

    -Review Items

    -Remove Item

    -Publish Item

    -Unpublish Item

### Iteration 2: Use Cases (10)

  Buyer:
  
    -Close Account

    -View Item

  Seller:
  
    -Close Account
    
    -Request Unfreeze Item
    
    -Archive Item

  Customer:
  
    -Search/Filter Items

    -Sort Items

    -View Item

  Admin:
  
    -Freeze Item

    -Unfreeze Item
    

#### Landing Page: http://auctionlisp.s3-website-us-east-1.amazonaws.com

### Info for use cases testing:

- Credentials for login buyer: username:testbuyer, password:test
- Credentials for login seller: username:testseller, password:test
- Credentials for login admin: username:admin, password:admin24 (login inside 'Sign in' page)
- Item Name should always be unique
- The items for testing 'View Item' are Laptop and Smartphone (login with credentials for 'testbuyer')
