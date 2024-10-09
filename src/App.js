import React, { useEffect, useState } from 'react';
import { gapi } from 'gapi-script';

const CLIENT_ID = '285627898032-52afj0suvpc07rerfu047pvmn2gt8caa.apps.googleusercontent.com';
const API_KEY = 'AIzaSyCZW-3y6X_PPThOLqEV3N5GwXLZBIA_hMQ';
const SCOPES = 'https://www.googleapis.com/auth/gmail.send';

const SendEmail = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
        scope: SCOPES,
      }).then(() => {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(setIsSignedIn);
        // Handle initial sign-in state
        setIsSignedIn(gapi.auth2.getAuthInstance().isSignedIn.get());
      });
    };

    gapi.load('client:auth2', initClient);
  }, []);

  const sendEmail = () => {
    const encodedMessage = btoa(
      `From: gowthamd2305@gmail.com\r\n` +
      `To: ${recipient}\r\n` +
      `Subject: ${subject}\r\n\r\n` +
      `${message}`
    );

    gapi.client.gmail.users.messages.send({
      userId: 'me',
      resource: {
        raw: encodedMessage,
      },
    }).then(response => {
      console.log('Email sent successfully', response);
    }).catch(error => {
      console.error('Failed to send email', error);
    });
  };

  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  return (
    <div>
      {!isSignedIn ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <>
          <h2>Send an Email</h2>
          <input
            type="email"
            placeholder="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendEmail}>Send Email</button>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      )}
    </div>
  );
};

export default SendEmail;
