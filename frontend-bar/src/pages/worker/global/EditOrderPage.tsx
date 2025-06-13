import React from 'react';
import EditOrder from '../../../components/worker/globlal/EditOrder';
import PrintOrderPDF from '../../../components/worker/bar/PrintOrderPDF';

const EditOrderPage: React.FC = () => {
  return (
    <>
      <EditOrder />
      <div className="print-order-button-wrapper">
        <PrintOrderPDF />
      </div>
    </>
  );
};

export default EditOrderPage;