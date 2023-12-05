// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt
let value;
let pan;
let tcs;



frappe.ui.form.on("Sales Order Creation", {

    onload(data){
       
          
            
        frappe.call({
            method: 'frappe.client.get_value',
            
            args: {
                'doctype': 'Customer Master',
                'filters': {"name": data.bill_to_party},
                
                'fieldname': [
                  'pan'
                ]
            },
            callback: function(r) {
                // console.log(r.message.pan)
              let pan = r.message.pan;
                console.log(pan)
                data.doc.item_details.forEach(function(row) {
                
                    value = row.gst_value + row.taxable_amount
                    if(pan == ""){
                      
                        tcs = 1/100
                    }else{
                      
                        tcs = 1/1000
                    }
                    // console.log(tcs)
                    value =  value * tcs 
                    row.tcs_value = value;
                    row.net_value = row.gst_value + row.taxable_amount + row.tcs_value;
                    // console.log(value)
                })
                if (!r.exc) {
                    
                }
            },
        }  
        )
    },
        
    refresh(frm){
        if((frappe.user_roles[0]=="Dispatch Team" && frm.doc.status=="Approved") || frappe.user_roles[0]=="System Manager"){

        
        frm.add_custom_button("Create Invoice",()=>{
            frappe.set_route("Form", "Invoice","new-Invoice");
            frappe.ui.form.on("Invoice",{
                onload:function(data){
                    data.set_value("sales_order_no", frm.doc.name); 
                    // console.log(frm.doc.table_detail)
                    // frm.doc.item_details.forEach(function(row) {
                    //     var child = cur_frm.add_child('invoice_detail');
                    //     frappe.model.set_value(child.doctype, child.name, 'material_code', row.material_code);
                    //     frappe.model.set_value(child.doctype, child.name, 'materia_description', row.materia_description);
                    //     frappe.model.set_value(child.doctype, child.name, 'plant', row.plant);
                    //     frappe.model.set_value(child.doctype, child.name, 'quantity', row.quantity);
                    //     frappe.model.set_value(child.doctype, child.name, 'rate', row.rate);
                    //     frappe.model.set_value(child.doctype, child.name, 'amount', row.amount);
                    //     frappe.model.set_value(child.doctype, child.name, 'discount', row.discount);
                    //     frappe.model.set_value(child.doctype, child.name, 'taxable_amount', row.taxable_amount);
                    //     frappe.model.set_value(child.doctype, child.name, 'gst_value', row.gst_value);
                    //     frappe.model.set_value(child.doctype, child.name, 'uom',row.uom);
                    //     frappe.model.set_value(child.doctype, child.name, 'tcs_value',row.tcs_value);
                    //     frappe.model.set_value(child.doctype, child.name, 'net_value',row.net_value)
                        
                    //     var child2 = cur_frm.add_child('invoice_delivery_table');
                    //     frappe.model.set_value(child2.doctype, child2.name, 'material', row.material_code)
                    //     frappe.model.set_value(child2.doctype, child2.name, 'material_description', row.materia_description)
                    //     frappe.model.set_value(child2.doctype, child2.name, 'quantity', row.quantity)
                    //     frappe.model.set_value(child2.doctype, child2.name, 'scheduledelivery_date', frm.doc.delivery_date)
                        
                       
                    // });

                }
            })
        })
    }
    },



    
    quotation_no(data){
        
        getvalues(data);   

    },
    });
    



let getvalues = (data)=>{
   // console.log(data.doc.quotation_no)
    frappe.call({
        method: 'domesticordermanagement.domesticordermanagement.doctype.sales_order_creation.sales_order_creation.get_child_table',
        
        args: {
            'quotationno':data.doc.quotation_no
        //     'doctype': 'Item Detail',
        //     'filters': {"parent": data.doc.quotation_no},
        //     'parent':'Quotation',
        //     'fieldname': [
        //         "material_code",
        //         "material_description",
        //         "plant",
        //         "qty",
        //         "uom",
        //         "currency",
        //         "rate",
        //         "amount",
        //         "discount",
        //         "taxable_amount",
        //         "sgst_",
        //         "sgst_value",
        //         "cgst_",
        //         "cgst_value",
        //         "igst_",
        //         "igst_value",
        //         "net_amount",
        //         "gst"

        //     ]
        },
        callback: function(r) {

          //  console.log(r);
            for  (value in r.message) {
               
            var child = cur_frm.add_child('item_details');
            frappe.model.set_value(child.doctype, child.name, 'material_code', r.message[value].material_code);
            frappe.model.set_value(child.doctype, child.name, 'materia_description', r.message[value].material_description);
            frappe.model.set_value(child.doctype, child.name, 'plant', r.message[value].plant);
            frappe.model.set_value(child.doctype, child.name, 'quantity', r.message[value].qty);
            frappe.model.set_value(child.doctype, child.name, 'rate', r.message[value].rate);
            frappe.model.set_value(child.doctype, child.name, 'amount', r.message[value].amount);
            frappe.model.set_value(child.doctype, child.name, 'discount', r.message[value].discount);
            frappe.model.set_value(child.doctype, child.name, 'taxable_amount', r.message[value].taxable_amount);
            frappe.model.set_value(child.doctype, child.name, 'gst_value', r.message[value].gst);
            frappe.model.set_value(child.doctype, child.name, 'unit',r.message[value].uom)
            frappe.model.set_value(child.doctype, child.name, 'sgst_value',r.message[value].sgst_value)
            frappe.model.set_value(child.doctype, child.name, 'cgst_value',r.message[value].cgst_value)
            frappe.model.set_value(child.doctype, child.name, 'igst_value',r.message[value].igst_value)
            frappe.model.set_value(child.doctype, child.name, 'sgst',r.message[value].sgst_)
            frappe.model.set_value(child.doctype, child.name, 'cgst',r.message[value].cgst_)
            frappe.model.set_value(child.doctype, child.name, 'igst',r.message[value].igst_)
            
            var child2 = cur_frm.add_child('delivery_schedule');
            frappe.model.set_value(child2.doctype, child2.name, 'material', r.message[value].material_code)
            frappe.model.set_value(child2.doctype, child2.name, 'material_description', r.message[value].material_description)
            frappe.model.set_value(child2.doctype, child2.name, 'quantity', r.message[value].qty)
            frappe.model.set_value(child2.doctype, child2.name, 'scheduledelivery_date', cur_frm.doc.delivery_date)

            }
        // method: 'domesticordermanagement.domesticordermanagement.doctype.sales_order_creation.sales_order_creation.some_details',
        // args: {
        //     quotationno: data.doc.quotation_no,
        // },
        // callback: function(r) {
            //console.log(r.message);
            
            // console.log(child)
            // for(let i in r.message){
            //     var child = cur_frm.add_child('item_details');
            //     var child2 = cur_frm.add_child('delivery_schedule');
            //     console.log(r.message[i].material_code)
            //     frappe.model.set_value(child.doctype, child.name, 'material_code', r.message[i].material_code);
            //     frappe.model.set_value(child.doctype, child.name, 'materia_description', r.message[i].material_description);
            //     frappe.model.set_value(child.doctype, child.name, 'plant', r.message[i].plant);
            //     frappe.model.set_value(child.doctype, child.name, 'quantity', r.message[i].qty);
            //     frappe.model.set_value(child.doctype, child.name, 'rate', r.message[i].rate);
            //     frappe.model.set_value(child.doctype, child.name, 'amount', r.message[i].amount);
            //     frappe.model.set_value(child.doctype, child.name, 'discount', r.message[i].discount);
            //     frappe.model.set_value(child.doctype, child.name, 'taxable_amount', r.message[i].taxable_amount);
            //     frappe.model.set_value(child.doctype, child.name, 'gst_value', r.message[i].gst);
            //     frappe.model.set_value(child.doctype, child.name, 'uom',r.message[i].uom)
            //     frappe.model.set_value(child2.doctype, child2.name, 'material', r.message[i].material_code)
            //     frappe.model.set_value(child2.doctype, child2.name, 'material_description', r.message[i].material_description)
            //     frappe.model.set_value(child2.doctype, child2.name, 'quantity', r.message[i].qty)
            //     frappe.model.set_value(child2.doctype, child2.name, 'scheduledelivery_date', cur_frm.doc.delivery_date)
            // }

            data.doc.item_details.forEach(function(row) {
            
                value = row.gst_value + row.taxable_amount
                if(pan == ""){
                  
                    tcs = 1/100
                }else{
                  
                    tcs = 1/1000
                }
                // console.log(tcs)
                value =  value * tcs 
                row.tcs_value = value;
                row.net_value = row.gst_value + row.taxable_amount + row.tcs_value;
            })
            
            if (!r.exc) {
                
            }
        }
    }  
    )
};



// frappe.ui.form.on("Sales Order Item", {
//     refresh:(frm,cdt,cdn)=>{
//         var item = locals[cdt][cdn];
//         let total = item.gst_value+item.taxable_amount + item.tcs_value
//         console.log(total);
//         frappe.model.set_value(cdt, cdn, 'net_value', total);
//     }
// });