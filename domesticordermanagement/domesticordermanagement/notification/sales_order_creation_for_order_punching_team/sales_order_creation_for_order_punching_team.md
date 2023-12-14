<p>Sales Order Creation Request:</p>

<h3>Sales Order Creation Request</h3>

<p>Request for new Sales Order Create for Quotation {{doc.quotation_date}} with Number {{doc.name}}.
</p><br/>

<ul>
<li>Quotation No : {{doc.name}}</li>
<li>Bill to Party : {{ doc.bill_to_party }}</li>
<li>Ship to Party : {{ doc.ship_to_party }}</li>
<li>Purchase No. : {{ doc.purchase_order_no }}</li>
<li>Payment Terms : {{doc.payment_terms}}</li>
<li>Status : {{doc.status}}</li>
<li>Delivery Date : {{ doc.delivery_date }}</li>
</ul>

<p>Please Create the Sales Order<br/></p>
