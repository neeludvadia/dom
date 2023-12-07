# Copyright (c) 2023, Meril and contributors
# For license information, please see license.txt
import frappe
from frappe.model.document import Document


class SalesOrderCreation(Document):
	def before_submit(self):
		if self.payment_confirm_ != 1:
			frappe.throw("Please Check Mark Payment Confirmation")
	pass



@frappe.whitelist()
def get_child_table(quotationno):
	values = frappe.db.get_all('Item Detail',filters={'parent':quotationno},fields=['*'])
	return values
pass
