<p>Request For Payment Confirmation </p>

<h3>Payment Confirmation</h3>

<p>New Sales Order Created on {{doc.so_date}} with Number {{doc.name}}.
</p><br/>

<p>Confirmation of Payment Recieved For Sales Order Created on {{doc.so_date}} with Number {{doc.name}}.
</p><br/>

<ul>
<li>Sales Order No : {{doc.name}}</li>
<li>Sales Order Date : {{doc.so_date}}</li>
<li>Customer Name : {{ doc.customer_name }}</li>
<li>Bill to Party : {{ doc.bill_to_party }}</li>
<li>Ship to Party : {{ doc.ship_to_party }}</li>
<li>Purchase No. : {{ doc.purchase_order_no }}</li>
<li>Payment Terms : {{doc.payment_terms}}</li>
<li>Status : {{doc.status}}</li>
<li>Delivery Date : {{ doc.delivery_date }}</li>
</ul>

<p>Please Confirm the Payment Recieved</p>
