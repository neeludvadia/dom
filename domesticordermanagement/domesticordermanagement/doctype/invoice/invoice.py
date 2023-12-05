# Copyright (c) 2023, Meril and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class Invoice(Document):
	pass
@frappe.whitelist()
def get_some_details(salesorderno):
	data = frappe.db.get_all('Sales Order Item',filters={'parent':salesorderno},fields=["*"])
	return data
pass