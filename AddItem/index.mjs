import mysql from 'mysql';

// Set up a connection pool to the database
const pool = mysql.createPool({
    host: "auctionhousedb.crc48ss6s75k.us-east-1.rds.amazonaws.com",
    user: "auctionAdmin",
    password: "bars:auction",
    database: "auction_data"
});

// Function to add an item to the database
const addItem = (itemName, itemDecrip, itemImage, itemPrice, itemStartDate, itemEndDate, itemDuration, itemAction) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO items (iName, iDescription, iImage, iStartingPrice, iStartDate, iEndDate, duration, iStatus)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
        pool.query(sql, [itemName, itemDecrip, itemImage, itemPrice, itemStartDate, itemEndDate, itemDuration, itemAction], (error, results) => {
            if (error) return reject(error);
            return resolve(results);
        });
    });
};

// Main handler function
export const handler = async (event) => {
    // Parse and prepare data from the event
    let iName = String(event.iName);
    let iDescription = String(event.iDescription);
    let iImage = String(event.iImage);
    let iStartingPrice = Number(event.iStartingPrice);
    // Convert startDate from a date string to a Unix timestamp (in seconds)
    let iStartDate = Math.floor(new Date(event.iStartDate).getTime() / 1000);
    let duration = Number(event.duration) * 24 * 60 * 60; // Convert days to seconds
    let iEndDate = iStartDate + duration;
    // Set iStatus to "inactive" by default
    let iStatus = "inactive";

    // Log the item data before inserting into the database
    console.log('Inserting item:', { iName, iDescription, iImage, iStartingPrice, iStartDate, iEndDate, duration, iStatus });

    try {
        // Add the item to the database
        const result = await addItem(iName, iDescription, iImage, iStartingPrice, iStartDate, iEndDate, event.duration, iStatus);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Item added successfully",
                itemId: result.insertId // Capture and return the ID of the newly inserted item
            })
        };
    } catch (error) {
        // Handle possible errors during database interaction
        console.error('Database error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Failed to add item",
                error: error.message
            })
        };
    }
};
