# Copyright (c) 2023, Meril and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class HSNMaster(Document):
	pass



@frappe.whitelist()
def get_hsn_values(hsn_code):
		address = frappe.get_list('HSN Master',filters={'hsn_code':hsn_code},fields=['cgstp','sgstp','igstp'])