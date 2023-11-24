import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/esm/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

import './create_pool.css';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';  

export default function CreatePool() {
  const [show, setShow] = useState(false);
  const [options, setOptions] = useState(['']);

  const handleClose = () => {
    setShow(false);
    setOptions(['']);
  }
  const handleShow = () => setShow(true);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  }

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const titleElement = document.getElementById('pool_title');
    const singleChoiceElement = document.getElementById('radio_single');
    const multipleChoiceElement = document.getElementById('radio_multiple');
  
    const title = titleElement.value;
    const isMultiple = multipleChoiceElement.checked;
  
    await axios.post('http://localhost:5000/new_poll', {
      title,
      is_multiple: isMultiple,
      options,
    },{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => {
        console.log('Success:', response.data);
        handleClose();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };
  

  return (
    <>
      <Nav.Link onClick={handleShow} className='nav-link'>Create Poll</Nav.Link>

      <Modal show={show} onHide={handleClose} size='m' centered>
        <Modal.Header closeButton>
          <Modal.Title>Create a Poll</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
                <FormGroup className='form-group' controlId='pool_title'>
                    <FormLabel>Title</FormLabel>
                    <div className='bg-pink w-100 rounded-top'></div>
                    <Form.Control
                        type="text"
                        placeholder="Type your question here"
                        className='pool rounded-bottom straigth-top'
                        required
                    />
                </FormGroup>
                <FormGroup className='form-group' controlId='pool_type'>
                    <FormLabel>Voting Type</FormLabel>
                    <Form.Check
                      name="choice_type"
                      type='radio'
                      id='radio_single'
                      label='Single Choice' 
                      required
                      />
                    <Form.Check
                      name="choice_type"
                      type='radio'
                      id='radio_multiple'
                      label='Muliple choice'
                      required
                    />
                </FormGroup>
                <FormGroup className='form-group'>
                    {options.map((option, index) => (
                      <div key={index} className='options'>
                        <div className='bg-pink w-100 rounded-top'></div>
                        <InputGroup className='mb-3'>
                          <FormControl
                            type='text'
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className='pool'
                            required
                          />
                          <Button
                            variant="outline-light"
                            onClick={() => removeOption(index)}
                            className='rem-btn'
                          >
                            ✕
                          </Button>
                        </InputGroup>
                      </div>
                    ))}
                  <Button className='add-option' onClick={addOption}>
                  + Add Option
                  </Button>
                  <Button variant="primary" type='submit'>
                    Create Poll
                  </Button>
              </FormGroup>

            </Form>
        </Modal.Body>
        <Modal.Footer/>
      </Modal>
    </>
  );
}