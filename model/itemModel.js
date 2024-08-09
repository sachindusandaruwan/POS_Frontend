import{items} from'../database/db.js'

export async function saveItem(itemCode,itemName,itemQty,unitPrice){
console.log("=============================================================")
    if (itemCode && itemName && itemQty && unitPrice) {
        const response = await fetch("http://localhost:8080/POS/item", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemCode: itemCode,
            itemName: itemName,
            itemQty: itemQty,
            unitPrice: unitPrice,
          }),
        });
        const text = await response.text();
        return text;
      } else {
        return "Invalid Item";
      }
   

    // items.push(item);
    // alert("2222")
    // alert(items.length)
}

export async function getAllItems(){
    // return items;

    try {
        const response = await fetch("http://localhost:8080/POS/item");
        const data = await response.json();
        const itemTableList = []
        data.map(
          (item) =>
            itemTableList.push
            (
             { itemCode:item.itemCode,
                itemName:item.itemName,
                itemQty:item.itemQty,
                unitPrice:item.unitPrice}
            )
        );
        console.log("enawada")
        console.log(itemTableList);
        return itemTableList;
        
      } catch (error) {
        console.error("getAllItems:", error);
      }
}

export function remove(itemCode){
    
  try {
    const response = fetch(
      'http://localhost:8080/POS/item?itemCode='+itemCode,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("removeItem:", error);
  }

alert("mn giya")
    
}

export async function update(itemCode,itemName,itemQty,unitPrice){
  try {
    const response = await fetch(
      'http://localhost:8080/POS/item?itemCode='+itemCode,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemName: itemName,
          itemQty: itemQty,
          unitPrice: unitPrice,
        }),
      }
    );
  } catch (error) {
    console.error("updateItem:", error);
  }

alert("lllllll")
}