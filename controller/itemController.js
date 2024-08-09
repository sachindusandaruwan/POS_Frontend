import { saveItem ,getAllItems,remove,update} from "../model/itemModel.js";
$(document).ready(function(){

    clearTable();
    loadAllItems();
});

// clearTable();
// loadAllItems();

export async function loadAllItems(){
    let items = await getAllItems();
     console.log("huuu huuu");
    items.forEach(
        
        item => {
            // console.log("moda yakek")
            console.log(item)
            // alert("mekata awoo")
            $('#item-table').append(`<tr><td>${item.itemCode}</td><td>${item.itemName}</td><td>${item.itemQty}</td><td>${item.unitPrice}</td></tr>`);
            
        }
    );
}


///////////////////////////////////////////////////////////
export function clearTable(){
    let table = document.getElementById("itemSection").querySelector(".tableDive");
    let tbody = table.querySelector("tbody");
    tbody.innerHTML = "";
}
/////////////////////////////////////////////////////////////////

function clearField(){
    $('#itemSection #item_code').val("");
    $('#itemSection #item-name').val("");
    $('#itemSection #item_qty').val("");
    $('#itemSection #unitPrice').val("");

    $('#itemSection .itemCodeError').text("");
    $('#itemSection .invalidItemName').text("");
    $('#itemSection .invalidItemQty').text("");
    $('#itemSection .invalidItemUnitPrice').text("");    
}

/////////////////////---------save------//////////////////////////////////

function saveItemDetails(){
    
    let itemCode = $('#itemSection #item_code').val();
    let itemName = $('#itemSection #item-name').val();
    let itemQty = $('#itemSection #item_qty').val();
    let unitPrice = $('#itemSection #unitPrice').val();

   
    let itemDetails={
        itemCode : itemCode,
        itemName : itemName,
        itemQty : itemQty,
        unitPrice : unitPrice
    }

    if(isItemValidated(itemDetails)){
        console.log(itemDetails.itemCode,itemDetails.itemName,itemDetails.itemQty,itemDetails.unitPrice)
        saveItem(itemDetails.itemCode,itemDetails.itemName,itemDetails.itemQty,itemDetails.unitPrice);
        clearTable();
        loadAllItems();
        clearField();   
    }

   

}
$('#save-Item').click(function(){
    saveItemDetails();
});



function isItemValidated(itemDetails){
    let valid = true;
    if (itemDetails.itemCode.trim() === ""){
        valid = false;
     
        $('#itemSection .itemCodeError').text('Item Code is required');

        } else if (!(/^I-\d{4}$/).test(itemDetails.itemCode)) {
        valid = false;
      
        $('#itemSection .itemCodeError').text('Invalid Item Code');
        }else if(isItemExist(itemDetails.itemCode).then(
            (flag)=> {
                if(!flag){
                    valid=false;
                    alert('Item Code already exist');
                }
            }
        )){

        }
        else{ 
            $('#itemSection .itemCodeError').text('Item Code already exist');
    } 

    if (itemDetails.itemName.trim() === "") {
        valid = false;
        // Display error message for empty item name
        $('#itemSection .invalidItemName').text('Item Name is required');
    } else {
        $('#itemSection .invalidItemName').text('');
    }

    if (itemDetails.itemQty.trim() === "") {
        valid = false;
        // Display error message for empty item Qty
        $('#itemSection .invalidItemQty').text('Item Qty is required');
    } else if (!(/^[0-9]+$/).test(itemDetails.itemQty)) {
        valid = false;
        // Display error message for invalid item Qty
        $('#itemSection .invalidItemQty').text('Invalid Item Qty');
    } else {
        $('#itemSection .invalidItemQty').text('');
    }

    if (itemDetails.unitPrice.trim() === "") {
        valid = false;
        $('#itemSection .invalidItemUnitPrice').text('Item Unit Price is required');
    } else {
        $('#itemSection .invalidItemUnitPrice').text('');
    }

    return valid;
}

async function isItemExist(itemCode){

    let items = await getAllItems();
    const item=items.find(i => i.id === itemCode);
    if(item==null){
        return true;
    }
    else{
        return false;
    }

    // let items = getAllItems();
    // let itemExist = false;
    // items.forEach(
    //     item => {
    //         if(item.itemCode === itemCode){
    //             itemExist = true;
    //         }
    //     }
    // );
    // return itemExist;
}

////////////////////////////////////////////////////////////////////////

// search item
//set values to the input fields when click the table row
document.getElementById("item-table").addEventListener("click",function(event){
    let target = event.target;
   
        let itemcode = target.parentElement.cells[0].textContent;
        let itemName = target.parentElement.cells[1].textContent;
        let itemQty = target.parentElement.cells[2].textContent;
        let itemUnitPrice = target.parentElement.cells[3].textContent;

        document.getElementById("item_code").value = itemcode;
        document.getElementById("item-name").value = itemName;
        document.getElementById("item_qty").value = itemQty;
        document.getElementById("unitPrice").value = itemUnitPrice;
    
});

////////////////////-----------delete---------------------////////////////////////

 async function deleteItem() {
    let itemcode = $('#itemSection #item_code').val();
    
    await remove(itemcode);
    clearTable();
    loadAllItems();
    clearField();
    
}

$('#remove-Item').click(function(){
    deleteItem();
});

////////////////////-----------update---------------------////////////////////////

async function updateItem(itemCode,itemName,itemQty,unitPrice){

    try {
        if (confirm("Are you sure you want to update this customer?")) {
          await update(itemCode, itemName, itemQty,unitPrice );
          alert("ho ho ho")
          clearTable();
          loadAllItems();
          clearField();
        }
      } catch (error) {
        console.error(error);
      }
   

    
    
       
    

    // let itemCode = $('#itemSection #item_code').val();
    // let items = getAllItems();
    // let index = null;
    // for(let i=0; i<items.length; i++){
    //     if(itemCode === items[i].itemCode){
    //             alert("kiiiii")
    //         index = i;
    //         alert(index+"lkjkh")
    //         break;
    //     }
    // }
    // update(index, 
    //     {
    //         itemCode : document.getElementById('item_code').value,
    //         itemName : document.getElementById('item-name').value,
    //         itemQty : document.getElementById('item_qty').value,
    //         itemUnitPrice : document.getElementById('unitPrice').value
    //     }
       
    // );
    
    
    
}

$('#update-Item').click(function(){

    let itemCode = $('#itemSection #item_code').val();
    let itemName = $('#itemSection #item-name').val();
    let itemQty = $('#itemSection #item_qty').val();
    let unitPrice = $('#itemSection #unitPrice').val();


    let itemDetails={
        itemCode : itemCode,
        itemName : itemName,
        itemQty : itemQty,
        unitPrice : unitPrice
    }

    if(isItemValidated(itemDetails)){
        updateItem(itemDetails.itemCode,itemDetails.itemName,itemDetails.itemQty,itemDetails.unitPrice);
    }

    
});