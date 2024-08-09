import { saveCustomer,getAllCustomers,remove,update } from "../model/customerModel.js";
$(document).ready(function(){
    // alert("hiiii mn awa");
    loadAllCustomers();
    
})
// loadAllCustomers();

export async function loadAllCustomers(){
    clearTable();
    
    let customers =await getAllCustomers();
    customers.forEach(
        customer => {
            $('#cus-table').append(`<tr><td>${customer.id}</td><td>${customer.name}</td><td>${customer.address}</td><td>${customer.salary}</td></tr>`);
            
        }
    );

   
}

/////////////////////////////////////////////////////

function saveCustomerDetail(){
    let id = $('#customerSection #cus-ID').val();
    let name = $('#customerSection #cus-name').val();
    let address=$('#customerSection #cus-address').val();
    let salary =$('#customerSection #cus-salary').val();

    

    // alert(cusId+cusName+cusAddress+cusSalary)
    let customerDetail={
        id : id,
        name : name,
        address : address,
        salary :salary
    }
    

    if(isCustomerValidated(customerDetail)){
        saveCustomer(customerDetail.id,customerDetail.name,customerDetail.address,customerDetail.salary);
         // clearTable();
        // loadAllCustomers();
        alert("customer is Saved!!!")
        clearField();
    }


    // let validateCustomer=validate(customerDetail);
    // if(validateCustomer){
    //     saveCustomer(customerDetail);
    //     clearTable();
    //     loadAllCustomers();
    //     clearField();
    // }

    
}

$('#save-cus').click(function(){
    saveCustomerDetail();
});
/////////////////////////////////////////////////////////////////////////////////////////////////




//////////////////////////////////////////////////////////////////////////////////////////////////

function isCustomerValidated(customerDetail){
    let valid = true;
    if (customerDetail.id.trim() === "") {
        valid = false;
        // Display error message for empty customer ID
        $('#customerSection .invalidCustId').text('Customer ID is required');
    } else if (!(/^C000[0-9]+$/).test(customerDetail.id)) {
        valid = false;
        // Display error message for invalid customer ID format
        $('#customerSection .invalidCustId').text('Invalid Customer ID');
    } else if(isCustomerExist(customerDetail.id).then(
        (flag)=> {
            if(!flag){
                valid=false;
                alert('Customer ID already exist');
            }
        }
    )){
    //     alert("kkkkkkkkkkk"+isCustomerExist(customerDetail.id))
    //    valid =false;
    //    alert('Customer ID already exist');
        
    }else{
        $('#customerSection .invalidCustId').text('');
    }

    if (customerDetail.name.trim() === "") {
        valid = false;
        // Display error message for empty customer name
        $('#customerSection .invalidCustName').text('Customer Name is required');
    } else {
        // Clear error message for customer name
        $('#customerSection .invalidCustName').text('');
    }

    if (customerDetail.address.trim() === "" && customerDetail.address.isInteger()) {
        valid = false;
        // Display error message for empty customer address
        $('#customerSection .invalidCustAddress').text('Customer Address is required');
    } else {
        // Clear error message for customer address
        $('#customerSection .invalidCustAddress').text('');
    }

    if (customerDetail.salary === "") {
        valid = false;
        // Display error message for empty customer salary
        $('#customerSection .invalidCustSalary').text('Customer Salary is required');
    } else if (isNaN(customerDetail.salary)) {
        valid = false;
        // Display error message for invalid customer salary format
        $('#customerSection .invalidCustSalary').text('Invalid Customer Salary');
    } else {
        // Clear error message for customer salary
        $('#customerSection .invalidCustSalary').text('');
    }

    return valid;

}

async function isCustomerExist(customerId) {
    let customers = await getAllCustomers();
    const customer=customers.find(c => c.id === customerId);
    if(customer==null){
        return true;
    }
    else{
        return false;
    }
   
}

function clearField(){
    $('#customerSection #cus-ID').val("");
    $('#customerSection #cus-name').val("");
    $('#customerSection #cus-address').val("");
    $('#customerSection #cus-salary').val("");
}

 function clearTable(){
    let table = document.getElementById("cus-table");
    let rowCount = table.rows.length;

    for(let i = rowCount - 1; i > 0; i--){
        table.deleteRow(i);
    }
}





// -------------------------------------------------------------------------------------


// search customer
//set values to the input fields when click the table row
document.getElementById("cus-table").addEventListener("click",function(event){
    let target = event.target;
   
        let id = target.parentElement.cells[0].textContent;
        let name = target.parentElement.cells[1].textContent;
        let address = target.parentElement.cells[2].textContent;
        let salary = target.parentElement.cells[3].textContent;

        document.getElementById("cus-ID").value = id;
        document.getElementById("cus-name").value = name;
        document.getElementById("cus-address").value = address;
        document.getElementById("cus-salary").value = salary;
    
});




// ------------------------------------------------------------------

async function deleteCustomer() {
    let id = $('#customerSection #cus-ID').val();
    await remove(id);
    clearTable();
    loadAllCustomers();
    clearField();
}

$('#remove-cus').click(function(){
    deleteCustomer();
});


///////



// ----------------------------------------------------------------------

async function updateCustomer(id,name,address,salary){
   
    try {
        if (confirm("Are you sure you want to update this customer?")) {
          await update(id, name, address, salary);
          clearField();
          clearTable();
          loadAllCustomers();
          alert("Customer Updated Successfully!");
        }
      } catch (error) {
        console.error(error);
      }
   
}

$('#update-cus').click(function(){

    let id = $('#customerSection #cus-ID').val();
    let name = $('#customerSection #cus-name').val();
    let address=$('#customerSection #cus-address').val();
    let salary =$('#customerSection #cus-salary').val();

    

    // alert(cusId+cusName+cusAddress+cusSalary)
    let customerDetail={
        id : id,
        name : name,
        address : address,
        salary :salary
    }
    if(isCustomerValidated(customerDetail)){
        updateCustomer(customerDetail.id,customerDetail.name,customerDetail.address,customerDetail.salary);
    }
    

   
});


