import React, { useState } from 'react';
import { Modal, Button } from 'antd';

const TriviaPopup = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const handleClose = () => setVisible(false);

  return (
    <>
    <Button type="link" onClick={showModal} style={{ marginTop:-10 }}>🚀 Trivia</Button>
      <Modal
        title="Trivia Time!"
        visible={visible}
        onOk={handleClose}
        onCancel={handleClose}
        footer={[
          <Button key="submit" type="primary" onClick={handleClose}>
            Close
          </Button>
        ]}
      >
        <p>Here&apos;s a fun fact...</p>
      </Modal>
    </>
  );
};

export default TriviaPopup;
