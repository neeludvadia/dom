// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt
let party_statecode
let plant_statecode
function calculateAmount(frm, cdt, cdn) {
    var item = locals[cdt][cdn];
    var qty = item.qty;
    var rate = item.rate;
    var amount = qty * rate;
    var discount=item.discount;
    var taxable_amount = amount - ((amount * discount)/100);
    
    //var gst=item.gst;
    var sgstpercentage=item.sgst_;
    var cgstpercentage=item.cgst_;
    var igstpercentage=item.igst_;
    console.log(sgstpercentage);
    var sgstvalue=((taxable_amount * sgstpercentage)/100);
    var cgstvalue=((taxable_amount * cgstpercentage)/100);
    var igstvalue=((taxable_amount * igstpercentage)/100);
    console.log(sgstvalue);
    frappe.model.set_value(cdt, cdn, 'sgst_value', sgstvalue);
     frappe.model.set_value(cdt, cdn, 'cgst_value', cgstvalue);
    frappe.model.set_value(cdt, cdn, 'igst_value', igstvalue);
    var gst=sgstvalue+cgstvalue+igstvalue;
    frappe.model.set_value(cdt, cdn, 'gst', gst);
    
    
    // var net_amount=(taxable_amount + (taxable_amount * gst)/100);
    let net_amount= taxable_amount + cgstvalue + sgstvalue + igstvalue;
    console.log("net_amount",net_amount)
    frappe.model.set_value(cdt, cdn, 'amount', amount);
    frappe.model.set_value(cdt, cdn, 'taxable_amount', taxable_amount);
    frappe.model.set_value(cdt, cdn, 'net_amount',net_amount);
    //frm.refresh_field('net_amount');

    // frm.doc.total_amount = net_amount;
    // frm.doc.sgst_value = sgstvalue;
    // frm.doc.igst_value = igstvalue;
    // frm.doc.cgst_value = cgstvalue;



    //console.log(frm);
    // for(i=0;i<2;i++)
    // {  
    //     total = total+ amount
    //     console.log(total);
    // }

        let ttl_itms_netamount = 0;
        let ttl_itms_sgst_value = 0;
        let ttl_itms_cgst_value = 0;
        let ttl_itms_igst_value = 0;
        $.each(frm.doc.table_detail,  function(i,  d) {
            ttl_itms_netamount += flt(d.net_amount);
            console.log("helo",ttl_itms_netamount);
            ttl_itms_sgst_value += flt(d.sgst_value);
            ttl_itms_cgst_value += flt(d.cgst_value);
            ttl_itms_igst_value += flt(d.igst_value);
            
        });
        console.log("hello");
        frm.set_value('total_amount',ttl_itms_netamount)
        console.log(ttl_itms_netamount);
        frm.set_value('sgst_value',ttl_itms_sgst_value)
        frm.set_value('cgst_value',ttl_itms_cgst_value)
        frm.set_value('igst_value',ttl_itms_igst_value)
    
//    frm.doc.item_detail.forEach(function(item) {
//     frappe.msgprint("amount"+item.amount);
//      total += item.amount; 
    
//     });
   frm.set_value('total_amount', ttl_itms_netamount);
}


frappe.ui.form.on("Item Detail", {
    qty: function(frm,cdt,cdn) {
        // calculateAmount(frm, cdt, cdn);
        //frm.refresh_field('amount');
    },
    rate: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
        frappe.model.set_value(cdt, cdn, 'gst',0);
       // frm.refresh_field('amount');
    },
    discount: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
        
       // frm.refresh_field('amount');
    }
    ,
    // gst: function(frm,cdt,cdn) {
    //     calculateAmount(frm, cdt, cdn);

    
       // frm.refresh_field('amount');
    // },
    plant: function(frm,cdt,cdn){
        var item = locals[cdt][cdn];
        frappe.call({
            method: 'domesticordermanagement.domesticordermanagement.doctype.quotation.quotation.get_states_code',
            args:{
                'plantName':item.plant,
                'billToParty':cur_frm.doc.bill_to_party,
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
                            frappe.model.set_value(cdt, cdn, 'cgst_', r.message.cgstp);
                            console.log('hello')
                            frappe.model.set_value(cdt, cdn, 'sgst_', r.message.sgstp);
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
                            frappe.model.set_value(cdt, cdn, 'igst_', r.message.igstp);
                            calculateAmount(frm, cdt, cdn);
                        }
                    })
                }
                
            }
        })
    },

    material_code: function(frm,cdt,cdn){
        var item = locals[cdt][cdn];

        frappe.call({
            method: 'frappe.client.get_value',
            
            args: {
                'doctype': 'HSN Master',
                'filters': {"name": item.hsn_code},
                'fieldname': [
                    'cgstp',
                    'sgstp',
                    'igstp'
                ]
            },
            callback: function(r) {
                console.log(r.message.cgstp)
                
                // frappe.model.set_value(cdt, cdn, 'sgst_', r.message.sgstp);
                // frappe.model.set_value(cdt, cdn, 'cgst_', r.message.cgstp);
                // frappe.model.set_value(cdt, cdn, 'igst_', r.message.igstp);
                if (!r.exc) {
                    
                }
            }
        })
        //console.log(cur_frm.doc.distribution_channel,cur_frm.doc.bill_to_party,item.material_code,cur_frm.doc.pricing_date)
        frappe.call({
            method:'domesticordermanagement.domesticordermanagement.doctype.quotation.quotation.get_details_for_rate',
            args:{
                'distribution_channel':cur_frm.doc.distribution_channel,
                'bill_to_party':cur_frm.doc.bill_to_party,
                'material_code':item.material_code,
                'pricing_date':cur_frm.doc.pricing_date,
            },
            callback: function(r){
                //frappe.msgprint(r.message)
                //console.log(r.message[0][0])
                //index.set_value('rate',r.message[0][0])
                //check if value changed in material code date doesnt match then what will be answer
                console.log(r.message);
                frappe.model.set_value(cdt, cdn, 'rate', '');
                frappe.model.set_value(cdt, cdn, 'rate', r.message[0][0]);
                calculateAmount(frm, cdt, cdn);
            }
        })
        
     }
});

   

frappe.ui.form.on("Quotation",{
    onload(frm){
        frm.doc.sales_person = frappe.session.user_fullname;
    },
   
    bill_to_party(frm){
        frm.call('get_customer_billing_address_details').then((r)=>{
            // let msg = JSON.stringify(r);
            // let msg1 = JSON.parse(msg);
            let msg = r;
            let msg1 = r.message.toString();
            console.log(r.message)
            frm.set_value("bill_to_address", msg1);
        })
    },
    ship_to_party(frm){
        frm.call('get_customer_shipping_address_details').then((r)=>{
            let msg = r;
            let msg1 = r.message.toString();
            console.log(r.message)
            frm.set_value("ship_to_address", msg1);
        })
    },
    refresh(frm){
        console.log(frm.doc.status);
        if ((frappe.user_roles[0]=="Order Punching Team" && frm.doc.status== "Approved") || frappe.user_roles[0]=="System Manager")
        {
        
        frm.add_custom_button("Create Sales Order",()=>{
            frappe.set_route("Form", "sales-order-creation","new-sales-order-creation");
            frappe.ui.form.on("Sales Order Creation",{
                onload:function(data){
                    data.set_value("quotation_no", frm.doc.name); 
                    // console.log(frm.doc.table_detail)
                    // frm.doc.table_detail.forEach(function(row) {
                    //     var child = cur_frm.add_child('item_details');
                    //     frappe.model.set_value(child.doctype, child.name, 'material_code', row.material_code);
                    //     frappe.model.set_value(child.doctype, child.name, 'materia_description', row.material_description);
                    //     frappe.model.set_value(child.doctype, child.name, 'plant', row.plant);
                    //     frappe.model.set_value(child.doctype, child.name, 'quantity', row.qty);
                    //     frappe.model.set_value(child.doctype, child.name, 'rate', row.rate);
                    //     frappe.model.set_value(child.doctype, child.name, 'amount', row.amount);
                    //     frappe.model.set_value(child.doctype, child.name, 'discount', row.discount);
                    //     frappe.model.set_value(child.doctype, child.name, 'taxable_amount', row.taxable_amount);
                    //     frappe.model.set_value(child.doctype, child.name, 'gst_value', row.gst);
                    //     frappe.model.set_value(child.doctype, child.name, 'uom',row.uom)
                        
                    //     var child2 = cur_frm.add_child('delivery_schedule');
                    //     frappe.model.set_value(child2.doctype, child2.name, 'material', row.material_code)
                    //     frappe.model.set_value(child2.doctype, child2.name, 'material_description', row.material_description)
                    //     frappe.model.set_value(child2.doctype, child2.name, 'quantity', row.qty)
                    //     frappe.model.set_value(child2.doctype, child2.name, 'scheduledelivery_date', frm.doc.delivery_date)
                        
                       
                    // });

                }
            })
        })
    }
     }
})

