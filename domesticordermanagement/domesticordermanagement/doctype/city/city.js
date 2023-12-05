// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt

frappe.ui.form.on("City", {
	state_name(frm) {
        console.log(frm.doc.state_name)
        frm.set_query("district_name",function() {
        return{
            filters:{
                state_name:frm.doc.state_name,
            },

        };
    });
}
	});

