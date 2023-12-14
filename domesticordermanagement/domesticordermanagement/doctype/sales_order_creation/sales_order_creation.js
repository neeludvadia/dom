// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt
let value;
let pan;
let tcs;

function calculateAmount(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    var qty = item.quantity;
    var rate = item.rate;
    var amount = qty * rate;
    var discount=item.discount;
    var taxable_amount = amount - ((amount * discount)/100);

    //var gst=item.gst;
    var sgstpercentage=item.sgst;
    var cgstpercentage=item.cgst;
    var igstpercentage=item.igst;
    console.log(igstpercentage);
    var sgstvalue=((taxable_amount * sgstpercentage)/100);
    var cgstvalue=((taxable_amount * cgstpercentage)/100);
    var igstvalue=((taxable_amount * igstpercentage)/100);
    //console.log(sgstvalue);
    frappe.model.set_value(cdt, cdn, 'sgst_value', sgstvalue);
    frappe.model.set_value(cdt, cdn, 'cgst_value', cgstvalue);
    frappe.model.set_value(cdt, cdn, 'igst_value', igstvalue);
    var gst=sgstvalue+cgstvalue+igstvalue;
    frappe.model.set_value(cdt, cdn, 'gst_value', gst);
    
    let net_amount= taxable_amount + cgstvalue + sgstvalue + igstvalue;
    //console.log("net_amount",net_amount)
    frappe.model.set_value(cdt, cdn, 'amount', amount);
    frappe.model.set_value(cdt, cdn, 'taxable_amount', taxable_amount);
    frappe.model.set_value(cdt, cdn, 'net_value',net_amount);
   

        let ttl_itms_netamount = 0;
        let ttl_itms_sgst_value = 0;
        let ttl_itms_cgst_value = 0;
        let ttl_itms_igst_value = 0;
        $.each(frm.doc.item_details,  function(i,  d) {
            ttl_itms_netamount += flt(d.net_amount);
            //console.log("helo",ttl_itms_netamount);
            ttl_itms_sgst_value += flt(d.sgst_value);
            ttl_itms_cgst_value += flt(d.cgst_value);
            ttl_itms_igst_value += flt(d.igst_value);
            
        });
        //console.log("hello");
        frm.set_value('total_amount',ttl_itms_netamount)
        //console.log(ttl_itms_netamount);
        frm.set_value('sgst_value',ttl_itms_sgst_value)
        frm.set_value('cgst_value',ttl_itms_cgst_value)
        frm.set_value('igst_value',ttl_itms_igst_value)
    

   frm.set_value('total_amount', ttl_itms_netamount);
}

frappe.ui.form.on("Sales Order Item", {
    quantity: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
    },
    
    rate: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
        frappe.model.set_value(cdt, cdn, 'gst',0);
    },

    discount: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
    },

    onload:{
    plant: function(frm,cdt,cdn){
        var item = locals[cdt][cdn];
        console.log(frm.doc.bill_to_party)
        frappe.call({
            method: 'domesticordermanagement.domesticordermanagement.doctype.quotation.quotation.get_states_code',
            args:{
                'plantName':item.plant,
                'billToParty':frm.doc.bill_to_party,
            },
            callback: function(r){
                if(r.message){
                    frappe.call({
                        method: 'frappe.client.get_value',
                        args:{
                            doctype:'HSN Master',
                            filters:{'name':item.hsn_code},
                            fieldname:[
                                'cgstp',
                                'sgstp'
                            ]
                        },
                        callback:function(r){
                            frappe.model.set_value(cdt, cdn, 'cgst', r.message.cgstp);
                            console.log(r.message.cgstp)
                            frappe.model.set_value(cdt, cdn, 'sgst', r.message.sgstp);
                            calculateAmount(frm, cdt, cdn);
                        }
                    }) 
                }
                else{
                    frappe.call({
                        method: 'frappe.client.get_value',
                        args:{
                            doctype:'HSN Master',
                            filters:{'name':item.hsn_code},
                            fieldname:[
                                'igstp'
                            ]
                        },
                        callback:function(r){
                            frappe.model.set_value(cdt, cdn, 'igst', r.message.igstp);
                            calculateAmount(frm, cdt, cdn);
                        }
                    })
                }
                
            }
        })
    }},

    // plant: function(frm,cdt,cdn){
    //     var item = locals[cdt][cdn];
    //     console.log(frm.doc.bill_to_party)
    //     frappe.call({
    //         method: 'domesticordermanagement.domesticordermanagement.doctype.quotation.quotation.get_states_code',
    //         args:{
    //             'plantName':item.plant,
    //             'billToParty':frm.doc.bill_to_party,
    //         },
    //         callback: function(r){
    //             if(r.message){
    //                 frappe.call({
    //                     method: 'frappe.client.get_value',
    //                     args:{
    //                         doctype:'HSN Master',
    //                         filters:{'name':item.hsn_code},
    //                         fieldname:[
    //                             'cgstp',
    //                             'sgstp'
    //                         ]
    //                     },
    //                     callback:function(r){
    //                         frappe.model.set_value(cdt, cdn, 'cgst', r.message.cgstp);
    //                         console.log(r.message.cgstp)
    //                         frappe.model.set_value(cdt, cdn, 'sgst', r.message.sgstp);
    //                         calculateAmount(frm, cdt, cdn);
    //                     }
    //                 }) 
    //             }
    //             else{
    //                 frappe.call({
    //                     method: 'frappe.client.get_value',
    //                     args:{
    //                         doctype:'HSN Master',
    //                         filters:{'name':item.hsn_code},
    //                         fieldname:[
    //                             'igstp'
    //                         ]
    //                     },
    //                     callback:function(r){
    //                         frappe.model.set_value(cdt, cdn, 'igst', r.message.igstp);
    //                         calculateAmount(frm, cdt, cdn);
    //                     }
    //                 })
    //             }
                
    //         }
    //     })
    // },
    
    
    material_code: function(frm,cdt,cdn){
        var item = locals[cdt][cdn];
       
        frappe.call({
            method:'domesticordermanagement.domesticordermanagement.doctype.quotation.quotation.get_details_for_rate',
            args:{
                'distribution_channel':cur_frm.doc.distribution_channel,
                'bill_to_party':cur_frm.doc.bill_to_party,
                'material_code':item.material_code,
                'pricing_date':cur_frm.doc.pricing_date,
            },
            callback: function(r){
                //console.log(r.message);
                frappe.model.set_value(cdt, cdn, 'rate', '');
                frappe.model.set_value(cdt, cdn, 'rate', r.message[0][0]);
                calculateAmount(frm, cdt, cdn);
            }
        })
        
     }
});

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
                //console.log(pan)
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
        if((frappe.user_roles[0]=="Dispatch Team" && frm.doc.status=="Approved")){
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

    bill_to_party(frm){
        frappe.call({
            method: 'frappe.client.get_value',
            
            args: {
                'doctype': 'Customer Master',
                'filters': {"name": cur_frm.doc.bill_to_party},
                'fieldname': [
                    'customer_name'
                ]
            },
            callback: function(r) {
                //console.log(r.message.customer_name)
                frm.set_value('customer_name',r.message.customer_name)
                
                if (!r.exc) {
                    
                }
            }
        })
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
            //console.log(r.message)   
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
            cur_frm.refresh_field('item_details') 
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
                row.net_value = row.gst_value + row.taxable_amount;
            })
            
            if (!r.exc) {
                
            }
        }
    }  
    )
};



