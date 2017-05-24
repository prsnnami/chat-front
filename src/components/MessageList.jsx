import React from 'react';
import { gql, graphql } from 'react-apollo';

import AddMessage from './AddMessage';

class MessageList extends React.Component {
  
  componentWillMount() {
      this.props.subscribeToNewMessages();
  }
  render() {
    console.log(this.props);
    let { data } = this.props;
    if (data.loading) {
      return <p>Loading ...</p>;
    }
    if (data.error) {
      return <p>{data.error.message}</p>;
    }
    return (
      <div className="channelsList">
        <AddMessage /> 
        { data.messages.map( m => 
          (<div key={m.id} className="channel">{m.text}</div>)
        )}
        
      </div>
    );
  }
}

/*const MessageList = ({ data: {loading, error, messages, newMessage }}) => {
  if (loading) {
    return <p>Loading ...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }
  return (
    <div className="channelsList">
      <AddMessage /> 
      { messages.map( m => 
        (<div key={m.id} className="channel">{m.text}</div>)
      )}
      
    </div>
  );
};*/

export const messageListQuery = gql`
   query MessageListQuery {
     messages {
       id
       text
     }
   }
 `;

const subscriptionQuery = gql`
  subscription onNewMessage {
    newMessage {
      id
      text
    }
  }
`;

export default graphql(messageListQuery, {
  props: props => {
    return {
      data: props.data,
      subscribeToNewMessages: params => {
        return props.data.subscribeToMore({
          document: subscriptionQuery,
          updateQuery: (prev, {subscriptionData}) => {
            console.log('prev', prev);
            console.log('subscriptionData', subscriptionData);
            if (!subscriptionData.data) {
              return prev;
            }
            const { newMessage } = subscriptionData.data;
            return Object.assign({}, prev, {
                messages: [newMessage, ...prev.messages]
            })
          }
        })
      }
    }
  }
})
(MessageList);