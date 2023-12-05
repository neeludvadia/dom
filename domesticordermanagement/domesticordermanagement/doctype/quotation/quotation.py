# Copyright (c) 2023, Meril and contributors
# For license information, please see license.txt

import smtplib
import frappe
from frappe.model.document import Document
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


class Quotation(Document):
	def before_save(self):
		x=0
		##SendEmail(self)
	# @frappe.whitelist()
	# def get_hsn_values(hsn_code):
	# 		address = frappe.get_list('HSN Master',filters={'hsn_code': hsn_code},fields=['cgstp','sgstp','igstp'])
	
	
	# def before_validate(self):
	# 	self.bill_to_address = ""
	# 	data = frappe.db.sql(f"""
	# 							SELECT 
	# 								city, state, country, pin_code, state_code
	# 								FROM 
	# 									`tabCustomer Address Details`
	# 								WHERE
	# 									is_default_address = '1' AND
	# 									parent = '{self.bill_to_party}' AND
	# 									customer_type = 'Billing Address'
	# 						""")

	# 	for d in data:
	# 		self.bill_to_address = self.bill_to_address + str(d)

	@frappe.whitelist()
	def get_customer_billing_address_details(self):
		self.bill_to_address = ""
		data = frappe.db.sql(f"""
								SELECT 
									full_address, city, state, country, pin_code
									FROM 
										`tabCustomer Address Details`
									WHERE
										is_default_address = '1' AND
										parent = '{self.bill_to_party}' AND
										customer_type = 'Billing Address'
							""")
		
		return data
	
	@frappe.whitelist()
	def get_customer_shipping_address_details(self):
		self.ship_to_address = ""
		data = frappe.db.sql(f"""
								SELECT 
									full_address, city, state, country, pin_code
									FROM 
										`tabCustomer Address Details`
									WHERE
										is_default_address = '1' AND
										parent = '{self.ship_to_party}' AND
										customer_type = 'Shipping Address'
							""")
		
		return data


@frappe.whitelist()
def get_details_for_rate(distribution_channel,bill_to_party,material_code,pricing_date):
	data = frappe.db.sql(f"""
							SELECT 
								price
								FROM 
									`tabPrice Master`
								WHERE
									distribution_channel = '{distribution_channel}' AND
									customer = '{bill_to_party}' AND
									material_code = '{material_code}' AND
									'{pricing_date}' BETWEEN valid_from AND valid_to	
						""")
	return data	

@frappe.whitelist()
def get_states_code(plantName, billToParty):
	data = frappe.db.get_value('Plant Master',fieldname="state_code", filters={"name":plantName})
	data1 =  frappe.db.get_value('Customer Address Details',fieldname="state_code", filters={"parent":billToParty})

	if data == data1:
		return True
	else:
		return False


@frappe.whitelist()
def get_profile_name(id):
	Role = frappe.db.sql(f""" 
							select role_profile_name 
					  		from `tabUser` 
					  		where name = '{id}'
						""")

@frappe.whitelist()
def SendEmail(selfdoc):
	mailbody=""
	mymessage = MIMEMultipart()
	mymessage["From"] = "imran.shaikh@merillife.com"
	mymessage["To"] = "imran.shaikh@merillife.com"
	mymessage["To"] = "hardik.patel@merillife.com"
	mymessage["Subject"] = "Request for Quotaion Approval :" + selfdoc.name +""
	mailbody = "<span style=\"font-family:Calibri;font-size:14.5px\">Dear Sir/Mam,<br/><br/>Quotation is for Customer <b>" + selfdoc.bill_to_party +"</b>. Quotation # is : <b>"+ selfdoc.name +"</b>"
	mailbody += "<br/><br/>"
	mailbody += "<p>Please approve</p> "
	mailbody += "</body>"
	htmlView = MIMEText(mailbody, "html")
	mymessage.attach(htmlView)
	SmtpServer = smtplib.SMTP("smtp.transmail.co.in", 587)
	SmtpServer.starttls()
	SmtpServer.login("emailapikey", "PHtE6r1cF7jiim598RZVsPW9QMCkMN96/uNveQUTt4tGWPNRTk1U+tgokDO0rRx+UKZAHKPInos5tbqZtbiHdz6/Z2dED2qyqK3sx/VYSPOZsbq6x00as1wSc0TfUILscdds1CLfutnYNA==")
	SmtpServer.send_message(mymessage)
	SmtpServer.quit()
