import{customers} from '../database/db.js';

export async function saveCustomer(id,name,address,salary){

    if (id && name && address && salary) {
        const response = await fetch("http://localhost:8080/POS/customer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            name: name,
            address: address,
            salary: salary,
          }),
        });
        const text = await response.text();
        return text;
      } else {
        return "Invalid Customer";
      }
   

    // customers.push(customer);
    // alert(customer.customerId)
}

export async function getAllCustomers(){
    try {
        const response = await fetch("http://localhost:8080/POS/customer");
        const data = await response.json();
        const customerTableList = []
        data.map(
          (customer) =>
            customerTableList.push
            (
             { id:customer.id,
                name:customer.name,
                address:customer.address,
                salary:customer.salary}
            )
        );
        console.log(customerTableList);
        return customerTableList;
        
      } catch (error) {
        console.error("getAllCustomers:", error);
      }
}

export async function remove(id){
    alert("mn awa")
    alert("hiiiii"+id)
    // customers.splice(index,1);

    try {
        const response = fetch(
          'http://localhost:8080/POS/customer?id='+id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("removeCustomer:", error);
      }

    alert("mn giya")
}

 export async function update(id,name,address,salary){
    // alert("update ekata awa"+id+name+address+salary)
    
    try {
        const response = await fetch(
          'http://localhost:8080/POS/customer?id='+id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: name,
              address: address,
              salary: salary,
            }),
          }
        );
      } catch (error) {
        console.error("updateCustomer:", error);
      }

    alert("lllllll")
}