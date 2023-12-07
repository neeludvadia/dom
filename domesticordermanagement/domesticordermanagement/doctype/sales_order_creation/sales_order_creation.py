# Copyright (c) 2023, Meril and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document


class SalesOrderCreation(Document):
	pass



@frappe.whitelist()
def get_child_table(quotationno):
	values = frappe.db.get_all('Item Detail',filters={'parent':quotationno},fields=['*'])
	return values
pass
