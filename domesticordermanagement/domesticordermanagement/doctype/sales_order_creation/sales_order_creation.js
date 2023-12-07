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
                let pan = r.message.pan;
                console.log(pan)
                data.doc.item_details.forEach(function(row) {
                
                    value = row.gst_value + row.taxable_amount
                    if(pan == ""){
                      
                        tcs = 1/100
                    }else{
                      
                        tcs = 1/1000
                    }
                    value =  value * tcs 
                    row.tcs_value = value;
                    row.net_value = row.gst_value + row.taxable_amount + row.tcs_value;
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
     frappe.call({
        method: 'domesticordermanagement.domesticordermanagement.doctype.sales_order_creation.sales_order_creation.get_child_table',
        
        args: {
            'quotationno':data.doc.quotation_no
        },
        callback: function(r) {

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
       
            data.doc.item_details.forEach(function(row) {
            
                value = row.gst_value + row.taxable_amount
                if(pan == ""){
                  
                    tcs = 1/100
                }else{
                  
                    tcs = 1/1000
                }
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



