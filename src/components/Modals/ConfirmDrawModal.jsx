import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'react-bootstrap';
import { writeFile } from 'fs';
import { remote } from 'electron';
const { dialog } = remote;

const ConfirmDrawModal = ({ promise }) => {
    const [data, setData] = useState({});
    const [show, setShow] = useState(false);

    const handleClose = () => {
        emitter.emit('confirmGraphDraw', false);
        setData({});
        setShow(false);
    };

    const handleOpen = data => {
        setData(data);
        setShow(true);
    };

    const handleConfirm = () => {
        emitter.emit('confirmGraphDraw', true, data);
        setData({});
        setShow(false);
    };

    const handleSave = () => {
        let target = dialog.showSaveDialogSync({
            defaultPath: 'data.json',
        });

        if (target !== undefined) {
            writeFile(target, JSON.stringify(data, null, 2), err => {
                if (err) console.log(err);
                else console.log('Saved ' + target + ' successfully');
            });
        }
        setShow(false);
        setData({});
        emitter.emit('confirmGraphDraw', false);
    };

    useEffect(() => {
        emitter.on('showGraphConfirm', handleOpen);
        return () => {
            emitter.removeListener('showGraphConfirm', handleOpen);
        };
    }, []);

    return (
        <Modal show={show} onHide={() => handleClose()}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm Graph Draw</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p>
                    This graph will likely take a long time to render. Do you
                    want to continue, cancel, or save the data to json?
                </p>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    bsStyle='danger'
                    onClick={() => {
                        handleClose();
                    }}
                >
                    Cancel
                </Button>
                <Button
                    bsStyle='primary'
                    onClick={() => {
                        handleSave();
                    }}
                >
                    Save Data
                </Button>
                <Button
                    bsStyle='success'
                    onClick={() => {
                        handleConfirm();
                    }}
                >
                    Draw Graph
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

ConfirmDrawModal.propTypes = {};
export default ConfirmDrawModal;
