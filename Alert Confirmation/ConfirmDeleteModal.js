import React from 'react';
import { Card, Col, OverlayTrigger, Modal, Button, Row, Tooltip } from "react-bootstrap";


const ConfirmDeleteModal = ({ show, onHide, onConfirm, productName }) => (
    <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p style={{ fontSize: '1.1rem', textAlign: 'center' }}>
                Are you sure you want to delete the product: <strong>{productName}</strong>?
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
                Cancel
            </Button>
            <Button variant="danger" onClick={onConfirm}>
                Yes, Delete
            </Button>
        </Modal.Footer>
    </Modal>
);

export default ConfirmDeleteModal;




// .modal - backdrop.show {
//     opacity: 0.5!important; /* Adjust opacity as needed */
//     background - color: transparent!important; /* Ensure the background is transparent */
// }


const [showModal, setShowModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);
const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
};

const confirmDeleteHandler = () => {
    dispatch(deleteProduct(selectedProduct.ID));
    setShowModal(false); // Close the modal after deletion
};




<>
    <div className="button-list text-center" onClick={() => openDeleteModal(row)}>
        <OverlayTrigger placement={row.top} overlay={<Tooltip>Delete</Tooltip>}>
            <i className="ti ti-trash"></i>
        </OverlayTrigger>
    </div>

    <ConfirmDeleteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onConfirm={confirmDeleteHandler}
        productName={selectedProduct ? selectedProduct.Name : ''}
    />
</>

