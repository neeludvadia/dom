// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt

frappe.ui.form.on("Invoice", {
	sales_order_no(data) {
        frappe.call({
            method: 'domesticordermanagement.domesticordermanagement.doctype.invoice.invoice.get_some_details',
            args: {
                'salesorderno': data.doc.sales_order_no
            },
            callback: function(r) {
                //console.log(r);
                for(let value in r.message) {
                    // console.log(r.message[value].quantity)
                    var child = cur_frm.add_child('invoice_item');
                    frappe.model.set_value(child.doctype, child.name, 'material_code', r.message[value].material_code);
                    frappe.model.set_value(child.doctype, child.name, 'material_description', r.message[value].materia_description);
                    frappe.model.set_value(child.doctype, child.name, 'plant', r.message[value].plant);
                    frappe.model.set_value(child.doctype, child.name, 'quantity', r.message[value].quantity);
                    frappe.model.set_value(child.doctype, child.name, 'rate', r.message[value].rate);
                    frappe.model.set_value(child.doctype, child.name, 'amount', r.message[value].amount);
                    frappe.model.set_value(child.doctype, child.name, 'discount', r.message[value].discount);
                    frappe.model.set_value(child.doctype, child.name, 'taxable_amount', r.message[value].taxable_amount);
                    frappe.model.set_value(child.doctype, child.name, 'gst_value', r.message[value].gst_value);
                    frappe.model.set_value(child.doctype, child.name, 'tcs_value', r.message[value].tcs_value);
                    frappe.model.set_value(child.doctype, child.name, 'net_value', r.message[value].net_value);
                    frappe.model.set_value(child.doctype, child.name, 'uom',r.message[value].unit)
                
                    var child2 = cur_frm.add_child('invoice_delivery_table');
                    console.log(cur_frm.doc.delivery_date)
                    frappe.model.set_value(child2.doctype, child2.name, 'material', r.message[value].material_code)
                    frappe.model.set_value(child2.doctype, child2.name, 'material_description', r.message[value].materia_description)
                    frappe.model.set_value(child2.doctype, child2.name, 'quantity', r.message[value].quantity)
                    frappe.model.set_value(child2.doctype, child2.name, 'scheduledelivery_date', cur_frm.doc.delivery_date)

            }
    
                // data.doc.item_details.forEach(function(row) {
                
                //     value = row.gst_value + row.taxable_amount
                //     if(pan == ""){
                      
                //         tcs = 1/100
                //     }else{
                      
                //         tcs = 1/1000
                //     }
                //     // console.log(tcs)
                //     value =  value * tcs 
                //     row.tcs_value = value;
                //     row.net_value = row.gst_value + row.taxable_amount + row.tcs_value;
                // })
                
                if (!r.exc) {
                    
                }
            }
        }  
        )
            
           
        }
	},
);