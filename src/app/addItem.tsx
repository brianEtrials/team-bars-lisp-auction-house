'use client';

import Image from "next/image";
import React, { useState } from 'react';

export default function addTtemPage() {

    function addItem(){
        const table = document.getElementById("itemtable") as HTMLTableElement;
        // if (table instanceof HTMLTableElement) {
        const row = table.insertRow()
        // }
        // else{
        //   console.error("Not present")
        //   }
        }
        
    return(
    <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    <div className="flex flex-col items-center justify-center min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] space-y-8">
    <div>
      <table id="itemtable" >
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Image</th>
            <th>Price</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>
        {/* <tbody> */}
          {/* rows will be dynamically created based upon the data in database */}
        {/* </tbody> */}
      </table>
    </div>
    <div className="add-item">
        <button className="add-item-icon" onClick={() => addItem()}>Click to add new items</button>
        {/* <span>Click to add new items</span> */}
      </div>
      </div>
  </main>
 );
}