import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
const doc = new jsPDF()


const pdf = () => {
    doc.setLineWidth(5);
    doc.text(85, 15, "Orders Detailed Report");
    autoTable(doc, {
        startY: 20,
        head: [['ORDER_DATE', 'Order ID', 'Product Name', 'Price']],
        body: setOrders().rows.map((value) =>
            [value.ORDER_DATE.substring(0, 10), value.id, value.PRODUCT_NAME, value.SALE_PRICE]
        ),
        foot: [[' ', 'Total Amount', '', `${totalAmount}`]],
        headStyles: { textColor: [255, 255, 255], },
        footStyles: { textColor: [255, 255, 255], },
        theme: 'grid',
        columnStyles: {
            0: { halign: 'right', cellWidth: 30, },
            1: { halign: 'left', cellWidth: 45, },
            2: { halign: 'left', cellWidth: 70, },
            3: { halign: 'right', cellWidth: 45, }
        },
    })


    doc.save('table.pdf')
}


<Button variant="contained" color="inherit" onClick={pdf} endIcon={<i class="fa fa-file-pdf-o text-danger bg-light" aria-hidden="true"></i>}>
    PDF
</Button>