import Swal from 'sweetalert2';
Swal.fire({
    title: 'Are you sure?',
    html: `<p>Do you want to delete this row?</p>
       <p><strong>Product No:</strong> ${idx + 1}</p>
       <p><strong>Columns:</strong> ${record?.columns || 'N/A'}</p>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
}).then((result) => {
    if (result.isConfirmed) {
        this.setState({
            productFieldVariation: this.state.productFieldVariation.filter(r => r !== record)
        });
        Swal.fire('Deleted!', 'The row has been deleted.', 'success');
    }
});


/*

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

clickOnDelete = async (event, record, idx) => {
    event.preventDefault();

    const result = await MySwal.fire({
        title: 'Are you sure?',
        html: `<p>Do you want to delete this row?</p>
               <p><strong>Product No:</strong> ${idx + 1}</p>
               <p><strong>Columns:</strong> ${record?.columns || 'N/A'}</p>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
        this.setState({
            productFieldVariation: this.state.productFieldVariation.filter(r => r !== record)
        });
        MySwal.fire('Deleted!', 'The row has been deleted.', 'success');
    }
};



*/