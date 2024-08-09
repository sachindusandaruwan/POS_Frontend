import { getAllCustomers } from "../model/customerModel.js";
import { getAllItems, update as updateItem } from "../model/itemModel.js";
import { getAllOrders, saveOrder } from "../model/orderModel.js";

var itemQty;

var tempItem;
let getItems = [];

$(document).ready(function() {
    // alert("11111 hu ")
    refresh();
});

export function refresh() {
    $('#ordersSection #OrderId').val(generateId());
    $('#ordersSection #date-picker').val(new Date().toISOString().split('T')[0]);
    // alert("mekada mulin enne")
    loadCustomer();
    loadItems();
}

function loadCustomer() {
    let allCustomers = getAllCustomers();
    let customerCmb = $('#customer-select-field');
    let option = [];
    option.unshift('');
    for (let i = 0; i < allCustomers.length; i++) {
        option.push(allCustomers[i].customerId);
    }

    $.each(option, function(index, value) {
        customerCmb.append($('<option>').val(value).text(value));
    });
}

$('#customer-select-field').change(function() {
    let customer = getAllCustomers().find(c => c.customerId === $(this).val());
    if (customer) {
        $('#ordersSection #CustomerId').val(customer.customerId);
        $('#ordersSection #CustomerName').val(customer.customerName);
        $('#ordersSection #CustomerSalary').val(customer.customerSalary);
        $('#ordersSection #CustomerAddress').val(customer.customerAddress);
    }
});

function loadItems() {
    let allItems = getAllItems();
    
    let itemCmb = $('#item-select-field');
    let option = [];
    option.unshift('');
    for (let i = 0; i < allItems.length; i++) {
        
        option.push(allItems[i].itemCode);
    }

    $.each(option, function(index, value) {
        itemCmb.append($('<option>').val(value).text(value));
    });
}

$('#item-select-field').change(function() {
    let item = getAllItems().find(i => i.itemCode === $(this).val());
    if (item) {
        itemQty = item.itemQty;
        $('#ordersSection #ItemCode').val(item.itemCode);
        $('#ordersSection #ItemName').val(item.itemName);
        $('#ordersSection #ItemPrice').val(item.itemUnitPrice);
        $('#ordersSection #ItemQty').val(item.itemQty);
        tempItem = {
            itemCode: item.itemCode,
            itemName: item.itemName,
            itemPrice: item.itemUnitPrice,
            itemQty: item.itemQty
        };
    }
});

function generateId() {
    let orders = getAllOrders();
    if (orders.length === 0) {
        return 'OD01';
    } else {
        let orderId = orders[orders.length - 1].orderId;
        let number = extractNumber(orderId);
        number++;
        return 'OD0' + number;
    }
}

function extractNumber(id) {
    var match = id.match(/OD(\d+)/);
    if (match && match.length > 1) {
        return parseInt(match[1], 10);
    }
    return null;
}

function clear(tableCount) {
    if (tableCount === 1) {
        $('#ordersSection #ItemCode').val('');
        $('#ordersSection #ItemName').val('');
        $('#ordersSection #ItemPrice').val('');
        $('#ordersSection #ItemQty').val('');
        $('#ordersSection #OrderQuantity').val('');
        // $('#ordersSection .SubTotal').text('');
        $('#ordersSection #Cash').val('');
        $('#ordersSection .Total').text('');
        $('#ordersSection #Discount').val('');
        $('#ordersSection #item-select-field').val('');
    } else {
        $('#ordersSection #CustomerId').val('');
        $('#ordersSection #CustomerName').val('');
        $('#ordersSection #CustomerAddress').val('');
        $('#ordersSection #CustomerSalary').val('');
        $('#ordersSection #ItemCode').val('');
        $('#ordersSection #ItemName').val('');
        $('#ordersSection #ItemPrice').val('');
        $('#ordersSection #ItemQty').val('');
        $('#ordersSection #OrderQuantity').val('');
    }
}

$('#ordersSection .add-item-button').click(function() {
    if ($('#ordersSection .add-item-button').text() === 'delete') {
        dropItem();
    } else {
        let getItem = {
            itemCode: tempItem.itemCode,
            itemName: tempItem.itemName,
            itemPrice: tempItem.itemPrice,
            itemQty: parseInt($('#ordersSection #OrderQuantity').val(), 10),
            total: parseFloat($('#ordersSection #ItemPrice').val()) * parseInt($('#ordersSection #OrderQuantity').val(), 10),
            removeButton: '<button class="remove-item-button" onclick="removeItem(\'' + tempItem.itemCode + '\')">Remove</button>'
        };

        let orderQty = parseInt($('#ordersSection #OrderQuantity').val(), 10);

        if (itemQty >= orderQty) {
            if ($('#ordersSection #CustomerId').val() !== '' && $('#ordersSection #CustomerName').val() !== null) {
                if (orderQty > 0) {
                    let item = getItems.find(I => I.itemCode === getItem.itemCode);

                    try {

                        if (!item) {
                            getItems.push(getItem);
                            loadTable();
                            clear(1);
                            setTotal();
                        } else {
    
                            item.itemQty += orderQty;
                            loadTable();
                            clear(1);
                            setUpdatedTotal(item);
                        }
                        
                    } catch (error) {
                        throw error;
                    }finally{
                        updateTheItemQty(getItem.itemCode,orderQty);
                    }

                   
                } else {
                    alert('Invalid Quantity');
                }
            } else {
                alert('Invalid Customer');
            }
        } else {
            alert('Not Enough Quantity');
        }
    }
});

function updateTheItemQty(itemCode,orderQty){
    let item = getAllItems().find(I => I.itemCode === itemCode);
    if (item) {
        item.itemQty -= orderQty;
        let index = getAllItems().findIndex(I => I.itemCode === itemCode);
        if (index !== -1) {
            updateItem(index, item);
        }
    }
}

function setUpdatedTotal(item) {
    let total = item.itemPrice * item.itemQty;
    item.total = total;
    loadTable();
    setTotal();
}



function loadTable() {
    $('#ordersSection #order-table-body').empty();
    for (let i = 0; i < getItems.length; i++) {
        $('#ordersSection #order-table-body').append(
            `<tr> 
            <td>${getItems[i].itemCode}</td>
            <td>${getItems[i].itemName}</td>
            <td>${getItems[i].itemPrice}</td>
            <td>${getItems[i].itemQty}</td>
            <td>${getItems[i].total}</td>
            <td>${getItems[i].removeButton}</td>
            </tr>`
        );

        // Add onclick function for remove button
        let removeButton = $('#ordersSection #order-table-body tr:last-child .remove-item-button');
        removeButton.click(function() {
            let itemCode = $(this).attr('onclick').split("'")[1];
            let itemQty = getItems.find(I => I.itemCode === itemCode).itemQty;
            updateTheItemQtyAfterRemove(itemCode,itemQty);
        });
    }
}

function updateTheItemQtyAfterRemove(itemCode,itemQty){
    let item = getAllItems().find(I => I.itemCode === itemCode);
    if (item) {
        item.itemQty += itemQty;
        let index = getAllItems().findIndex(I => I.itemCode === itemCode);
        if (index !== -1) {
            updateItem(index, item);
            
        }
        updateCartAftereRemove(itemCode);
    }
  
   

}


function updateCartAftereRemove(itemCode){
    let index = getItems.findIndex(I => I.itemCode === itemCode);
    if (index !== -1) {
        getItems.splice(index, 1);
        loadTable();
        setTotal();
    }
}


function removeItem(itemCode,itemQty) {
    let index = getItems.findIndex(I => I.itemCode === itemCode);
    console.log(itemQty);
    if (index !== -1) {
        getItems.splice(index, 1);
        updateTheItemQty(itemCode,itemQty);
        loadTable();
        setTotal();
    }

}

function setTotal() {
    let total = 0;
    for (let i = 0; i < getItems.length; i++) {
        total += getItems[i].total;
    }
    $('#ordersSection .total').text(total.toFixed(2));
    alert(total+"  hoooooo");
}

$('#ordersSection .purchase-button').click(function() {
    let cash = parseFloat($('#ordersSection #Cash').val());
    let total = parseFloat($('#ordersSection .total').text());
    let discount = parseFloat($('#ordersSection #Discount').val());

    if (cash >= total) {
        if (discount >= 0 && discount <= 100) {
            let subTotal = total - (total * discount / 100);
            $('#ordersSection .sub-total').text(subTotal.toFixed(2));
            alert("sub total is  "+subTotal);

            let balance = cash - subTotal;
            $('#ordersSection #Balance').val(balance.toFixed(2));

            let Order = {
                orderId: $('#ordersSection #OrderId').val(),
                orderDate: $('#ordersSection #date-picker').val(),
                custId: $('#ordersSection #CustomerId').val(),
                items: getItems,
                total: total,
                discount: discount,
                subTotal: subTotal,
                cash: cash,
                balance: balance
            };

            saveOrder(Order);
            // updateItemData();
            getItems = [];
            loadTable();
            clear(2);
            clear(1)
           
            alert('Order Placed');
            // refresh();
            $('#ordersSection #OrderId').val(generateId());
        } else {
            alert('Invalid Discount');
        }
    } else {
        alert('Not Enough Cash');
    }
});

// function updateItemData() {
//     alert("update wenawada")
//     let items = getAllItems();
//     for (let i = 0; i < getItems.length; i++) {
//         let item = items.find(I => I.itemCode === getItems[i].itemCode);
//         alert("sanuuuuu"+item)
//         if (item) {
//             item.itemQty -= getItems[i].itemQty;
//             alert("mekat awada qty kiyada adu unam"+"  "+item.itemQty)
//             let index = items.findIndex(I => I.itemCode === getItems[i].itemCode);
//             if (index !== -1) {
//                 update(index, item);
//             }
//         }
//     }
// }



// $('.mainTable .tableRows').on('click', 'div', function() {
//     let itemCode = $(this).children('div:eq(0)').text();
//     let itemName = $(this).children('div:eq(1)').text();
//     let price = $(this).children('div:eq(2)').text();
//     let qty = $(this).children('div:eq(3)').text();

//     $('#ordersSection #ItemCode').val(itemCode);
//     $('#ordersSection #ItemName').val(itemName);
//     $('#ordersSection #ItemPrice').val(price);
//     $('#ordersSection #OrderQuantity').val(qty);

//     $('#ordersSection .add-item-button').text('delete').css('background-color', 'red');
// });



// function dropItem() {
//     let itemCode = $('#ordersSection #ItemCode').val();
//     let index = getItems.findIndex(I => I.itemCode === itemCode);
//     if (index !== -1) {
//         getItems.splice(index, 1);
//         loadTable();
//         clear(1);
//         setTotal();
//         alert('Item Removed');
//     }
//}
