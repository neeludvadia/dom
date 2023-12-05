// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt

 frappe.ui.form.on("Country Master", {
    onsubmit(frm) {
          var country = frm.country_name.toUpperCase();
          console.log(country);      
 	},
    
 });
