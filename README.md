# Final Project CS509 Fall24- Auction House

This is a stand-alone implementation of a React calculator. There are two branches in this repository (`main` and `aws`).

## Lisp Team: 
  -Sharvi Nitin Ghogale
  
  -Rohan Rana
  
  -Brian Rojas
  
  -Antonela Tamagnini

## Getting Started

Clone the repository with: `git clone https://github.com/yourusername/auction-house.git`. You’ll be on the main branch by default.

## Installing modules for `main`

To properly install everything, do the following:

```bash
npm install
npm install react@18 react-dom@18
npm install react-router-dom
npm install aws-sdk
npm install react-secure-storage
```

Then to launch, type:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the Auction House interface.

### Iteration 1: Use Cases

  Buyer Create Account

  Seller Create Account
  
  Buyer Close Account

  Seller Close Account
  
  Buyer Add Funds
  
  Seller Add Item

  Seller Review Item

  Seller Remove Item
  
  Seller Publish Item
  
  Seller Unpublish Item 

  

#### Landing Pages for Use Cases Iteration 1:

### Notes:

- When adding a new item, its status is 'inactive' by default. Seller is able to enter Name, Description, Image, Price, of the product. Once published, Start Date is set to current day, and End Date will be calculated from duration + Start Date.
- Item ID will be automatically created in incremental order by the database.
- (include pic of the database with items added)
- In the frontend, the user submits the Start Date and End Date in the form of date and it will converted into to seconds on the API, which is then stored in the form of int in the database.
