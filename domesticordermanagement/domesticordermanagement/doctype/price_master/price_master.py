# Copyright (c) 2023, Meril and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class PriceMaster(Document):

	@frappe.whitelist()
	def getmaterialgroup(material_category_name):
		materialgroupname = frappe.get_doc('material_group',fields=['material_group_name'],filters={"material_category_name":material_category_name})
		return materialgroupname
