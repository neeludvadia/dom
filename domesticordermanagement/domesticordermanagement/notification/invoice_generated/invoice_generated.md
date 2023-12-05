<p><p>Invoice is Generated for {{doc.bill_to_party}} with Invoice No {{doc.name}} on {{doc.invoice_date}}</p><br/></p>

<ul>
<li>Invoice No : {{doc.name}}</li>
<li>Sales Order No : {{doc.sales_order_no}}</li>
<li>Customer Code : {{ doc.bill_to_party }}</li>
<li>Ship to Party : {{ doc.ship_to_party }}</li>
<li>Purchase No. : {{ doc.purchase_order_no }}</li>
<li>Required Delivery Date : {{ doc.delivery_date }}</li>
<li>Order Type : {{ doc.order_category }}</li>
</ul>
