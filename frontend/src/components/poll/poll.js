import React, { useState } from 'react';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';

import './poll.css';

export default function Pool({ received_title, is_multiple, choices, id }) {
  const [options, setOptions] = useState(choices);
  const [title, setTitle] = useState(received_title);
  const [type, setType] = useState(is_multiple);
  const [id_pool, setID] = useState(id);

  return (
        <div className='the_pool'>
      <Form>
        <FormGroup className='form-group' controlId={`pool_show_title_${id_pool}`}>
          <FormLabel>{title}</FormLabel>
          <FormLabel className='mk-choice'>Make a choice</FormLabel>
        </FormGroup>
        <FormGroup className='form-group form-options' controlId={`pool_show_options_${id_pool}`}>
          {options.map((option, index) => (
            <div key={index} className='options'>
              <FormCheck
                name={`id_${id_pool}`}
                type={type ? 'checkbox' : 'radio'}
                id={`choice_${id_pool}_${index}`}
                label={options[index]}
              />
            </div>
          ))}
        </FormGroup>
      </Form>
      </div>
  );
}