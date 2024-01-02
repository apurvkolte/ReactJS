import FiledView from "./FiledView";
import { property } from './FiledList1'
<div className="row-fluid">
    <FiledView />
</div>


productDetails1 = JSON.stringify(property)
formData.set("productDetails", productDetails1);


//product specificatio table adding
if (productDetails[0].title !== "" && productDetails[0].data !== "") {
    productDetails.map(async (field) => {
        var sql5 = `insert into specifications(id, product_id, title, description) value (Null, ${product_id}, 
     '${field.title ? (field.title).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim() : field.title}',
     '${field.description ? (field.description).replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/`/g, "\\`").trim() : field.description}');`
        var rows5 = await query(sql5);
        productSpecifications = rows5;
    })
}