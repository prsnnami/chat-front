import React from 'react';
import { gql, graphql } from 'react-apollo';

import { messageListQuery } from './MessageList';

const AddMessage = ({ mutate }) => {
  const handleKeyUp = (evt) => {
    if (evt.keyCode === 13) {
      evt.persist();
      mutate({ 
        variables: { text: evt.target.value },
        update: (store, { data: { addMessage } }) => {
            const data = store.readQuery({query: messageListQuery });
            data.messages.push(addMessage);
            store.writeQuery({ query: messageListQuery, data });
          },
      })
      .then( res => {
        evt.target.value = '';  
      });
    }
  };
return (
    <input
      type="text"
      placeholder="New Message"
      onKeyUp={handleKeyUp}
    />
  );
};
const addMessageMutation = gql`
  mutation addMessage($text: String!) {
    addMessage(text: $text) {
      id
      text
    }
  }
`;
const AddMessageWithMutation = graphql(
  addMessageMutation
)(AddMessage);
export default AddMessageWithMutation;