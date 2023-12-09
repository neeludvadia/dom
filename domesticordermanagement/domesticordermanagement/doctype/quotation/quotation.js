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
    
    
   
    let net_amount= taxable_amount + cgstvalue + sgstvalue + igstvalue;
    console.log("net_amount",net_amount)
    frappe.model.set_value(cdt, cdn, 'amount', amount);
    frappe.model.set_value(cdt, cdn, 'taxable_amount', taxable_amount);
    frappe.model.set_value(cdt, cdn, 'net_amount',net_amount);
   

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
    

   frm.set_value('total_amount', ttl_itms_netamount);
}


frappe.ui.form.on("Item Detail", {
    qty: function(frm,cdt,cdn) {
       
    },
    rate: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
        frappe.model.set_value(cdt, cdn, 'gst',0);
      
    },
    discount: function(frm,cdt,cdn) {
        calculateAmount(frm, cdt, cdn);
        
      
    }
    ,
   
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
                
                
                if (!r.exc) {
                    
                }
            }
        })
       
        frappe.call({
            method:'domesticordermanagement.domesticordermanagement.doctype.quotation.quotation.get_details_for_rate',
            args:{
                'distribution_channel':cur_frm.doc.distribution_channel,
                'bill_to_party':cur_frm.doc.bill_to_party,
                'material_code':item.material_code,
                'pricing_date':cur_frm.doc.pricing_date,
            },
            callback: function(r){
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

    delivery_date(frm){
        if( frm.doc.delivery_date <= frm.doc.quotation_date ){
            frappe.msgprint(__(" Date validation error"));
            frappe.validated = false;
            //   frm.set_value('delivery_date','');
        }
        },

        pricing_date(frm){
            if( frm.doc.pricing_date <= frm.doc.quotation_date || frm.doc.pricing_date >= frm.doc.delivery_date ){
                frappe.msgprint(__(" Date validation error"));
                frappe.validated = false;
                //   frm.set_value('delivery_date','');
            }
            },

            purchase_order_date(frm){
                if( frm.doc.purchase_order_date >= frm.doc.quotation_date){
                    frappe.msgprint(__(" Date validation error"));
                    frappe.validated = false;
                    //   frm.set_value('delivery_date','');
                }
                },
            
   

    bill_to_party(frm){
        frm.call('get_customer_billing_address_details').then((r)=>{
            let msg = r;
            let msg1 = [];

            for(let i=0;i<r.message.length;i++){
                msg1.push(`${r.message[i]}`)
                console.log(msg1);
            }
            frm.set_df_property('bill_to_address', 'options',msg1);
            frm.refresh_field('bill_to_address');
        })
    },
    ship_to_party(frm){
        frm.call('get_customer_shipping_address_details').then((r)=>{
            let msg = r;
            let msg1 = [];

            for(let i=0;i<r.message.length;i++){
                msg1.push(`${r.message[i]}`)
                console.log(msg1);
            }
            frm.set_df_property('ship_to_address', 'options',msg1);
            frm.refresh_field('ship_to_address');
        })
    },
    refresh(frm){
        console.log(frm.doc.status);
        if ((frappe.user_roles[0]=="Order Punching Team" && frm.doc.status== "Approved"))
        {
        
        frm.add_custom_button("Create Sales Order",()=>{
            frappe.set_route("Form", "sales-order-creation","new-sales-order-creation");
            frappe.ui.form.on("Sales Order Creation",{
                onload:function(data){
                    data.set_value("quotation_no", frm.doc.name); 
                }
            })
        })
     
    }
    frm.remove_custom_button();
     }
})

