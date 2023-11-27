import React, { useState, useEffect } from 'react';
import FormLabel from 'react-bootstrap/esm/FormLabel';
import FormGroup from 'react-bootstrap/esm/FormGroup';
import FormCheck from 'react-bootstrap/FormCheck';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/esm/Container';
import { AuthContext } from '../../AuthContext';
import { useContext } from 'react';
import axios from 'axios';
import './poll.css';
import Button from 'react-bootstrap/esm/Button';

export default function Pool({ received_title, is_multiple, choices, users_voted, got_votes, id, own}) {
  const [options, setOptions] = useState(choices);
  const [title, setTitle] = useState(received_title);
  const [type, setType] = useState(is_multiple);
  const [id_pool, setID] = useState(id);
  const [owner, setOwner] = useState(own);
  const { isLoggedIn } = useContext(AuthContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const userId = localStorage.getItem('userId');
  const [votes, setVotes] = useState(got_votes); 
  const [usersVoted, setUsersVoted] = useState(users_voted);
  const isVoted = users_voted.includes(userId);
  const [isHis, setIsHis] = useState(false);

  console.log(userId);

  useEffect(() => {
    if (userId === owner) {
        setIsHis(true);
    }
  }, [userId, owner]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!usersVoted.includes(userId)) {
      console.log('Sending vote request');
      const newVotes = [...votes];
      selectedOptions.forEach(index => {
        newVotes[index]++;
      });

      const newUsersVoted = [...usersVoted, userId];
      console.log(newUsersVoted);

      setVotes(newVotes);
      setUsersVoted(newUsersVoted); 

      try {
        console.log(localStorage.getItem('token'));
        const response = await axios.patch(`http://localhost:5000/polls/vote/${id_pool}`, {votes: newVotes}, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        window.location.reload()
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleDelete = async () => {
    try {
        const response = await axios.delete(`http://localhost:5000/polls/${id_pool}`, 
            { id: id_pool }, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );

        if (response.status === 200) {
            console.log("Poll deleted successfully");
            window.location.reload()
        } else {
            console.log("Failed to delete poll");
        }
    } catch (error) {
        console.error(error);
    }
  };

  return (
        <div className='the_pool'>
      <Form onSubmit={handleSubmit}>
        <FormGroup className='form-group' controlId={`pool_show_title_${id_pool}`}>
          <FormLabel className='q-title'>{title}</FormLabel>
          <FormLabel className='mk-choice'>Make a choice</FormLabel>
        </FormGroup>
        <FormGroup className='form-group form-options' controlId={`pool_show_options_${id_pool}`}>
          {Array.isArray(options) && options.map((option, index) => (
            <div key={index} className='options' style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <FormCheck
                name={`id_${id_pool}`}
                type={type ? 'checkbox' : 'radio'}
                id={`choice_${id_pool}_${index}`}
                label={option}
                onChange={() => {
                  const newSelectedOptions = [...selectedOptions];
                  if (newSelectedOptions.includes(index)) {
                    newSelectedOptions.splice(newSelectedOptions.indexOf(index), 1);
                  } else {
                    newSelectedOptions.push(index);
                  }
                  setSelectedOptions(newSelectedOptions);
                }}
              />
              <div>{votes[index] || 0} votes</div>
            </div>
          ))}
        </FormGroup>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {isLoggedIn &&  !isVoted &&  <Button className='vote-btn' variant="primary" type='submit'>Vote</Button>}
          {isLoggedIn && isVoted && <Button className='vote-btn' variant="primary" type='submit' disabled>Voted</Button>}
          {isLoggedIn && isHis && <Button className='delete_btn' variant="primary" onClick={handleDelete}>Delete</Button>}
        </div>
      </Form>
      </div>
  );
}