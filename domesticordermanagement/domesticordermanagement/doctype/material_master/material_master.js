// Copyright (c) 2023, Meril and contributors
// For license information, please see license.txt
// let materialcategory;
// let materialcategoryname;
// let materialgroupcode;

// frappe.ui.form.on("Material Group", {
//     refresh(frm) {
//         materialcategoryname = frm.doc.material_group_name
//         materialgroupcode = frm.doc.material_group_code
//     }
// });




// frappe.ui.form.on("Material Master", {
// 	material_category: (frm)=> {
//        materialcategory= frm.doc.material_category

//        if(materialcategoryname == materialcategory){
//             frm.doc.material_group = materialgroupcode
//        }

//     },
// });

frappe.ui.form.on("Material Master", {
    material_category(frm) {
      frm.set_query("material_group", function () {
        return {
          filters: {
            material_category_name: frm.doc.material_category,
          },
        };
      });
      }
});
